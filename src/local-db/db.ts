import { log } from 'console';
// import sleep from '../utils/sleep';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

export function initDB(dbName) {
  let db = new sqlite3.Database(dbName);
  db.exec(`CREATE TABLE IF NOT EXISTS groups (
        id INT PRIMARY KEY NOT NULL,
        version INT,
        itemsVersion INT,
        data TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        version INT,
        synced BOOLEAN,
        data TEXT,
        inconsistent BOOLEAN,
        group_id INT ,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(group_id) REFERENCES groups(id)
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS item_Collection (
        item_id TEXT NOT NULL,
        collection_id TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(collection_id) REFERENCES collections(id),
        FOREIGN KEY(item_id) REFERENCES items(id)
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS alsoKnownAs  (
        item_id TEXT NOT NULL,
        group_id INT NOT NULL,
        alsoKnownAs TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(item_id) REFERENCES items(id),
        FOREIGN KEY(group_id) REFERENCES groups(id)
    );`);

  return db;
}

export function createDBConnection(database) {
  //TODO: if database is not string, it means it could be an initilized connection? so just use it? we need to make this check more rigours, it will execute even if database is not string but also not a valid conection
  if (typeof database !== 'string') {
    console.log('connection already opened');
    return database;
  }

  if (!fs.existsSync(database)) {
    return initDB(database);
  }

  return new sqlite3.Database(database);
}

export async function getAllGroups() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const groups = await prisma.groups.findMany();
  //await saveGroup();
  return groups;
}
5;

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

export async function createGroup(groupData) {
  const { database, group } = groupData;
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.run(
      `INSERT into groups (id,version,data,createdAt,updatedAt) VALUES ($id, $version, $data, datetime('now'), datetime('now'))`,
      {
        $id: group.id,
        $version: group.version,
        $data: JSON.stringify(group),
      },
      (err, row) => {
        if (err) {
          rej(err);
          db.close();
          return;
        }
        res(row);
        db.close();
      },
    );
  });
}

export async function updateGroup(groupData) {
  const { database, group } = groupData;
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.run(
      `UPDATE  groups SET version=$version, data=$data, updatedAt=datetime('now') WHERE id=$id`,
      {
        $id: group.id,
        $version: group.version,
        $data: JSON.stringify(group),
      },
      (err, row) => {
        if (err) {
          rej(err);
          db.close();
          return;
        }
        res(row);
        db.close();
      },
    );
  });
}

// get all collections
export function getAllCollections({ database }) {
  const db = createDBConnection(database);
  const sql = 'SELECT * FROM collections';

  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

let collections = [];
//@ts-ignore
async function insertCollections(prisma) {
  // insert multiple rows of collections
  await prisma.collections.createMany({
    data: collections,
    skipDuplicates: true,
  });
  collections = [];
}
let newItems = [];
//@ts-ignore

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

async function updateItems(prisma) {
  // const { PrismaClient } = require('@prisma/client');
  // const prisma = new PrismaClient();
  log('updating items...');
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
    log('finished updating items');
    UpdatedItems = [];
  }
}

let newAlsoKnownAs = [];
//@ts-ignore

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
async function updateAlsoknownAs(prisma) {
  // insert multiple rows of items
  log('updating alsoKnownAs...');
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

    log('finished updating alsoKnownAs');
    updatedAlsoKnownAs = [];
  }
}

let newItemCollections = [];
//@ts-ignore

async function insertItemCollections(prisma) {
  // insert multiple rows of items
  if (newItemCollections.length > 0) {
    await prisma.collection_items.createMany({
      data: newItemCollections,
      skipDuplicates: true,
    });
    newItemCollections = [];
  }
}

//@ts-ignore
// async function updateGroupItemsVersion() {
//   const { PrismaClient } = require('@prisma/client');
//   const prisma = new PrismaClient();
//   // insert multiple rows of items
//   if (newItemCollections.length > 0) {
//     await prisma.groups.updateMany({
//       where: {
//         id: {
//           in: newItemCollections.map((item) => item.group_id),
//         },
//       },
//       data: {
//         itemsVersion: 0,
//       },
//     });
//   }
// }

