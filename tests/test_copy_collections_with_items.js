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


async function getCollectionsAndItems(coll) {
  const id = getids(coll);
  const zotero = new Zotero({ 'group-id': id.group });
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
    //write c to file
    //fs.writeFileSync("out_"+element.key + '.json', JSON.stringify(c, null, 2));
    keys = c.map((item) => item.key);
    return { key: element.key, name: element.name, items: keys };
  }));
  // console.log('final=' + JSON.stringify(res, null, 2));
  // write collections to file
  /*res.forEach((element) => {
    console.log(element.name + '\t'+ element.items.join(' '));
  }); */
  return res;
};

async function replicate(loc, items) {
  const id = getids(loc);
  const zotero = new Zotero({ 'group-id': id.group });
  const res = await Promise.all(items.map(async (element) => {
    const coll = await zotero.collections({key: id.key, create_child: element.name});
    // console.log(JSON.stringify(coll, null, 2));
    console.log("Adding " + element.keys + " to " + coll["0"].key + " in ");
    const collkey = coll["0"].key;
    const items = await zotero.collection({key: collkey, add: element.items});
    console.log(JSON.stringify(items, null, 2));
  }));
};

async function main(arg1, arg2) {
  const res = await getCollectionsAndItems(arg1);
  res.forEach((element) => {
    console.log(element.name + '\t' + element.items.join(' '));
  });
  await replicate(arg2, res);
};

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Please provide (1) a collection where to replicatea and (2) collection to replicate.');
} else {
  main(args[1], args[0]);
}


