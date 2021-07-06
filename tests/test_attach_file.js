/*
Testing item functions.
*/
const downloadFile = require('./downloadFile');

const Zotero = require('../build/zotero-lib');

async function main() {
  // Specify group via constructor
  const zotero = new Zotero({});
  console.log(process.argv[2]);
  const key = process.argv[2];
  if (!key) {
    throw new Error('No zotero key given');
  }
  const response = await zotero.item({ key });
  console.log('response = ' + JSON.stringify(response, null, 2));
  // TODO: Have automated test to see whether successful.

  if (!response.url) {
    console.error('Please provide a zotero item key with valid url key');
    return;
  }

  await downloadFile(response.url, 'somePDF.pdf');
  const response2 = await zotero.item({ key, addfiles: ['somePDF.pdf'] });
  if (!response2) {
    console.log('1 - item not found - item does not exist');
  }
}

main();
