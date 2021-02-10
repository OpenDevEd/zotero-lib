/*
Testing record creation.
*/
const Zotero = require('../build/zotero-lib')
const fs = require('fs')

async function main() {
    var zotero = new Zotero({
        verbose: true,
        "group-id": 2259720,
        api_key: "egjTysVlgTWzEjO4sevC6RXS"
    })
    let collections = await zotero.collections({
        key: "HP6NALR4",
        terse: true
    })
    console.log("final=" + JSON.stringify(collections, null, 2))
    return 0
}

main()

