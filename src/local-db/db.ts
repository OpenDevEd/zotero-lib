// import path from 'path';
/**
 * Retrieves all groups from the database.
 * @returns {Promise<Group[]>} A promise that resolves to an array of groups.
 */
export async function getAllGroups() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const groups = await prisma.groups.findMany();
  //await saveGroup();
  return groups;
}

/**
 * Saves the group data to the database.
 * If a group with the same ID already exists, it updates the group's version and updatedAt fields.
 * Otherwise, it creates a new group with the provided data.
 * @param {Array<Object>} groupData - The group data to be saved.
 * @returns {Promise<void>} - A promise that resolves when the group data is saved.
 */
export async function saveGroup(groupData) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const groups = await prisma.groups.findMany();
  const groupIds = groups.map((group) => group.id);
  for (const group of groupData) {
    const { id, version } = group;
    if (groupIds.includes(id)) {
      await prisma.groups.update({
        where: {
          id: id,
        },
        data: {
          version: parseInt(version),

          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.groups.create({
        data: {
          id: id,
          version: parseInt(version),
          itemsVersion: 0,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
  // if (group) {
  //   await prisma.groups.update({
  //     where: {
  //       id: groupData.id,
  //     },
  //     data: {
  //       version: parseInt(groupData.version),
  //       updatedAt: new Date(),
  //     },
  //   });
  // } else {
  //   await prisma.groups.create({
  //     data: {
  //       id: groupData.id,
  //       version: parseInt(groupData.version),
  //       itemsVersion: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     },
  //   });
  // }
}

// get all collections

// let collections = [];
//@ts-ignore
// async function insertCollections(prisma) {
//   // insert multiple rows of collections
//   await prisma.collections.createMany({
//     data: collections,
//     skipDuplicates: true,
//   });
//   collections = [];
// }
let newItems = [];
//@ts-ignore

/**
 * Inserts multiple rows of items into the database.
 *
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @returns {Promise<void>} - A Promise that resolves when the items are inserted.
 */
async function insertItems(prisma) {
  // insert multiple rows of items
  await prisma.items.createMany({
    data: newItems,
    skipDuplicates: true,
  });
  newItems = [];
}

let UpdatedItems = [];
//@ts-ignore

/**
 * Updates the items in the database.
 *
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @returns {Promise<void>} - A promise that resolves when the items are updated.
 */
async function updateItems(prisma) {
  // const { PrismaClient } = require('@prisma/client');
  // const prisma = new PrismaClient();
  console.log('updating items...');
  let archive: any[string] = UpdatedItems.map((item) => item.id);
  let archiveItems = await prisma.items.findMany({
    where: {
      id: {
        in: archive,
      },
    },
  });
  await prisma.itemsArchive.createMany({
    data: archiveItems,
  });
  // update multiple rows of items in parallel
  if (UpdatedItems.length > 0) {
    await Promise.all(
      UpdatedItems.map(async (item) => {
        await prisma.items.update({
          where: {
            id: item.id,
          },
          data: {
            version: item.version,
            data: item.data,
            updatedAt: new Date(),
            isDeleted: item.isDeleted,
          },
        });
      }),
    );
    console.log('finished updating items');
    UpdatedItems = [];
  }
}

let newAlsoKnownAs = [];
//@ts-ignore

/**
 * Inserts multiple rows of items into the "alsoKnownAs" table.
 *
 * @param prisma - The Prisma client instance.
 * @returns A promise that resolves when the insertion is complete.
 */
async function insertAlsoKnownAs(prisma) {
  // insert multiple rows of items
  if (newAlsoKnownAs.length > 0) {
    await prisma.alsoKnownAs.createMany({
      data: newAlsoKnownAs,
      skipDuplicates: true,
    });
    newAlsoKnownAs = [];
  }
}
let updatedAlsoKnownAs = [];
/**
 * Updates the 'alsoKnownAs' records in the database using the provided Prisma client.
 * @param prisma - The Prisma client instance.
 * @returns A Promise that resolves when the update is complete.
 */
async function updateAlsoKnownAs(prisma) {
  // insert multiple rows of items
  console.log('updating alsoKnownAs...');
  if (updatedAlsoKnownAs.length > 0) {
    updatedAlsoKnownAs.map(async (item) => {
      await prisma.alsoKnownAs.update({
        where: {
          id: item.id,
          item_id: item.item_id,
          group_id: item.group_id,
        },
        data: {
          data: item.data,
          updatedAt: new Date(),
          isDeleted: item.isDeleted,
        },
      });
    });

    console.log('finished updating alsoKnownAs');
    updatedAlsoKnownAs = [];
  }
}

/**
 * Saves Zotero items to the database.
 *
 * @param allFetchedItems - An array of fetched items.
 * @param lastModifiedVersion - The last modified version of the items.
 * @param groupId - The ID of the group.
 * @returns {Promise<void>}
 */
export async function saveZoteroItems(allFetchedItems, lastModifiedVersion, groupId: string) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  // console.log(lastModifiedVersion);

  await prisma.$connect();

  const allItems = await prisma.items.findMany({
    where: {
      group_id: parseInt(groupId),
    },
  });
  const allItemsIds = allItems.map((item) => item.id);
  console.log('allItemsIds', allItemsIds.length);

  //@ts-ignore
  const allCollections = await prisma.collections.findMany();
  //@ts-ignore
  const allCollectionsIds = allCollections.map((collection) => collection.id);
  //@ts-ignore
  const alsoKnownAs = await prisma.alsoKnownAs.findMany({
    where: {
      group_id: parseInt(groupId),
    },
  });
  const allGroups = await prisma.groups.findMany();
  const allGroupsIds = allGroups.map((group) => group.id);
  console.log('allGroupsIds', allGroupsIds.length);
  Object.entries(lastModifiedVersion).forEach(async ([group]) => {
    if (!allGroupsIds.includes(parseInt(group))) {
      await prisma.groups.create({
        data: {
          id: parseInt(group),
          version: 0,
          itemsVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  });

  for await (const items of allFetchedItems) {
    for await (const item of items) {
      if (item.data.deleted == 1) {
        handleDeletedItem(item, allItemsIds, newItems, UpdatedItems);
      } else {
        handleUpdatedOrNewItem(item, allItemsIds, newItems, UpdatedItems);
      }
      if (item.data.extra) {
        handleAlsoKnownAs(item, alsoKnownAs, newAlsoKnownAs, updatedAlsoKnownAs);
      }
    }
  }

  console.log('items', newItems.length);
  console.log('UpdatedItems', UpdatedItems.length);
  console.log('newAlsoKnownAs', newAlsoKnownAs.length);
  console.log('updatedAlsoKnownAs', updatedAlsoKnownAs.length);

  // await insertCollections(prisma);
  await insertItems(prisma);
  await insertAlsoKnownAs(prisma);
  await updateAlsoKnownAs(prisma);

  // await insertItemCollections(prisma);
  await updateItems(prisma);

  Object.entries(lastModifiedVersion).forEach(async ([group, version]) => {
    await prisma.groups.update({
      where: {
        id: parseInt(group),
      },
      data: {
        itemsVersion: parseInt(version.toString()),
        updatedAt: new Date(),
      },
    });
  });
}

//@ts-ignore

/**
 * Handles a deleted item by adding it to the appropriate array based on its existence in `allItemsIds`.
 * If the item is not found in `allItemsIds`, it is added to the `newItems` array.
 * If the item is found in `allItemsIds`, it is added to the `updatedItems` array.
 *
 * @param item - The deleted item to handle.
 * @param allItemsIds - An array of all item IDs.
 * @param newItems - An array to store new items.
 * @param updatedItems - An array to store updated items.
 */
function handleDeletedItem(item, allItemsIds, newItems, updatedItems) {
  if (!allItemsIds.includes(item.key)) {
    newItems.push({
      id: item.key,
      version: item.version,
      data: item,
      // inconsistent: item.inconsistent,
      group_id: item.library.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
    });
  } else {
    updatedItems.push({
      id: item.key,
      version: item.version,
      data: item,
      updatedAt: new Date(),
      isDeleted: true,
    });
  }
}
//@ts-ignore

/**
 * Handles an updated or new item.
 *
 * @param item - The item to handle.
 * @param allItemsIds - An array of all item IDs.
 * @param newItems - An array to store new items.
 * @param updatedItems - An array to store updated items.
 */
function handleUpdatedOrNewItem(item, allItemsIds, newItems, updatedItems) {
  if (!allItemsIds.includes(item.key)) {
    newItems.push({
      id: item.key,
      version: item.version,
      data: item,
      // inconsistent: item.inconsistent,
      group_id: item.library.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    updatedItems.push({
      id: item.key,
      version: item.version,
      data: item,
      updatedAt: new Date(),
    });
  }
}

//@ts-ignore
/**
 * Handles the "also known as" data for an item.
 *
 * @param item - The item object.
 * @param alsoKnownAs - The array of existing "also known as" data.
 * @param newAlsoKnownAs - The array to store new "also known as" data.
 * @param updateAlsoKnownAs - The array to store updated "also known as" data.
 */
function handleAlsoKnownAs(item, alsoKnownAs, newAlsoKnownAs, updateAlsoKnownAs) {
  if (alsoKnownAs.some((i) => i.item_id === item.key && i.group_id === item.library.id)) {
    updateAlsoKnownAs.push({
      id: alsoKnownAs.find((i) => i.item_id === item.key && i.group_id === item.library.id).id,
      item_id: item.key,
      group_id: item.library.id,
      data: item.data.extra,
      isDeleted: item.data.deleted == 1,
      updatedAt: new Date(),
    });
  } else {
    newAlsoKnownAs.push({
      item_id: item.key,
      group_id: item.library.id,
      data: item.data.extra,
      isDeleted: item.data.deleted == 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * Looks up items in the database based on the provided keys.
 * @param keys - The keys to lookup items for.
 * @returns A promise that resolves to an array of items matching the provided keys.
 */
export async function lookupItems(keys) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const items = await prisma.items.findMany({
    where: {
      id: {
        in: keys.keys,
      },
    },
  });
  return items;
}

/**
 * Finds empty items from the database for a given group ID.
 * @param group_id - The ID of the group to search for empty items.
 * @returns A promise that resolves to an array of empty items.
 */
export async function FindEmptyItemsFromDatabase(group_id: string) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const items = await prisma.items.findMany({
    where: {
      data: {
        path: ['data', 'title'],
        equals: '',
      },
      isDeleted: false,
      group_id: group_id,
    },
  });
  return items;
}
