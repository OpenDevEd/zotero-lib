#!/usr/bin/env node

// import { parse } from '@iarna/toml';
// import * as argparse from 'argparse';
//var Zotero = require('../zotero-lib/bin/zotero-api-lib');
//var Zotero = require('zotero-lib');

import Zotero from './zotero-lib';

async function main() {
  //console.log("Command-line: config")
  // TODO: discuss no async with constructor
  // const zotero = await new Zotero({});
  const zotero = new Zotero({});
  //console.log("Command-line: start")
  await zotero
    .commandlineinterface()
    .then
    //console.log("Command-line: done")
    ()
    .catch((err) => {
      console.error('error:', err);
      process.exit(1);
    });
}

main();
