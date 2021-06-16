/*

Note: This example doesn't work: check_existence isn't possible via the API.
https://forums.zotero.org/discussion/87694/searching-for-an-item-via-api-results-differ-from-client#latest

*/
const Zotero = require('../build/zotero-lib');

async function main() {
  let targetgroup, targetcollections, sourcegroup, sourcekey;
  if (process.argv[2].match(/^zotero/)) {
    //  const src = process.argv[2].split("/")[4]
    targetgroup = process.argv[2].split('/')[4];
    targetcollections = [process.argv[2].split('/')[6]];
    console.log(`
    targetgroup = ${targetgroup}
    targetcollections = ${targetcollections}
    `);
    const arg = process.argv.slice(3);
    arg.forEach((x) => {
      console.log(`
      sourcegroup = ${sourcegroup}
      sourcekey = ${sourcekey}
      `);
      if (x.match(/ref\.opendeved\.net/)) {
        sourcegroup = x.split('/')[5];
        sourcekey = x.split('/')[7];
      } else {
        sourcegroup = x.split('/')[4];
        sourcekey = x.split('/')[6];
      }
      copy_item(sourcegroup, sourcekey, targetgroup, targetcollections);
    });
  } else {
    targetgroup = process.argv[2];
    targetcollections = [process.argv[3]];
    sourcegroup = process.argv[4];
    sourcekey = process.argv[5];
    console.log(`
  targetgroup = ${targetgroup}
  targetcollections = ${targetcollections}
  sourcegroup = ${sourcegroup}
  sourcekey = ${sourcekey}
  `);
    // process.exit(1)
    // process.exit(1)
    /*
      console.log(process.argv[2])
      const targetgroup = "2405685" 
      // const targetcollections = ["C5U3ZBQP"]
      const targetcollections = ["8NAIANHI"]
      const [sourcegroup, sourcekey] = ["2339240", process.argv[2]]
      */
    //check_existence(sourcegroup, sourcekey, targetgroup)
    copy_item(sourcegroup, sourcekey, targetgroup, targetcollections);
  }
}

main();

async function check_existence(sourcegroup, sourcekey, targetgroup) {
  // --group-id 2129771 --show items --filter '{"qmode": "everything", "q": "TPUP96WG"}'
  var zotero = new Zotero({});
  let items = await zotero.items({
    group_id: targetgroup,
    top: true,
    filter: {
      qmode: 'everything',
      includeTrashed: '0',
      //"q": "Stemming Learning Loss During the Pandemic: A Rapid Randomized Trial of a Low-Tech Intervention in Botswana"
      q: sourcekey,
      //"q": "KerkoCite.ItemAlsoKnownAs"
    },
  });
  //items = items.map(e => { return e.data })
  console.log('TEMPORARY=' + JSON.stringify(items, null, 2));
  console.log('results=' + items.length);
}

async function copy_item(
  sourcegroup,
  sourcekey,
  targetgroup,
  targetcollections,
) {
  // Destination group
  var zotero = new Zotero({});
  let item = await zotero.item({ group_id: sourcegroup, key: sourcekey });
  const link = `zotero://select/groups/${sourcegroup}/items/${sourcekey}`;
  const note =
    `<p>This item was copied using the API. The original item is available here: <a href="${link}">${link}</a><br>` +
    'Here is some of the original data:</p><pre>' +
    JSON.stringify(
      {
        key: item.key,
        group_id: sourcegroup,
        version: item.version,
        relations: item.relations,
        dateAdded: item.dateAdded,
        dateModified: item.dateModified,
        collections: item.collections,
      },
      null,
      2,
    ) +
    '</pre>';
  delete item.key;
  delete item.version;
  delete item.dateAdded;
  delete item.dateModified;
  delete item.dateModified;
  delete item.collections;
  item.extra =
    item.extra +
    '\n' +
    `KerkoCite.ItemAlsoKnownAs: ${sourcegroup}:${sourcekey}` +
    '\n' +
    `zotzenLib.CopiedFrom: ${sourcegroup}:${sourcekey}`;
  item.collections = targetcollections;
  /*
  if (item.relations) {
    if (item.relations["owl:sameAs"]) {
      if (Array.isArray(item.relations["owl:sameAs"])) {
        // Nothing to be done - we have an array already.
      } else {
        // Not an array - just a single item. Turn it into an array.
        item.relations["owl:sameAs"] = [item.relations["owl:sameAs"]]
      }
    } else {
      item.relations["owl:sameAs"] = []
    }
    // This is a risky move, in case the item has already been copied and a same owl:sameAs already exists.
    // That seems to lead to the new item being suppressed in the Zotero client.
    // Unfortunately there doesn't seem to be a way for the API to access the 'relations' or 'extra' field via a search.
    // The only option is to download the entire library, and then check against it directly.
    item.relations["owl:sameAs"].push(`http://zotero.org/groups/${sourcegroup}/items/${sourcekey}`)
  }
  */
  const newitem = await zotero.create_item({
    group_id: targetgroup,
    item: item,
  });
  console.log('TEMPORARY=' + JSON.stringify(newitem, null, 2));
  const itemnote = zotero.attach_note({
    group_id: targetgroup,
    key: newitem.key,
    notetext: note,
    tags: ['_r:copiedNote'],
  });
  return 0;
}
