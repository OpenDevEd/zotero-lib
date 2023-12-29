/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

function getids(newlocation) {
  const res = newlocation.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
  let x = {};
  if (res) {
    x.key = res[3];
    x.type = res[2];
    x.group = res[1];
  } else {
    x.key = newlocation;
  }
  return x;
};


async function main(coll) {
  const id = getids(coll);
  const zotero = new Zotero({ verbose: true, 'group-id': id.group });
  let collections = await zotero.collections({
    key: id.key,
  });
  // console.log('final=' + JSON.stringify(collections, null, 2));
  let arr = collections.map((collection) => ({ key: collection.key, name: collection.data.name }));
  const res = await Promise.all(arr.map(async (element) => {
    const c = await zotero.items({
      collection: element.key,
      top: true
    });
    // console.log(JSON.stringify(c, null, 2));
    return {key: element.key, name: element.name, items: c.length};
  }));
  console.log('final=' + JSON.stringify(res, null, 2));
  // write collections to file
  res.forEach((element) => {
    console.log(element.name + '\t'+ element.items);
  });
};


var args = process.argv.slice(2);
main(args[0]);
