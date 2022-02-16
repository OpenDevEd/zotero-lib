#!/usr/bin/env node

import formatAsXMP from './utils/formatAsXMP';
import formatAsCrossRefXML from './utils/formatAsCrossRefXML';
import printJSON from './utils/printJSON';
import Zotero from './zotero-lib';
import { ArgumentParser } from 'argparse';
import formatAsZenodoJson from './utils/formatAsZenodoJson';
import logger from './logger';
import { configAllParsers, configParserFor } from './sub-commands';
const fs = require('fs');
const zoteroLib = new Zotero({});

/**
 *  Command Line Interface
 *
 */
async function commandLineInterface() {
  // --- main ---
  var args = getArguments();
  // const zotero = new Zotero()
  if (args.version) {
    getVersion();
    process.exit(0);
  }
  if (args.verbose) {
    console.log('zotero-cli starting...');
  }
  if (args.dryrun) {
    console.log(
      `API command:\n Zotero.${args.func}(${JSON.stringify(args, null, 2)})`,
    );
  } else {
    /* // ZenodoAPI.${args.func.name}(args)
       //zotero[args.func.name](args).catch(err => {
       args.func(args).catch(err => {
         console.error('error:', err)
         process.exit(1)
       });
     } */

    // using default=2 above prevents the overrides from being picked up
    if (args.indent === null) args.indent = 2;

    if (args.verbose) zoteroLib.showConfig();
    // call the actual command
    if (!args.func) {
      console.log('No arguments provided. Use -h for help.');
      process.exit(0);
    }
    try {
      // await this['$' + args.command.replace(/-/g, '_')]()
      // await this[args.command.replace(/-/g, '_')]()
      if (args.verbose) console.log('ARGS=' + JSON.stringify(args, null, 2));
      let result = await zoteroLib[args.func](args);
      // This really just works for 'item'... should realy move those functions elsewhere
      if (args.xmp) {
        result = formatAsXMP(result);
      }
      if (args.crossref) {
        result = await formatAsCrossRefXML(result, args);
      }
      if (args.zenodo) {
        args.zenodoWriteFile = true;
        result = await getZenodoJson(result, args);
      }
      if (args.verbose) {
        const myout = {
          result,
          output: zoteroLib.output,
        };
        console.log(
          '{Result, output}=' +
            JSON.stringify(myout, null, zoteroLib.config.indent),
        );
      }

      if (args.out) {
        logger.info(`writing output to file ${args.out}`);
        fs.writeFileSync(
          args.out,
          JSON.stringify(result, null, zoteroLib.config.indent),
        );
      } else {
        logger.info(`writing output to console`);
        console.log(printJSON(result));
      }
    } catch (ex) {
      zoteroLib.print('Command execution failed: ', ex);
      process.exit(1);
    }
  }
}

// local functions
function getVersion() {
  const pjson = require('../package.json');
  if (pjson.version) console.log(`zenodo-lib version=${pjson.version}`);
  return pjson.version;
}

