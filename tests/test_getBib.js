/*
Testing item functions.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
  const arg = {
    "user": "bjoern@opendeved.net",
    "zkey": "8FW7PINZ",
    "gdoc": "19rPYBNkX7bMKRuGhVLrIjQaVFQcpR7b1drqx6sdHVRs",
    "token": "e87a5ea6-9227-11eb-98fe-c39e64cea131",
    "group": "2129771",
    "keys": "8FW7PINZ,3W7W6P24"
  };

  /*
  // Get an instance of Zotero (with default group)
  const zotero = new Zotero()
  // Specify group and key via 'key' and write to output file
  const response = await zotero.item({key: "zotero://select/groups/2259720/items/YH7GFG6L", out: "item_YH7GFG6L.json"})
  */
  // run with verbosity:
  //const zotero = new Zotero({verbose: true})

  // Specify group via constructor
  const zotero = new Zotero({ verbose: false, "group-id": arg.group })
  //const response = await zotero.item({key: arg.keys})
  const response = await zotero.item({
    key: '',
    filter: {
      format: "json",
      include: "data,bib",
      style: "apa-single-spaced",
      linkwrap: 1,
      itemKey: arg.keys
    }
  })

  /*
response.array.forEach(element => {
  bib = bib + `${element.bib} ${link[arg.group]}${element.key} ${element.data.rights}`;
});
*/
  //  console.log(typeof (response))
  if (!response) {
    console.log("1 - item not found - item does not exist")
    return null
  }
  //console.log("TEMPORARY="+JSON.stringify(     response       ,null,2))
  /*
    var resp = response.map(
      element => {
        return {
          bib: element.bib.replace("</div>\n</div>",""),
          key: element.key,
          rights: element.data.rights
        }
      }
    )
  */
  const evlib = {
    2129771: "https://docs.opendeved.net/lib/"
  }
  var resp = response.map(
    element =>
      element.bib
        .replace("</div>\n</div>", "")
        .replace('<div class="csl-bib-body" style="line-height: 1.35; padding-left: 1em; text-indent:-1em;">', '<div class="csl-bib-body">')
      +
      // (evlib[arg.group] ? ` Available from <a href="${evlib[arg.group] + element.key}">${evlib[arg.group] + element.key}</a>.` : "")
      //+
      (element.data.rights ? ` Available under ${element.data.rights}.` : "")
      +
      (evlib[arg.group] ? ` [<a href="${evlib[arg.group] + element.key}?src=${arg.zgroup}:${arg.zkey}">details</a>]` : "")
      +
      "</div>\n</div>"
  )
  // console.log("response = " + JSON.stringify(resp, null, 2))  
  // TODO: Have automated test to see whether successful.
  console.log(resp.join("\n"))
}


main()

