/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  await enclose_item_in_collection({
    key: "U4FNKF86",
    collection: "DMUSZD4Y",
    group_id: 2259720
  })
}


main()



