const Zotero = require('../build/zotero-lib')
const fs = require('fs')
const { mainModule } = require('process')
var _ = require('lodash');

main()

async function main() {
  console.log(process.argv[2])
  const group = process.argv[2]
  const basekey = process.argv[3]
  const itemkeys = process.argv.slice(4, process.argv.length)
  merge_items(group, basekey, itemkeys)
}

async function merge_items(group, basekey, itemkeys) {
  // Destination group
  var zotero = new Zotero({})
  const base = await zotero.item({ group_id: group, key: basekey })
  var items = []
  for (key in itemkeys) {
    const item = await zotero.item({ group_id: group, key: itemkeys[key] })
    items.push(item)
  }
  // We should check here whether the items are in 'create order' to make sure the oldest item is preserved.
  // Alternatively, we could also copy the metadata of the first item to the oldest item... might need some switches here.
  // At the moment, 'equality' checks for exact equality.
  if (equality(base, items)) {
    console.log("moving items")
    // Now move attachments of items over to main item.
    const moved = await movechildren(group, base, items)
    // patched data
    const patchdata = await getpatch(group, base, items)
    // Now __PATCH base.relations
    // zotero.__patch()
    const deleted = await deleteitems(group, items)
  } else {
    console.log("items are not sufficiently the same.")
    process.exit(1)
  }
  const note = `
  <p>Merged item in group ${group}.</p>
  <p>Here is/are the ${items.length} item(s) that were removed:</p>
  <pre>
  ${JSON.stringify(items, null, 2)}
  </pre>
  <p>Here is the item that was retained:</p>
  <pre>
  ${JSON.stringify(base, null, 2)}
  </pre>
  `;
  //console.log(note)
  //const itemnote = zotero.attach_note({ group_id: group, key: base.key, notetext: note, tags: ["_r:mergedNote"] });
  return 0
}

async function movechildren(group, base, items) {
  var zotero = new Zotero({ group_id: group })
  for (item of items) {
    const children = await zotero.item({ group_id: group, key: item.key, children: true })
    // console.log("TEMPORARY=" + JSON.stringify(children, null, 2))
    for (child of children) {
      console.log(`Moving ${child.data.key} (${child.data.itemType})`)
      const result = await zotero.field({ group_id: group, key: child.data.key, field: "parentItem", value: base.key })
      if (result.parentItem == base.key) {
      } else {        
        console.log("TEMPORARY="+JSON.stringify(   result         ,null,2))         
        console.log("Failed to relocate child - stopping for safety.")
        process.exit(1)
      }
    }
    /*
    for (child in items[i].getchildren) {
      move child to baseitem
    }
  */
  }
  process.exit(1)
  return {}
}

async function deleteitems(group, items) {
  for (item of items) {
  }
  return {}
}

function equality(base, items) {
  // check for equality (need to relax this later)
  var xbase = _.cloneDeep(base)
  const deletions = ["key", "version", "relations", "dateAdded", "dateModified", "extra", "collections"]
  deletions.forEach(x => {
    delete xbase[x]
  })
  var equality = true;
  for (x in items) {
    var xitem = _.cloneDeep(items[x])
    deletions.forEach(x => {
      delete xitem[x]
    })
    if (!_.isEqual(xbase, xitem)) {
      equality = false
    }
  }
  return equality
}

function pushrelation(relations, relation, value) {
  if (relations[relation]) {
    if (Array.isArray(relations[relation])) {
      // Nothing to be done - we have an array already.
    } else {
      // Not an array - just a single item. Turn it into an array.
      relations[relation] = [relations[relation]]
    }
    if (Array.isArray(value)) {
      base.relations[relation].push(...value)
    } else {
      base.relations[relation].push(value)
    }
  } else {
    // first item - works if value is an array or a string
    relations[relation] = value
  }
}

async function getpatch(group, base, items) {
  var patcher = {}
  // create/merge relations
  var relations = {}
  relations = base.relations;
  for (i in items) {
    const item = items[i]
    // Step 1: Sort out 'replaces'
    const replaces = `http://zotero.org/groups/${group}/items/${item.key}`;
    // push the key of the replaced item to the retained item
    pushrelation(relations, "owl:replaces", replaces)
    for (relation of ["owl:replaces", "owl:sameAs"]) {
      // push the "owl:replaces" and "owl:sameAs" from the old item to the retained item
      if (item.relations[relation]) {
        pushrelation(relations, relation, item.relations[relation])
      }
    }
  }
  for (relation of ["owl:replaces", "owl:sameAs"]) {
    if (relations[relation]) {
      patcher.relations[relations] = Array.isArray(relations[relation]) ? _.uniq(relations[relation]) : relations
    }
  }
  // and merge collections
  var collections = base.collections
  for (i in items) {
    const item = items[i]
    collections.push(...item.collections)
  }
  patcher.collections = _.uniq(collections)
  // Now copy empty fields
  for (k of Object.keys(base)) {
    for (const item of items) {
      if (typeof (base[k]) == 'string' && base[k] == '' && patcher[k] == '' && item[k] != '') {
        patcher[k] = item[k]
      }
    }
  }
  // console.log("TEMPORARY=" + JSON.stringify(patcher, null, 2))
  //console.log("done=" + JSON.stringify(base, null, 2))
  return patcher
}


