/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  zotero = new Zotero()
  await zotero.enclose_item_in_collection({
    key: "U4FNKF86",
    collection: "8TRFR2ZR",
    group_id: 2259720
  })
}


main()



