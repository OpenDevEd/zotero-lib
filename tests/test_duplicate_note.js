/*
Copy note to folder
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

async function main(groupid, newlocation, itemkey) {
  let collection;
  let mode;
  let library;
  const res = newlocation.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
  if (res) {
    collection = res[3];
    mode = res[2];
    library = res[1];
    if (groupid == '-') {
    } else {
      if (library != groupid) {
        console.log('library mismatch: Library specified in 2nd arg is not the same as the group specified in 1st arg.');
        return 1;
      }
    }
  } else {
    library = groupid;
    collection = newlocation;
  }
  let itemkey_for_rel = itemkey;
  const res2 = newlocation.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
  if (res2) {
    itemkey_for_rel = res2[3];
  }
  const zotero = new Zotero({ verbose: true, group_id: library });
  let note = await zotero.item({
    key: itemkey,
  });
  const json_standalone = {
    itemType: 'note',
    note: note.note,
    tags: [...note.tags, {tag: "th:DATA"}],
    collections: [collection],
    relations: note.relations
  };
/*
Unilaterally inserting this doesn't work:
    {
      "dc:relation": "http://zotero.org/groups/"+library+"/items/"+itemkey_for_rel
    }
It needs to be inserted also in the original note. So we'd have to get key from 'item' below, and insert the relation in the note.
This would be better done through a relate command: zotero.relate([arrange of keys]), to ensure it's symmetrical.
Also note that  "dc:relation" is either a string, or an array of strings.
    */
  const json_child = {
    parentItem: collection,
    itemType: 'note',
    note: note.note,
    tags: note.tags,
    relations: note.relations
  };
  let json = json_standalone;
  if (mode && mode === 'items') {
    json = json_child;
  };
  const item = await zotero.create_item({ items: [json] });
  console.log('final=' + JSON.stringify(item, null, 2));
  return 0;
}

var args = process.argv.slice(2);
if (args.length == 2) {
  main("-", args[0], args[1]);
} else if (args.length == 3) {
  main(args[0], args[1], args[2]);
} else {
  console.log('Usage: node create_note.js (<groupid>)? (zotero://)<newlocation=collection|item> (zotero://)<itemkey_for_note>');
  console.log('Default mode is to create a standalone note, but if 2nd arg specifies an item via zotero:// then a child note is created.');
  console.log('')
}

