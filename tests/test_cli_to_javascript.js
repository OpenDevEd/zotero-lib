const Zotero = require('../build/zotero-lib')

async function main() {

	try {
		// please paste your code to test it here and run this command:
		// npm run test:cli_to_javascript
		let test = new Zotero()
		let title = await test.field({ 'field': ['title'], 'key': ["JQ2T3F4D"] })

		console.log(title)
		//title = await test.field({'field':'title','value': `xxx${title.data}`, 'key':"JQ2T3F4D"})
		console.log(title)
	}
	catch (e) {
		console.log(e)
	}
}
main();