export async function saveZoteroItems2(allFetchedItems, lastModifiedVersion, groupId) {
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
      if (item.data.collections) {
        handleCollections(item, allCollectionsIds, collections, newItemCollections);
      }
      if (item.data.extra) {
        handleAlsoKnownAs(item, alsoKnownAs, newAlsoKnownAs, updatedAlsoKnownAs);
      }
    }
  }

  log('items', newItems.length);
  log('collections', collections.length);
  log('newItemCollections', newItemCollections.length);
  log('UpdatedItems', UpdatedItems.length);
  log('newAlsoKnownAs', newAlsoKnownAs.length);
  log('updatedAlsoKnownAs', updatedAlsoKnownAs.length);

  await insertCollections(prisma);
  await insertItems(prisma);
  await insertAlsoKnownAs(prisma);
  await updateAlsoknownAs(prisma);

  await insertItemCollections(prisma);
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

//@ts-ignore
function handleCollections(item, allCollectionsIds, collections, newItemCollections) {
  item.data.collections.forEach(async (collection) => {
    if (!allCollectionsIds.includes(collection)) {
      collections.push({
        id: collection,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    newItemCollections.push({
      item_id: item.key,
      collection_id: collection,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

// get alsoKnownAs for a group and item

export async function test(allFetchedItems, lastModifiedVersion, groupId) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const allItems = await prisma.items.findMany({
    where: {
      group_id: parseInt(groupId),
    },
  });
  const allItemsIds = allItems.map((item) => item.id);
  const allCollections = await prisma.collections.findMany();
  const allCollectionsIds = allCollections.map((collection) => collection.id);
  const alsoKnownAs = await prisma.alsoKnownAs.findMany({
    where: {
      group_id: parseInt(groupId),
    },
  });
  const allGroups = await prisma.groups.findMany();
  const allGroupsIds = allGroups.map((group) => group.id);

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
        if (!allItemsIds.includes(item.key)) {
          await prisma.items.create({
            data: {
              id: item.key,
              version: item.version,
              data: item,
              inconsistent: item.inconsistent,
              group_id: item.library.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              isDeleted: true,
            },
          });
        } else {
          await prisma.items.update({
            where: {
              id: item.key,
            },
            data: {
              version: item.version,
              data: item,
              updatedAt: new Date(),
              isDeleted: true,
            },
          });
        }

        if (item.data.extra) {
          if (alsoKnownAs.some((i) => i.item_id === item.key && i.group_id === item.library.id)) {
            await prisma.alsoKnownAs.updateMany({
              where: {
                item_id: item.key,
                group_id: item.library.id,
              },
              data: {
                data: item.data.extra,
                updatedAt: new Date(),
                isDeleted: true,
              },
            });
          } else {
            await prisma.alsoKnownAs.create({
              data: {
                item_id: item.key,
                group_id: item.library.id,
                data: item.data.extra,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: true,
              },
            });
          }
        }
      } else {
        if (!allItemsIds.includes(item.key)) {
          await prisma.items.create({
            data: {
              id: item.key,
              version: item.version,
              data: item,
              inconsistent: item.inconsistent,
              group_id: item.library.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.items.update({
            where: {
              id: item.key,
            },
            data: {
              version: item.version,
              data: item,
              updatedAt: new Date(),
            },
          });
        }

        if (item.data.extra) {
          if (alsoKnownAs.some((i) => i.item_id === item.key && i.group_id === item.library.id)) {
            await prisma.alsoKnownAs.updateMany({
              where: {
                item_id: item.key,
                group_id: item.library.id,
              },
              data: {
                data: item.data.extra,
                updatedAt: new Date(),
              },
            });
          } else {
            await prisma.alsoKnownAs.create({
              data: {
                item_id: item.key,
                group_id: item.library.id,
                data: item.data.extra,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      // else if (allItemsIds.includes(item.key) && item.data.deleted==1)
      // {
      //   await prisma.items.delete({
      //     where: {
      //       id: item.key,
      //     },
      //   });

      //   let alsoknownas  = await prisma.alsoKnownAs.findMany({
      //     where: {
      //       data:{
      //         constains: item.key
      //       }
      //     },
      //   });
      //   // remove this item from alsoKnownAs and keep the rest
      //   alsoknownas.forEach(async (also) => {
      //     let data = also.data;
      //     let index = data.indexOf(item.key);
      //     if (index > -1) {
      //      // delete 8 letters from the array after the index and 8 letters before the index
      //       data.splice(index, 8);
      //       data.splice(index-8, 8);

      //     }
      //     await prisma.alsoKnownAs.update({
      //       where: {
      //         id: also.id,
      //       },
      //       data: {
      //         data: data,
      //       },
      //     });
      //   }
      //   );
      //  }

      if (item.data.collections) {
        for await (const collection of item.data.collections) {
          if (!allCollectionsIds.includes(collection)) {
            await prisma.collections.create({
              data: {
                id: collection,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            await prisma.collection_items.create({
              data: {
                item_id: item.key,
                collection_id: collection,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
            allCollectionsIds.push(collection);
          } else {
            await prisma.collections.update({
              where: {
                id: collection,
              },
              data: {
                updatedAt: new Date(),
              },
            });
          }
        }
      }
    }
  }

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

export function saveZoteroItems({ allFetchedItems, database, lastModifiedVersion }) {
  //batch inserts
  // batch updates
  //fetch all keys from db first to see which items need to be created/updated
  // write one big query to insert and update all items at once

  return new Promise(async (resolve, reject) => {
    // get all items from prisma
    //const allItems = await prisma.items.findMany();
    // await db.all('SELECT * from items', async (err, rows) => {
    //   if (err) {
    //     return reject(err);
    //   }
    //   // get only value of id
    //   const dbItems = rows.map((row) => row.id);
    //   // get all id of collections
    //   const allCollections = await getAllCollections({ database });
    //   //@ts-ignore
    //   const allCollectionsIds = allCollections.map(
    //     (collection) => collection.id,
    //   );
    //   // console.log('allCollectionsIds', allCollectionsIds.length);
    //   // console.log('dbItems', dbItems.length);
    //   // const existingItemIdsMap = rows.reduce(
    //   //   (a, c) => ({ ...a, [c.id]: c }),
    //   //   {},
    //   // );
    //   // const existingCollectionIdsMap = rows.reduce(
    //   //   (a, c) => ({ ...a, [c.id]: c }),
    //   //   {},
    //   // );
    //   let collections = [];
    //   const insertSql = `INSERT into items (id,version,data,inconsistent,createdAt,updatedAt, group_id ) VALUES ($id, $version, $data, $inconsistent, datetime('now'), datetime('now'), $group_id)`;
    //   const updateSql = `UPDATE items SET version=$version, data=$data, inconsistent=$inconsistent, updatedAt=datetime('now') WHERE id=$id`;
    //   const itemsLastVersionSql = `UPDATE groups SET itemsVersion=$version, updatedAt=datetime('now') WHERE id=$id`;
    //   const insertCollectionSql = `INSERT into collections (id,createdAt,updatedAt) VALUES ($id, datetime('now'), datetime('now'))`;
    //   const insertItemCollectionSql = `INSERT into item_Collection (item_id,collection_id,createdAt,updatedAt) VALUES ($item_id, $collection_id, datetime('now'), datetime('now'))`;
    //   const insertAlsoKnownAsSql = `INSERT into alsoKnownAs (item_id,group_id,alsoKnownAs,createdAt,updatedAt) VALUES ($item_id, $group_id, $alsoKnownAs, datetime('now'), datetime('now'))`;
    //   await db.serialize(async function () {
    //     await db.run('BEGIN');
    //     let createStmt = await db.prepare(insertSql);
    //     let updateStmt = await db.prepare(updateSql);
    //     let itemsLastVersionUpdateStmt = await db.prepare(itemsLastVersionSql);
    //     let insertCollectionStmt = await db.prepare(insertCollectionSql);
    //     let insertItemCollectionStmt = await db.prepare(
    //       insertItemCollectionSql,
    //     );
    //     let insertAlsoKnownAsStmt = await db.prepare(insertAlsoKnownAsSql);
    //     await allFetchedItems.forEach(async (groupItems) => {
    //       await Promise.resolve(groupItems).then(async (items) => {
    //         items.forEach(async (item) => {
    //           await Promise.resolve(item).then(async (i) => {
    //             if (i.data.collections) {
    //               i.data.collections.forEach(async (collection) => {
    //                 //console.log('collections', collection);
    //                 if (
    //                   !allCollectionsIds.includes(collection) &&
    //                   !collections.includes(collection) &&
    //                   collection
    //                 ) {
    //                   // console.log(
    //                   //   'condtion',
    //                   //   !existingCollectionIdsMap[collection],
    //                   //   !collections.includes(collection),
    //                   //   collection,
    //                   // );
    //                   collections.push(collection);
    //                   await insertCollectionStmt.run({
    //                     $id: collection,
    //                   });
    //                 }
    //               });
    //             }
    //             // create or update item and check if it has a collection
    //             if (!dbItems.includes(i.key)) {
    //               await createStmt.run({
    //                 $id: i.key,
    //                 $version: i.version,
    //                 $data: JSON.stringify(i.data),
    //                 $inconsistent: i.inconsistent,
    //                 $group_id: i.library.id,
    //               });
    //               if (i.data.extra) {
    //                 await insertAlsoKnownAsStmt.run({
    //                   $item_id: i.key,
    //                   $group_id: i.library.id,
    //                   $alsoKnownAs: JSON.stringify(i.data.extra),
    //                 });
    //               }
    //             }
    //             if (dbItems.includes(i.key)) {
    //               await updateStmt.run({
    //                 $id: i.key,
    //                 $version: i.version,
    //                 $data: JSON.stringify(i.data),
    //                 $inconsistent: i.inconsistent,
    //               });
    //             }
    //             // check if item has a collection
    //             if (i.data.collections) {
    //               i.data.collections.forEach(async (collection) => {
    //                 if (collection) {
    //                   //  console.log(' item', i.key, 'collection', collection);
    //                   await insertItemCollectionStmt.run({
    //                     $item_id: i.key,
    //                     $collection_id: collection,
    //                   });
    //                 }
    //               });
    //             }
    //           });
    //           // const existingItem = existingItemIdsMap[item.key];
    //           // if (existingItem) {
    //           //   updateStmt.run({
    //           //     $id: item.key,
    //           //     $version: item.version,
    //           //     $data: JSON.stringify(item),
    //           //     $inconsistent: false,
    //           //   });
    //           // } else {
    //           //   createStmt.run({
    //           //     $id: item.key,
    //           //     $version: item.version,
    //           //     $data: JSON.stringify(item),
    //           //     $inconsistent: false,
    //           //   });
    //           // }
    //         });
    //         // get key and value from last modified item and update group
    //         // await itemsLastVersionUpdateStmt.run({
    //         //   $id: groupItems.groupId,
    //         //   $version: lastModifiedVersion,
    //         // });
    //       });
    //       // groupItems.forEach((item) => {
    //       //   if (item.key in existingItemIdsMap) {
    //       //     // console.log('updating: ', item.key);
    //       //     updateStmt.run({
    //       //       $id: item.key,
    //       //       $version: item.version,
    //       //       $inconsistent: item.inconsistent,
    //       //       $data: JSON.stringify(item),
    //       //     });
    //       //   } else {
    //       //     // console.log('creating: ', item.key);
    //       //     createStmt.run({
    //       //       $id: item.key,
    //       //       $inconsistent: item.inconsistent,
    //       //       $version: item.version,
    //       //       $data: JSON.stringify(item),
    //       //     });
    //       //   }
    //       // });
    //     });
    //     console.log(lastModifiedVersion);
    //     await Object.entries(lastModifiedVersion).forEach(
    //       ([group, version]) => {
    //         itemsLastVersionUpdateStmt.run({ $id: group, $version: version });
    //       },
    //     );
    //     await Object.entries(lastModifiedVersion).forEach(([group, version]) =>
    //       console.log('group', group, 'version', version),
    //     );
    //     await createStmt.finalize();
    //     await updateStmt.finalize();
    //     await insertCollectionStmt.finalize();
    //     await insertItemCollectionStmt.finalize();
    //     await insertAlsoKnownAsStmt.finalize();
    //     await itemsLastVersionUpdateStmt.finalize();
    //     try {
    //       await db.run('COMMIT', () => {
    //         db.close();
    //         resolve(true);
    //       });
    //     } catch (error) {
    //       console.log('error', error);
    //     }
    //     // sleep for 1 second
    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //   });
    // });
  });
}

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

export async function fetchAllItems({
  database,
  filters,
}: {
  database: string;
  filters?: { keys: Array<string>; errors: boolean };
}): Promise<Array<{ id: string; data: string }>> {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  // get all items count from database
  const allItemsCount = await prisma.items.count();

  console.log('total items found', allItemsCount);

  return undefined;
}
