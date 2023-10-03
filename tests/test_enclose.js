/*
Testing item functions.
*/
const { Zotero } = require('../build/zotero-lib');
const fs = require('fs');

async function main() {
  const zotero = new Zotero({ verbose: true, 'group-id': 123465 });
  const options = { top: false, key: ['zotero://select/groups/5168324/collections/VQ8AKG3J'] };
  const result = await zotero.collections(options);
  await zotero.item({
    key: iterator.key,
    addtocollection: [collectionTemp['0'].key],
    verbose: true,
  });
  // console.log(result);
  result.forEach((item) => {
    console.log(item.data.name, item.data.key);
  });
}

main();
