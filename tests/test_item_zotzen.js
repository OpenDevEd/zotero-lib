/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  /*
  // Get an instance of Zotero (with default group)
  const zotero = new Zotero()
  // Specify group and key via 'key' and write to output file
  const response = await zotero.item({key: "zotero://select/groups/2259720/items/YH7GFG6L", out: "item_YH7GFG6L.json"})
  */
  // run with verbosity:
  //const zotero = new Zotero({verbose: true})

  // Specify group via constructor
  const zotero = new Zotero({verbose: false})
  const response = await zotero.item({
  "zotero_config": "zotero-cli.toml",
  "zenodo_config": "config.json",
  "zenodo_sandbox": false,
  "verbose": false,
  "debug": true,
  "show": false,
  "open": false,
  "oapp": false,
  "dump": false,
  "dryrun": false,
  "version": false,
  "key": "HTCRZNIB",
  "link": false,
    "group_id": "2129771"

  })
  console.log("response = " + JSON.stringify(response, null, 2))
  // TODO: Have automated test to see whether successful.
  if (!response) {
    console.log("1 - item not found - item does not exist")
  }
  return 0
}


main()

