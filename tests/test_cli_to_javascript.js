

	const Zotero = require('../build/zotero-lib')

	async function main() {

let zotzenlib = new Zotero()
// let title =await test.field({'field':['title'], 'key':["JQ2T3F4D"]})
const options =  {"key":"","xmp":false,"crossref":false,"crossref_submit":false,"crossref_no_confirm":false,"zenodo":false,"switchNames":false,"organise_extra":false,"children":false,"filter":"{\"format\": \"json\", \"include\": \"data,bib\", \"style\": \"apa-single-spaced\", \"linkwrap\": 1, \"itemKey\": \"C9G45485\"}","validate":false}
    const result = await zotzenlib.item(options)
console.log(result)
//title = await test.field({'field':'title','value': `xxx${title.data}`, 'key':"JQ2T3F4D"})
	}
main();


