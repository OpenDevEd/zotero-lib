/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');
const html2text = require('html2text');

function getids(newlocation) {
  const res = newlocation.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
  let x = {};
  if (res) {
    x.key = res[3];
    x.type = res[2];
    x.group = res[1];
  } else {
    x.key = newlocation;
  }
  return x;
};


async function main(keyin) {
  const id = getids(keyin);
  const zotero = new Zotero({ verbose: true, 'group-id': id.group });
  const response = await zotero.item({ key: id.key });
  console.log('response = ' + JSON.stringify(response, null, 2));
  // TODO: Have automated test to see whether successful.
  if (!response) {
    console.log('1 - item not found - item does not exist');
  }
  // write response.note to a file
  fs.writeFileSync('html/'+id.key+'.html', response.note);
  // invoke html2text on result.note
  const text = html2text.htmlToText(response.note);
  fs.writeFileSync('text/'+id.key+'.txt', text);
  return 0;
}

var args = process.argv.slice(2);
main(args[0]);

