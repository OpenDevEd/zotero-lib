import Zotero from './zotero-lib.js??ts??';

const config = {


}
const zotero = new Zotero(config)
let args = {
    template: "report"
}
console.log(JSON.stringify(zotero.$create_item(args), null, 2))

// run the library 