import { Zotero } from '../zotero-lib';

async function getItems(items: string[]): Promise<{}> {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  let allItems: {} = await prisma.items.findMany({
    where: {
      id: {
        in: items,
      },
      //TODO: add isDeleted to the where clause
    },
  });
  await prisma.$disconnect();
  return allItems;
}

export async function get_oldest_item(items: string[]) {
  let allItems = await getItems(items);
  // change object to array
  let allItemsArray = Object.values(allItems);
  // sort the array by date descending
  allItemsArray.sort((a, b) => {
    return (
      //@ts-ignore
      new Date(a.data.data.dateAdded).getTime() -
      //@ts-ignore
      new Date(b.data.data.dateAdded).getTime()
    );
  });
  //@ts-ignore
  return [
    //@ts-ignore
    allItemsArray[0].data.key,
    //@ts-ignore
    allItemsArray.slice(1).map((item) => item.data.key),
  ];
}

export async function get_Newest_item(items: string[]) {
  let allItems = await getItems(items);
  // change object to array
  let allItemsArray = Object.values(allItems);
  // sort the array by date descending
  allItemsArray.sort((a, b) => {
    return (
      //@ts-ignore
      new Date(b.data.data.dateAdded).getTime() -
      //@ts-ignore
      new Date(a.data.data.dateAdded).getTime()
    );
  });
  //@ts-ignore
  // return the newest item and rest as array
  return [
    //@ts-ignore
    allItemsArray[0].data.key,
    //@ts-ignore
    allItemsArray.slice(1).map((item) => item.data.key),
  ];
}

export async function merge_items(groupid, items: string[]) {
  let itemarr = await get_oldest_item(items);
  let base = itemarr[0];
  let deleted = itemarr[1];
  await mergeMultipleItems(groupid, base, deleted);
}

async function changedParentItem(groupid, child, newParent) {
  const zotero = new Zotero({ verbose: false, 'group-id': groupid });
  await zotero.update_item({
    key: child,
    json: {
      parentItem: newParent,
    },
  });
  return 0;
}

let noMergeType = ['note', 'attachment'];
async function mergeTwoItems(groupid, base, deleted) {
  const zotero = new Zotero({ verbose: false, 'group-id': groupid });
  const deletedItem = await zotero.item({ key: deleted, fullresponse: true });
  const baseItem = await zotero.item({ key: base, fullresponse: true });
  if (noMergeType.includes(deletedItem.result.data.itemType) || noMergeType.includes(baseItem.result.data.itemType)) {
    console.log('one of the items is not a note or attachment');
    return 0;
  }
  if (deletedItem.result.data.itemType !== baseItem.result.data.itemType) {
    console.log('item types are not the same');
    return 0;
  }

  if (deletedItem.result.data.deleted || baseItem.result.data.deleted) {
    console.log(' one of the items is already deleted');
    return 0;
  }

  let children;

  let relations;
  // check if base relations dc:replaces is empty if so add relations as  string of deleted item in this format http://zotero.org/groups/{deleted.result.library.id}/items/{deleted.result.key}
  // if not add to relations as array of strings
  if (!Object.keys(baseItem.result.data.relations).includes('dc:replaces')) {
    relations = {
      'dc:replaces': `http://zotero.org/groups/${deletedItem.result.library.id}/items/${deletedItem.result.key}`,
    };
  } else {
    if (!Array.isArray(baseItem.result.data.relations['dc:replaces'])) {
      relations = {
        'dc:replaces': [
          baseItem.result.data.relations['dc:replaces'],
          `http://zotero.org/groups/${deletedItem.result.library.id}/items/${deletedItem.result.key}`,
        ],
      };
    } else {
      relations = {
        'dc:replaces': [
          ...baseItem.result.data.relations['dc:replaces'],
          `http://zotero.org/groups/${deletedItem.result.library.id}/items/${deletedItem.result.key}`,
        ],
      };
    }
  }
  // check if there any duplicates in relations if so remove them
  if (Array.isArray(relations['dc:replaces'])) {
    relations['dc:replaces'] = relations['dc:replaces'].filter(
      (item, index) => relations['dc:replaces'].indexOf(item) === index,
    );
  }
  let originRelations = baseItem.result.data.relations;
  // add or replace relations to base item
  baseItem.result.data.relations['dc:replaces'] = relations['dc:replaces'];
  let note = null;
  try {
    //update deleted item
    await zotero.update_item({
      key: deletedItem.result.key,
      json: {
        deleted: 1,
        // title: `deleted ${deletedItem.result.data.title}`,
      },
    });
    // update base item
    await zotero.update_item({
      key: baseItem.result.key,
      json: {
        relations: baseItem.result.data.relations,
      },
    });
    note = await zotero.attachNoteToItem(baseItem.result.key, {
      content: `This item ${baseItem.result.key} was merged with ${
        deletedItem.result.key
      } on ${new Date().toISOString()} with metadata of base is\n ${JSON.stringify(
        baseItem.result.meta,
        null,
        2,
      )} and metadata of deleted is\n ${JSON.stringify(deletedItem.result.meta, null, 2)}`,
      tags: ['merged', 'deleted'],
    });

    // move children to base item
    if (deletedItem.result.meta.numChildren > 0) {
      children = await zotero.item({
        key: deletedItem.result.key,
        fullresponse: true,
        children: true,
      });

      for (const child of children.result) {
        await changedParentItem(groupid, child.key, baseItem.result.key);
      }
    }
  } catch (error) {
    // revert changes
    console.log(error);
    console.log(`Error merging ${deletedItem.result.key} with ${baseItem.result.key}`);
    await zotero.update_item({
      key: deletedItem.result.key,
      json: {
        deleted: 0,
      },
    });
    await zotero.update_item({
      key: baseItem.result.key,
      json: {
        relations: originRelations,
      },
    });
    if (note) {
      await zotero.update_item({
        key: note.result.key,
        json: {
          deleted: 1,
        },
      });
    }

    if (deletedItem.result.meta.numChildren > 0) {
      for (const child of children.result) {
        await changedParentItem(groupid, child.key, deletedItem.result.key);
      }
    }

    console.log(`Reverting changes to ${deletedItem.result.key} and ${baseItem.result.key} done`);

    process.exit(1);
  }

  return 1;
}
//@ts-ignore
async function mergeMultipleItems(groupid, base, deletedarr) {
  for (const deleted of deletedarr) {
    let result = await mergeTwoItems(groupid, base, deleted);
    if (result === 0) {
      console.log(`Error merging ${deleted} with ${base}`);
    }
  }

  return 0;
}
