import { ZoteroGroup, ZoteroItem } from './types';

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
  db.exec(`CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        version INT,
        synced BOOLEAN,
        data TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
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
        id: group.id,
        version: group.version,
        data: JSON.stringify(group),
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

export function saveZoteroItems({
  allFetchedItems,
  database,
  lastModifiedVersion,
}) {
  //batch inserts
  // batch updates
  //fetch all keys from db first to see which items need to be created/updated
  // write one big query to insert and update all items at once
  return new Promise((resolve, reject) => {
    const db = createDBConnection(database);
    // console.log('db save start: ', syncStart);
    db.all('SELECT id from items', (err, rows) => {
      if (err) {
        return reject(err);
      }
      const existingItemIdsMap = rows.reduce(
        (a, c) => ({ ...a, [c.id]: c }),
        {},
      );
      const insertSql = `INSERT into items (id,version,data,createdAt,updatedAt) VALUES ($id, $version, $data, datetime('now'), datetime('now'))`;
      const updateSql = `UPDATE items SET version=$version, data=$data, updatedAt=datetime('now') WHERE id=$id`;
      const itemsLastVersionSql = `UPDATE groups SET itemsVersion=$version, updatedAt=datetime('now') WHERE id=$id`;

      db.serialize(function () {
        db.run('BEGIN');
        let createStmt = db.prepare(insertSql);
        let updateStmt = db.prepare(updateSql);
        let itemsLastVersionUpdateStmt = db.prepare(itemsLastVersionSql);
        allFetchedItems.forEach((groupItems) =>
          groupItems.forEach((item) => {
            if (item.key in existingItemIdsMap) {
              // console.log('updating: ', item.key);
              updateStmt.run({
                $id: item.key,
                $version: item.version,
                $data: JSON.stringify(item),
              });
            } else {
              // console.log('creating: ', item.key);
              createStmt.run({
                $id: item.key,
                $version: item.version,
                $data: JSON.stringify(item),
              });
            }
          }),
        );

        Object.entries(lastModifiedVersion).forEach(([group, version]) =>
          itemsLastVersionUpdateStmt.run({ $id: group, $version: version }),
        );
        createStmt.finalize();
        updateStmt.finalize();
        itemsLastVersionUpdateStmt.finalize();
        db.run('COMMIT');
      });
      db.close();
      resolve(true);
    });
  });
}

export function fetchAllItems({
  database,
  filters,
}: {
  database: string;
  filters?: { keys: Array<string> };
}): Promise<Array<{ id: string; data: string }>> {
  const { keys = [] } = filters || {};

  let whereClause = ``;
  if (keys.length) {
    const ids = keys.map((i) => `"${i}"`).join(',');
    whereClause = `WHERE id in (${ids})`;
  }

  const db = createDBConnection(database);
  return new Promise((res, rej) => {
    const sql = `SELECT id, data FROM items ${whereClause}`;
    console.log('given sql:', sql);
    db.all(sql, (err, rows) => {
      if (err) {
        rej(err);
      } else {
        res(rows);
      }
      db.close();
    });
  });
}

export function saveZoteroItem(itemData: {
  database: string;
  item: ZoteroItem;
  closeConn: boolean;
}) {
  const { database, item, closeConn = true } = itemData;
  console.log('saving', itemData);
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.get(
      'SELECT * FROM items WHERE id = $id',
      { $id: item.key },
      (err, row) => {
        if (err) {
          rej(err);
          if (closeConn) {
            db.close();
          }
          return;
        }
        if (row) {
          res(updateItem({ database, item, closeConn }));
        } else {
          res(createItem({ database, item, closeConn }));
        }
        if (closeConn) {
          db.close();
        }
      },
    );
  });
}

export async function createItem(itemData) {
  const { database, item, closeConn = true } = itemData;
  console.log('creating item', itemData);
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.run(
      `INSERT into items (id,version,data,createdAt,updatedAt) VALUES ($id, $version, $data, datetime('now'), datetime('now'))`,
      {
        $id: item.key,
        $version: item.version,
        $data: JSON.stringify(item),
      },
      (err, row) => {
        if (err) {
          rej(err);
          if (closeConn) {
            db.close();
          }
          return;
        }
        res(row);
        if (closeConn) {
          db.close();
        }
      },
    );
  });
}

export async function updateItem(itemData) {
  const { database, item } = itemData;
  console.log('updating item', itemData);
  return new Promise((res, rej) => {
    const db = createDBConnection(database);
    db.run(
      `UPDATE items SET version=$version, data=$data, updatedAt=datetime('now') WHERE id=$id`,
      {
        $id: item.key,
        $version: item.version,
        $data: JSON.stringify(item),
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
