/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib').default;
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
  const zotero = new Zotero({ group_id: '5088290' });
  // const response = await zotero.item({ key: '5WFFQKDR' });

  const options = {
    key: '5WFFQKDR',
    xmp: false,
    crossref: true,
    crossref_submit: true,
    crossref_no_confirm: false,
    zenodo: false,
    switchNames: false,
    organise_extra: false,
    children: false,
    validate: false,
    fullresponse: false,
  };
  const result = await zotero.item(options);
  console.log(result);
  // TODO: Have automated test to see whether successful.
  if (!result) {
    console.log('1 - item not found - item does not exist');
  }
  return 0;
}

main();
