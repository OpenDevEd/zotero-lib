/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

// config1:
// Look for toml in ~/.config/zotero-cli/zotero-cli.toml
// ~/.config/zotero-lib/zotero-lib.toml
const config1 = {}

// config 2: Use a local file
const config2 = {
  config: "./zotero-cli.toml"
}

// Provide config explicitly
const config3 = {
  "user-id": "123",
  "group-id": "456",
  "library-type": "group",
  "indent": 4,
  "api-key": "XXX",
  "verbose": "true"
}

async function main() {
  var zotero = new Zotero()
  console.log("zotero=" + JSON.stringify(zotero, null, 2))
  const res = await zotero.configure({verbose: true, "group-id": 2259720})
  console.log("config now=" + JSON.stringify(zotero.showConfig(), null, 2))
  const template = {
    template: "report"
  }
  let report = await zotero.create_item(template)
  console.log("r" + JSON.stringify(report, null, 2))
  report.title = "Title here"
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
  let i = []
  const res2 = await zotero.create_item({
    item: report
  })
  const s = JSON.stringify(res2, null, 2)
  console.log(s)
  // TODO: Have automated test to see whether successful.
  return 0
}


main()

