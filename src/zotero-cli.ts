#!/usr/bin/env node

// import { parse } from '@iarna/toml';
// import * as argparse from 'argparse';
//var Zotero = require('../zotero-lib/bin/zotero-api-lib');
//var Zotero = require('zotero-lib');
var Zotero = require('./zotero-lib')

/*
module.exports = {
  node: 'current'
};*/

async function main() {
  const zotero = new Zotero()
  zotero.commandlineinterface().then(
    console.log("done")
  ).catch(err => {
    console.error('error:', err)
    process.exit(1)
  })
}

main()