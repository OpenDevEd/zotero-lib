//import Zotero from '../src/zotero-lib';
const Zotero = require('../src/zotero-lib.ts')

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

const config3 = {
    "user-id": "XXX",
    "group-id": "123",
    "library-type": "group",
    "indent": 4,
    "api-key": "XXX"
  } 

const zotero = new Zotero(config1) // or config2 or config3
let args = {
    template: "report"
}
console.log(JSON.stringify(zotero.$create_item(args), null, 2))

// run the library 