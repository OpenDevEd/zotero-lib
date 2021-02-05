/*
This file shows how to connect to the API in the first place and get some basic information.
*/

// Development:
const Zotero = require('../build/zotero-lib')
// After installation:
/*
const Zotero = require('zotero-lib')
*/
const fs = require('fs')

async function main() {
  implicit_specification: {
    console.log("implicit_specification")
    // OPTION 1. You have a .config/zotero-cli/zotero-cli.toml
    // Get an instance of Zotero (with default group)
    const zotero = new Zotero()
    // Specify group and key via 'key' and write to output file
    const response = await zotero.key({})
    //const response = await zotero.item({key: "zotero://select/groups/2259720/items/YH7GFG6L")
  }
  const apikey = "add your api key here"
  api_key_in_new: {
    console.log("api_key in new")
    const zotero = new Zotero({ api_key: apikey })
    const response = await zotero.key({})
  }
  specify_toml: {
    console.log("specify_toml")
    const zotero = new Zotero()
    const response = await zotero.key({ config: 'zotero-cli.toml' })
  }
  api_key_v1: {
    console.log("api_key")
    const zotero = new Zotero()
    const response = await zotero.key({ api_key: apikey })
  }
  api_key_v2a: {
    console.log("config_json: { api_key }")
    const zotero = new Zotero()
    const response = await zotero.key({ config_json: { api_key: apikey } })
  }
  api_key_v2b: {
    console.log("config_json: '{ api_key }'")
    const zotero = new Zotero()
    const response = await zotero.key({ config_json: `{ "api_key": "${apikey}" }` })
  }
  api_key_v3: {
    console.log("zotero_api_key")
    const zotero = new Zotero()
    const response = new Zotero({ zotero_api_key: apikey })
  }
  api_key_v4: {
    console.log("api-key")
    const zotero = new Zotero({ "api-key": apikey })
    const response = await zotero.key({})
  }
  return 0
}


main()

