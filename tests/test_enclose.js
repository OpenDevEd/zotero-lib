/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  /*
  // Get an instance of Zotero (with default group)
  const zotero = new Zotero()
  // Specify group and key via 'key' and write to output file
  const response = await zotero.item({key: "zotero://select/groups/2259720/items/YH7GFG6L", out: "item_YH7GFG6L.json"})
  */
  // run with verbosity:
  //const zotero = new Zotero({verbose: true})
  // Specify group via constructor
  const key = "YH7GFG6L"
  const base_collection = "DMUSZD4Y"
  const group = 2259720
  const zotero = new Zotero({ verbose: false, "group-id": group })
  const response = await zotero.item({ key: key })
  // console.log("response = " + JSON.stringify(response, null, 2))
  // TODO: Have automated test to see whether successful.
  if (!response) {
    console.log("1 - item not found - item does not exist")
  }
  console.log("-->" + response.collections)
  const child_name = response.title + " " + "X"
  //const new_coll = zotero.create_collection(group, base_collection, $name)
  const new_coll = await zotero.collections({ group_id: group, key: [base_collection], create_child: [child_name] })
  console.log("TEMPORARY=" + JSON.stringify(new_coll, null, 2))
  const ecoll = new_coll[0].key
  const res = zotero.item({
    key: key,
    addtocollection: [ecoll]
  })

  const refcol_res = await zotero.collections({ group_id: group, key: [ecoll], create_child: ["✅_References"] })
  const refcol = refcol_res[0].key
  zotero.attach_link({
    group_id: group,
    key: key,
    url: `zotero://select/groups/${group}/collections/${refcol}`,
    title: "✅View collection with references.",
    tags: ["_r:viewRefs"]
  });

  const refcol_citing = await zotero.collections({ group_id: group, key: [ecoll], create_child: ["✅Citing articles"] })
  const citingcol = refcol_citing[0].key
  zotero.attach_link({
    group_id: group,
    key: key,
    url: `zotero://select/groups/${group}/collections/${citingcol}`,
    title: "✅View collection with citing articles (cited by).",
    tags: ["_r:viewCitedBy"]
  })

  const refcol_rem = await zotero.collections({ group_id: group, key: [ecoll], create_child: ["✅Removed references"] })
  const refremcol = refcol_rem[0].key
  zotero.attach_link({
    group_id: group,
    key: key,
    url: `zotero://select/groups/${group}/collections/${refremcol}`,
    title: "✅View collection with removed references.",
    tags: ["_r:viewRRemoved"]
  });

  // say "Creating note for item key. Note key: "  
  zotero.attach_note({
    group_id: group,
    key: key,
    description: `<h1>Bibliography</h1><p>Updated: date</p><p>Do not edit this note manually.</p><p><b>bibliography://select/groups/${group}/collections/${refcol}</b></p>`,
    tags: [ "_cites"]
  })
    
  const response2 = await zotero.item({ key: key })
  console.log("-->" + response2.collections)

  return 0
}





main()



