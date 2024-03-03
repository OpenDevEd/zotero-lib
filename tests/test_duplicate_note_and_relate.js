/*
Copy note to folder
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
    } else if (typeof (a) == "string") {
        return [a, b];
    } else if (Array.isArray(a)) {
        return [...a, b]
    } else {
        return null;
    }
};

async function relate(group, key1, key2) {
    const zotero = new Zotero({ group_id: group });
    const item1 = await zotero.item({
        // group_id: group, 
        key: key1
    });
    const item2 = await zotero.item({
        // group_id: group, 
        key: key2
    });
    console.log('item1=' + JSON.stringify(item1, null, 2));
    const link1 = "http://zotero.org/groups/" + group + "/items/" + key1;
    const link2 = "http://zotero.org/groups/" + group + "/items/" + key2;
    const json1 = item1.relations;
    const json2 = item2.relations;
    json1["dc:relation"] = merge(json1["dc:relation"], link2);
    json2["dc:relation"] = merge(json2["dc:relation"], link1);
    //json1["dc:relation"] = [...json1["dc:relation"], link2]
    //console.log('json1=' + JSON.stringify(json1, null, 2));
    const res1 = await zotero.update_item({ group_id: group, key: key1, json: { relations: json1 } });
    //console.log('item1=' + JSON.stringify(res1, null, 2));
    const res2 = await zotero.update_item({ group_id: group, key: key2, json: { relations: json2 } });
    //console.log('item2=' + JSON.stringify(res2, null, 2));
    return 0;
}


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
    const res2 = itemkey.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
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
        tags: [...note.tags, { tag: "th:DATA" }],
        collections: [collection],
        relations: note.relations
    };
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
    await relate(library, item.key, itemkey_for_rel);
    //console.log(library, item.key, itemkey_for_rel);
    return 0;
}

var args = process.argv.slice(2);
if (args.length == 2) {
    main("-", args[0], args[1]);
} else if (args.length == 3) {
    main(args[0], args[1], args[2]);
} else {
    console.log('Usage: node create_note_and_relate.js (<groupid>)? (zotero://)<newlocation=collection|item> (zotero://)<itemkey_for_note>');
    console.log('Default mode is to create a standalone note, but if 2nd arg specifies an item via zotero:// then a child note is created.');
    console.log('')
}

