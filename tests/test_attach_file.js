/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

const request = require("request-promise-native");

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    fs.writeFileSync(outputFilename, pdfBuffer);
}

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
  const zotero = new Zotero({})
  console.log(process.argv[2])
  const key = process.argv[2]
  const response = await zotero.item({key: key})
  console.log("response = " + JSON.stringify(response, null, 2))
  // TODO: Have automated test to see whether successful.
  downloadPDF(response.url, "somePDF.pdf");
  const response2 = await zotero.item({key: key, addfiles: ["somePDF.pdf"]})
  if (!response2) {
    console.log("1 - item not found - item does not exist")
  }
  return 0
}


main()

