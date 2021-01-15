//import Zotero from '../src/zotero-lib';
const Zotero = require('../src/zotero-lib')
const fs = require('fs')

/*
{
      config: "zotero-lib.toml"
    }

    or

    args = {
      user-id: "XXX",
      group-id: "123",
      library-type: "group",
      indent = 4,
      api-key: "XXX"
    } 

*/

// config1:
// Look for toml in ~/.config/zotero-cli/zotero-cli.toml
// ~/.config/zotero-lib/zotero-lib.toml
const config1 = {}

const config2 = {
  config: "/home/zeina/.config/zotero-cli/zotero-cli.toml"
}


// TODO: Test verbose
const config3 = {
  "user-id": "XXX",
  "group-id": "123",
  "library-type": "group",
  "indent": 4,
  "api-key": "XXX"
  "verbose": "true"
}

var zotero = new Zotero(config1)
console.log("z=" + JSON.stringify(zotero, null, 2))
//console.log("t="+typeof(Zotero));
//console.log(JSON.stringify(Zotero,null,2));

async function test() {
  const res = await zotero.readConfig(config1)
  // console.log("res="+JSON.stringify(res,null,2))
  //console.log("config=")
  //zotero.showConfig()
  let template = {
    template: "report"
  }
  let report = await zotero.create_item(template)
  console.log("r" + JSON.stringify(report, null, 2))
  report.title = "ABC"
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
  return s;
}

// 2259720

test()



// run the library
