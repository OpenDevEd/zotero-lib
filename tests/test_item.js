/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

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
  const zotero = new Zotero({ verbose: false, 'group-id': 2259720 });

  const response = await zotero.item({ key: 'YH7GFG6L' });
  console.log('response = ' + JSON.stringify(response, null, 2));
  // TODO: Have automated test to see whether successful.
  if (!response) {
    console.log('1 - item not found - item does not exist');
  }
  return 0;
}

main();
