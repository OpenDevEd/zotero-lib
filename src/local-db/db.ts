import { ZoteroGroup } from './types';

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

export function getAllGroups({ database }): Promise<Array<ZoteroGroup>> {
  const db = createDBConnection(database);
  const sql = 'SELECT * FROM groups';

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

export async function saveGroup(groupData) {
  const { database, group } = groupData;
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.get(
      'SELECT * FROM groups WHERE id = $id',
      { $id: group.id },
      (err, row) => {
        if (err) {
          rej(err);
          db.close();
          return;
        }
        if (row) {
          res(updateGroup({ database, group }));
        } else {
          res(createGroup({ database, group }));
        }
        db.close();
      },
    );
  });
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

export function saveZoteroItems({
  allFetchedItems,
  database,
  lastModifiedVersion,
}) {
  //batch inserts
  // batch updates
  //fetch all keys from db first to see which items need to be created/updated
  // write one big query to insert and update all items at once
  return new Promise(async (resolve, reject) => {
    const db = createDBConnection(database);
    // console.log('db save start: ', syncStart);
    await db.all('SELECT id from items', async (err, rows) => {
      if (err) {
        return reject(err);
      }
      const existingItemIdsMap = rows.reduce(
        (a, c) => ({ ...a, [c.id]: c }),
        {},
      );
      const existingCollectionIdsMap = rows.reduce(
        (a, c) => ({ ...a, [c.id]: c }),
        {},
      );
      console.log('here');
      let collections = [];
      const insertSql = `INSERT into items (id,version,data,inconsistent,createdAt,updatedAt, group_id ) VALUES ($id, $version, $data, $inconsistent, datetime('now'), datetime('now'), $group_id)`;
      const updateSql = `UPDATE  items SET version=$version, data=$data, inconsistent=$inconsistent, updatedAt=datetime('now'), group_id=$group_id WHERE id=$id`;
      const itemsLastVersionSql = `UPDATE groups SET itemsVersion=$version, updatedAt=datetime('now') WHERE id=$id`;
      const insertCollectionSql = `INSERT into collections (id,createdAt,updatedAt) VALUES ($id, datetime('now'), datetime('now'))`;
      const insertItemCollectionSql = `INSERT into item_Collection (item_id,collection_id,createdAt,updatedAt) VALUES ($item_id, $collection_id, datetime('now'), datetime('now'))`;
      const insertAlsoKnownAsSql = `INSERT into alsoKnownAs (item_id,group_id,alsoKnownAs,createdAt,updatedAt) VALUES ($item_id, $group_id, $alsoKnownAs, datetime('now'), datetime('now'))`;

      await db.serialize(async function () {
        await db.run('BEGIN');
        let createStmt = await db.prepare(insertSql);
        let updateStmt = await db.prepare(updateSql);
        let itemsLastVersionUpdateStmt = await db.prepare(itemsLastVersionSql);
        let insertCollectionStmt = await db.prepare(insertCollectionSql);
        let insertItemCollectionStmt = await db.prepare(
          insertItemCollectionSql,
        );
        let insertAlsoKnownAsStmt = await db.prepare(insertAlsoKnownAsSql);

        await allFetchedItems.forEach(async (groupItems) => {
          await Promise.resolve(groupItems).then(async (items) => {
            items.forEach(async (item) => {
              await Promise.resolve(item).then(async (i) => {
                //
                if (i.data.collections) {
                  i.data.collections.forEach(async (collection) => {
                    if (
                      !existingCollectionIdsMap[collection] &&
                      !collections.includes(collection) &&
                      collection
                    ) {
                      // console.log(
                      //   'condtion',
                      //   !existingCollectionIdsMap[collection],
                      //   !collections.includes(collection),
                      //   collection,
                      // );

                      collections.push(collection);
                      await insertCollectionStmt.run({
                        $id: collection,
                      });
                    }
                  });
                }

                // create or update item and check if it has a collection
                if (!existingItemIdsMap[i.key]) {
                  await createStmt.run({
                    $id: i.key,
                    $version: i.version,
                    $data: JSON.stringify(i.data),
                    $inconsistent: i.inconsistent,
                    $group_id: i.library.id,
                  });
                  if (i.data.extra) {
                    await insertAlsoKnownAsStmt.run({
                      $item_id: i.key,
                      $group_id: i.library.id,
                      $alsoKnownAs: JSON.stringify(i.data.extra),
                    });
                  }
                }
                if (existingItemIdsMap[i.key]) {
                  await updateStmt.run({
                    $id: i.key,
                    $version: i.version,
                    $data: JSON.stringify(i.data),
                    $inconsistent: i.inconsistent,
                    $group_id: i.library.id,
                  });
                }
                // check if item has a collection
                if (i.data.collections) {
                  i.data.collections.forEach(async (collection) => {
                    if (collection) {
                      await insertItemCollectionStmt.run({
                        $item_id: i.key,
                        $collection_id: collection,
                      });
                    }
                  });
                }
              });

              // const existingItem = existingItemIdsMap[item.key];
              // if (existingItem) {
              //   updateStmt.run({
              //     $id: item.key,
              //     $version: item.version,
              //     $data: JSON.stringify(item),
              //     $inconsistent: false,
              //   });
              // } else {
              //   createStmt.run({
              //     $id: item.key,
              //     $version: item.version,
              //     $data: JSON.stringify(item),
              //     $inconsistent: false,
              //   });
              // }
            });
            await itemsLastVersionUpdateStmt.run({
              $id: groupItems.groupId,
              $version: lastModifiedVersion,
            });
          });
          // groupItems.forEach((item) => {
          //   if (item.key in existingItemIdsMap) {
          //     // console.log('updating: ', item.key);
          //     updateStmt.run({
          //       $id: item.key,
          //       $version: item.version,
          //       $inconsistent: item.inconsistent,
          //       $data: JSON.stringify(item),
          //     });
          //   } else {
          //     // console.log('creating: ', item.key);
          //     createStmt.run({
          //       $id: item.key,
          //       $inconsistent: item.inconsistent,
          //       $version: item.version,
          //       $data: JSON.stringify(item),
          //     });
          //   }
          // });
        });

        await Object.entries(lastModifiedVersion).forEach(([group, version]) =>
          itemsLastVersionUpdateStmt.run({ $id: group, $version: version }),
        );
        await insertCollectionStmt.finalize();
        await createStmt.finalize();
        await updateStmt.finalize();
        await itemsLastVersionUpdateStmt.finalize();
        await insertItemCollectionStmt.finalize();
        await insertAlsoKnownAsStmt.finalize();
        await db.run('COMMIT', () => {
          db.close();
          resolve(true);
        });
      });
    });
  });
}

export function fetchAllItems({
  database,
  filters,
}: {
  database: string;
  filters?: { keys: Array<string>; errors: boolean };
}): Promise<Array<{ id: string; data: string }>> {
  const { keys = [], errors = false } = filters || {};
  console.log('filters: ', filters);
  let whereClause = ``;
  if (keys.length) {
    const ids = keys.map((i) => `"${i}"`).join(',');
    whereClause = `WHERE id in (${ids})`;
  }

  if (errors) {
    if (whereClause.length) {
      whereClause += `AND inconsistent = true`;
    } else {
      whereClause = `WHERE inconsistent = true`;
    }
  }

  const db = createDBConnection(database);
  return new Promise((res, rej) => {
    const sql = `SELECT id, data FROM items ${whereClause}`;
    console.log('given sql:', sql);
    db.all(sql, (err, rows) => {
      if (err) {
        rej(err);
      } else {
        console.log(`total items found: ${rows.length}`);
        res(rows);
      }
      db.close();
    });
  });
}
