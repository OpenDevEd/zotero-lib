/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

async function main() {
  var zotero = new Zotero({ verbose: false, 'group-id': 2259720 });
  const key = 'NMF7H2HP';
  console.log('--------------------------------');
  const doi = await zotero.get_doi({ key: key });
  console.log(doi);
  // console.log('TEMPORARY=' + JSON.stringify(item, null, 2));
  // const item = await zotero.item({ key: key });
  return 0;
}

main();
