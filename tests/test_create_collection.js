/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')


async function main() {
  var zotero = new Zotero()
  console.log("zotero=" + JSON.stringify(zotero, null, 2))
  const res = await zotero.configure({ verbose: true, "group-id": 2259720 })
  console.log("config now=" + JSON.stringify(zotero.showConfig(), null, 2))
  console.log("Collection at top level")
  const result = await zotero.collections({
    create_child: "___Test"
  })
  console.log("r=" + JSON.stringify(result, null, 2))
  console.log("Child collection")
  const result2 = await zotero.collections({
    create_child: "___Test",
    key: "SRUZECQQ"
  })
  console.log("r=" + JSON.stringify(result, null, 2))
  return 0
}


main()