function getArguments() {
  const parser = new ArgumentParser({
    description: 'Zotero command line utility',
  });
  parser.add_argument('--api-key', {
    help: 'The API key to access the Zotero API.',
  });
  parser.add_argument('--config', {
    type: 'str',
    help:
      'Configuration file (toml format). Note that ./zotero-cli.toml and ~/.config/zotero-cli/zotero-cli.toml is picked up automatically.',
  });
  parser.add_argument('--config-json', {
    type: 'str',
    help: 'Configuration string in json format.',
  });
  parser.add_argument('--user-id', {
    type: 'int',
    help: 'The id of the user library.',
  });
  parser.add_argument('--group-id', {
    action: 'store',
    type: 'int',
    help: 'The id of the group library.',
  });
  // See below. If changed, add: You can provide the group-id as zotero-select link (zotero://...). Only the group-id is used, the item/collection id is discarded.
  parser.add_argument('--indent', {
    type: 'int',
    help: 'Identation for json output.',
  });
  parser.add_argument('--verbose', {
    action: 'store_true',
    help: 'Log requests.',
  });
  parser.add_argument('--dryrun', {
    action: 'store_true',
    help: 'Show the API request and exit.',
    default: false,
  });
  parser.add_argument('--out', { help: 'Output to file' });
  parser.add_argument('--show', {
    action: 'store_true',
    help: 'Print the result to the commandline.',
    default: false,
  });
  parser.add_argument('--version', {
    action: 'store_true',
    help: 'Show version',
  });

  /*
    The following code adds subparsers.
    */
  const subparsers = parser.add_subparsers({
    help: "Help for these commands is available via 'command --help'.",
  });

  configAllParsers(subparsers);
  // zoteroLib.item({ getInterface: true }, subparsers);
  // zoteroLib.items({ getInterface: true }, subparsers);
  zoteroLib.create_item({ getInterface: true }, subparsers);
  zoteroLib.update_item({ getInterface: true }, subparsers);
  zoteroLib.collection({ getInterface: true }, subparsers);
  zoteroLib.collections({ getInterface: true }, subparsers);
  // zoteroLib.publications({ getInterface: true }, subparsers);
  zoteroLib.tags({ getInterface: true }, subparsers);

  zoteroLib.attachment({ getInterface: true }, subparsers);
  zoteroLib.types({ getInterface: true }, subparsers);
  zoteroLib.groups({ getInterface: true }, subparsers);
  zoteroLib.fields({ getInterface: true }, subparsers);

  zoteroLib.searches({ getInterface: true }, subparsers);
  zoteroLib.key({ getInterface: true }, subparsers);

  // Utility functions
  zoteroLib.field({ getInterface: true }, subparsers);
  zoteroLib.update_url({ getInterface: true }, subparsers);
  zoteroLib.get_doi({ getInterface: true }, subparsers);
  zoteroLib.update_doi({ getInterface: true }, subparsers);
  zoteroLib.enclose_item_in_collection({ getInterface: true }, subparsers);
  zoteroLib.attach_link({ getInterface: true }, subparsers);
  zoteroLib.attach_note({ getInterface: true }, subparsers);
  zoteroLib.KerkoCiteItemAlsoKnownAs({ getInterface: true }, subparsers);
  zoteroLib.getbib({ getInterface: true }, subparsers);

  // Functions for get, post, put, patch, delete. (Delete query to API with uri.)
  // zoteroLib.__get({ getInterface: true }, subparsers);

  zoteroLib.__post({ getInterface: true }, subparsers);
  zoteroLib.__put({ getInterface: true }, subparsers);
  zoteroLib.__patch({ getInterface: true }, subparsers);
  zoteroLib.__delete({ getInterface: true }, subparsers);

  // Other URLs
  // https://www.zotero.org/support/dev/web_api/v3/basics
  // /keys/<key>
  // /users/<userID>/groups

  // parser.set_defaults({ "func": new Zotero().run() });
  // zotero.parser.parse_args();

  return parser.parse_args();
}

async function getZenodoJson(item, args: any) {
  const updateDoc = await formatAsZenodoJson(item, args);
  // console.log("getZenodoJson updateDoc="+JSON.stringify(    updateDoc        ,null,2))

  if (args.zenodoWriteFile) {
    await fs.writeFile(
      'updateDoc.json',
      JSON.stringify(updateDoc),
      'utf-8',
      function (err) {
        if (err) console.log(err);
      },
    );
  }
  return updateDoc;
}

async function main() {
  // console.log("Command-line: config")
  // const zotero = await new Zotero({});
  // console.log("Command-line: start")
  // console.log("Command-line: done")
  await await commandLineInterface()
    .then()
    .catch((err) => {
      console.error('error:', err);
      process.exit(1);
    });
}

main();
