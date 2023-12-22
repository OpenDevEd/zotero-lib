/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

async function main(group_id) {
  const zotero = new Zotero({ verbose: true, 'group-id': group_id });
  let collections = await zotero.collections({
    key: '',
    top: true
  });
  // console.log('final=' + JSON.stringify(collections, null, 2));
  let arr = collections.map((collection) => collection.key);
  while (arr.length > 0) {
    const key = arr.shift();
    if (key != '') {
      const c = await zotero.collections({
        key: key
      });
      if (c.length > 0) {
        collections = [...collections,...c];
        arr = [...arr, ...c.map((collection) => collection.key)];
      };
    };
  };
  console.log('final=' + JSON.stringify(collections, null, 2));
  // write collections to file
  fs.writeFileSync('collections_'+group_id+'.json', JSON.stringify(collections, null, 2));
  return 0;
}

main(2405685);
