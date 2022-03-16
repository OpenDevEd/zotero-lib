#!/usr/bin/env node

import formatAsXMP from './utils/formatAsXMP';
import formatAsCrossRefXML from './utils/formatAsCrossRefXML';
import printJSON from './utils/printJSON';
import Zotero from './zotero-lib';
import { ArgumentParser } from 'argparse';
import formatAsZenodoJson from './utils/formatAsZenodoJson';
import logger from './logger';
import { configAllParsers } from './sub-commands';
const fs = require('fs');

const zoteroLib = new Zotero({});

/**
 * Initialize Command Line Interface
 */
async function main() {
  const args = parseArguments();
  if (args.version) {
    getVersion();
    process.exit(0);
  }

  if (args.verbose) {
    logger.info('zotero-cli starting...');
    zoteroLib.showConfig();
  }

  if (args.dryrun) {
    logger.info(
      `API command:\n Zotero.${args.func}(${JSON.stringify(args, null, 2)})`,
    );
    return;
  }

  // using default=2 above prevents the overrides from being picked up
  if (args.indent === null) args.indent = 2;

  // call the actual command
  if (!args.func) {
    logger.info('No arguments provided. Use -h for help.');
    process.exit(0);
  }

  try {
    if (args.verbose) logger.info('ARGS=' + JSON.stringify(args, null, 2));
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
      logger.info(
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
      logger.info(printJSON(result));
    }
  } catch (error) {
    zoteroLib.print('Command execution failed: ', error);
    process.exit(1);
  }
}

// local functions
function getVersion() {
  const pjson = require('../package.json');
  if (pjson.version) logger.info(`zenodo-lib version=${pjson.version}`);
  return pjson.version;
}

function parseArguments() {
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

  /**
   * The following code adds subparsers.
   */
  const subparsers = parser.add_subparsers({
    help: "Help for these commands is available via 'command --help'.",
  });
  configAllParsers(subparsers);

  // parse and return args
  return parser.parse_args();
}

async function getZenodoJson(item, args: any) {
  const updateDoc = await formatAsZenodoJson(item, args);
  // logger.info("getZenodoJson updateDoc="+JSON.stringify(    updateDoc        ,null,2))

  if (args.zenodoWriteFile) {
    await fs.writeFile(
      'updateDoc.json',
      JSON.stringify(updateDoc),
      'utf-8',
      function (err) {
        if (err) logger.info(err);
      },
    );
  }
  return updateDoc;
}

main()
  .then()
  .catch((err) => {
    console.error('error:', err);
    process.exit(1);
  });
