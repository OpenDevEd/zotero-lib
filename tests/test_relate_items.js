/*
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

function merge(a, b) {
  if (a === undefined) {
    return b;
  } else if ( typeof(a) == "string"  ) {
    return [a, b];
  } else if ( Array.isArray(a) ) {
    return [...a, b]
  } else {
    return null;
  }
};

async function main(key1, key2) {
  const zotero = new Zotero();
  let collection;
  let mode;
  let library;
  const id1 = getids(key1);
  const id2 = getids(key2);
  const item1 = await zotero.item({
    key: key1,
  });
  const item2 = await zotero.item({
    key: key2,
  });
  //console.log('item1=' + JSON.stringify(item1, null, 2));
  //console.log('item2=' + JSON.stringify(item2, null, 2));
  const link1 = "http://zotero.org/groups/"+id1.group+"/items/"+id1.key;
  const link2 = "http://zotero.org/groups/"+id2.group+"/items/"+id2.key;
  // const res = await zotero.update_item({key: key1, json: {title: "ABC"}});
  // const json1 = { relations:  {"dc:relation": link2 } };
  // const json2 = { relations:  {"dc:relation": link1 } };
  const json1 = item1.relations;
  const json2 = item2.relations;
  json1["dc:relation"] = merge(json1["dc:relation"], link2);
  json2["dc:relation"] = merge(json2["dc:relation"], link1);
  //json1["dc:relation"] = [...json1["dc:relation"], link2]
  //console.log('json1=' + JSON.stringify(json1, null, 2));
  const res1 = await zotero.update_item({key: key1, json: { relations: json1 } } );
  //console.log('item1=' + JSON.stringify(res1, null, 2));
  const res2 = await zotero.update_item({key: key2, json: { relations: json2 } } );
  //console.log('item2=' + JSON.stringify(res2, null, 2));
  
  //const item = await zotero.create_item({ items: [json] });
  //console.log('final=' + JSON.stringify(item, null, 2));
  /* {
    "dc:relation": "http://zotero.org/groups/"+library+"/items/"+itemkey_for_rel
  } */

  return 0;
}

var args = process.argv.slice(2);
main(args[0], args[1]);


