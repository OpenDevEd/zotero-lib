export async function getAllGroups() {
  const { PrismaClient } = require('../../prisma/generated/client2');
  const prisma = new PrismaClient();

  const groups = await prisma.groups.findMany();
  //await saveGroup();
  return groups;
}

export async function saveGroup(groupData) {
  const { PrismaClient } = require('../../prisma/generated/client2');
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
}

let newItems = [];
//@ts-ignore

async function insertItems(prisma) {
  // insert multiple rows of items
  let creates = [];
  for (const item of newItems) {
    creates.push(
      prisma.items.create({
        data: {
          id: item.id,
          version: item.version,
          data: item.data,
          group_id: item.group_id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: item.isDeleted,
        },
      }),
    );
  }
  await prisma.$transaction(creates);
  // await prisma.items.createMany({
  //   data: newItems,
  //   skipDuplicates: true,
  // });
  newItems = [];
}

let UpdatedItems = [];
//@ts-ignore

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
  let creates = [];
  for (const item of archiveItems) {
    creates.push(
      prisma.itemsArchive.create({
        data: {
          id: item.id,
          version: item.version,
          data: item.data,
          group_id: item.group_id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: item.isDeleted,
        },
      }),
    );
  }
  await prisma.$transaction(creates);
  // await prisma.itemsArchive.createMany({
  //   data: archiveItems,
  // });
  // update multiple rows of items in parallel
  if (UpdatedItems.length > 0) {
    for (const item of UpdatedItems) {
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
    }

    console.log('finished updating items');
    UpdatedItems = [];
  }
}

let newAlsoKnownAs = [];
//@ts-ignore

async function insertAlsoKnownAs(prisma) {
  // insert multiple rows of items
  if (newAlsoKnownAs.length > 0) {
    let creates = [];
    for (const item of newAlsoKnownAs) {
      creates.push(
        prisma.alsoKnownAs.create({
          data: item,
        }),
      );
    }
    await prisma.$transaction(creates);
    // await prisma.alsoKnownAs.createMany({
    //   data: newAlsoKnownAs,
    //   skipDuplicates: true,
    // });
    newAlsoKnownAs = [];
  }
}

let updatedAlsoKnownAs = [];

async function updateAlsoKnownAs(prisma) {
  // insert multiple rows of items
  console.log('updating alsoKnownAs...');
  if (updatedAlsoKnownAs.length > 0) {
    for (const item of updatedAlsoKnownAs) {
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
    }

    console.log('finished updating alsoKnownAs');
    updatedAlsoKnownAs = [];
  }
}

export async function saveZoteroItems(allFetchedItems, lastModifiedVersion, groupId: string) {
  const { PrismaClient } = require('../../prisma/generated/client2');
  const prisma = new PrismaClient();

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

function handleDeletedItem(item, allItemsIds, newItems, updatedItems) {
  if (!allItemsIds.includes(item.key)) {
    newItems.push({
      id: item.key,
      version: item.version,
      data: JSON.stringify(item),
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
      data: JSON.stringify(item),
      updatedAt: new Date(),
      isDeleted: true,
    });
  }
}
//@ts-ignore

function handleUpdatedOrNewItem(item, allItemsIds, newItems, updatedItems) {
  if (!allItemsIds.includes(item.key)) {
    newItems.push({
      id: item.key,
      version: item.version,
      data: JSON.stringify(item),
      // inconsistent: item.inconsistent,
      group_id: item.library.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    updatedItems.push({
      id: item.key,
      version: item.version,
      data: JSON.stringify(item),
      updatedAt: new Date(),
    });
  }
}

//@ts-ignore
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

export async function lookupItems(keys) {
  const { PrismaClient } = require('../../prisma/generated/client2');
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

export async function FindEmptyItemsFromDatabase(group_id: string) {
  const { PrismaClient } = require('../../prisma/generated/client2');
  const prisma = new PrismaClient();

  const items = await prisma.items.findMany({
    where: {
      isDeleted: false,
      group_id: group_id,
    },
  });

  const filteredItems = items.filter((item) => {
    const data = JSON.parse(item.data);
    return data.data === '' && data.title === '';
  });

  return filteredItems;
}