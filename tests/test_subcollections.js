/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib');

async function main() {
  const zotero = new Zotero({ verbose: false, 'group-id': 2259720, sdk: true });
  const collections = await zotero.collections({
    key: 'HP6NALR4',
    terse: true,
  });
  console.log('final=' + JSON.stringify(collections, null, 2));
  return 0;
}

main();
