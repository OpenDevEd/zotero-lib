/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');

async function main() {
  var zotero = new Zotero();
  console.log('zotero=' + JSON.stringify(zotero, null, 2));
  const res = await zotero.configure({ verbose: true, 'group-id': 2259720 });
  console.log('config now=' + JSON.stringify(zotero.showConfig(), null, 2));
  const template = {
    template: 'report',
  };
  let report = await zotero.create_item(template);
  console.log('r' + JSON.stringify(report, null, 2));
  report.title = 'Title here';
  //Example: Write template to file and submit from file
  /*
  fs.writeFileSync('../temp.json', JSON.stringify(report))
  const res2 = await zotero.create_item({
    files: ["../temp.json"]
  })*/

  // Example 2: submit (one or more) records as array
  /* let i = []
  i.push(report)
  report.title = "DEF"
  i.push(report)
  const res2 = await zotero.create_item({
    items: i
  }) */
  // let i = []
  const res2 = await zotero.create_item({
    item: report,
    fullresponse: false,
  });
  const s = JSON.stringify(res2, null, 2);
  console.log(s);
  //const t = JSON.stringify(zotero.pruneData(res2), null, 2)
  //console.log(t)
  const coll = await zotero.enclose_item_in_collection({
    // group_id: 2259720,
    key: res2.key,
    // collection: "5QQ2CI6X"
  });
  console.log('TEMPORARY=' + JSON.stringify(coll, null, 2));
  // TODO: Have automated test to see whether successful.
  return 0;
}

main();
