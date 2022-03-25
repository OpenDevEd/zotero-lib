const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

export function initDB(dbName) {
  let db = new sqlite3.Database(dbName);
  db.exec(`CREATE TABLE IF NOT EXISTS groups (
        id INT PRIMARY KEY NOT NULL,
        version INT NOT NULL,
        data TEXT NOT NULL
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS items (
        id INT PRIMARY KEY NOT NULL,
        version INT NOT NULL,
        synced BOOLEAN NOT NULL,
        data TEXT NOT NULL
    );`);

  return db;
}

export function createDBConnection(dbName) {
  if (!fs.existsSync(dbName)) {
    return initDB(dbName);
  }
  return new sqlite3.Database(dbName);
}

export function getAllGroups({ database }) {
  const db = createDBConnection(database);

  db.close();
}
