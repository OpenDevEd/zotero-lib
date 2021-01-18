/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  var zotero = new Zotero({ verbose: false, "group-id": 2259720 })
  /*
  const template = {
    template: "report"
  }
  let report = await zotero.create_item(template)
  report.title = "Title here"
  const zoteroResult = await zotero.create_item({
    item: report,
    fullresponse: true
  })
  const zoteroRecordVersion = zoteroResult.successful["0"].version
  const zoteroRecordGType = zoteroResult.successful["0"].library.type
  const zoteroRecordGroup = zoteroResult.successful["0"].library.id
  const zoteroItem = zotero.pruneData(zoteroResult)
  // Now update the zenodo record with the ZoteroId.
  if (zoteroRecordGType != "group") {
    return this.message(1, "ERROR: group-type=user not implemented")
  }
  const args = {
    key: zoteroItem.key,
    version: zoteroRecordVersion,
    update: { url: "https://kerko_url" },
    fullresponse: false,
    show: true
  } */
  // Suppose we have an item already - otherwise create one above.
  const key = "D5MASQRH"
  console.log("--------------------------------")
  const item = await zotero.update_doi({key: key, doi: "NEW DOI"})
  console.log("TEMPORARY="+JSON.stringify(  item          ,null,2))
  return 0
}


main()

