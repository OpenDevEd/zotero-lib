#!/usr/bin/env node

import Ajv from 'ajv';
import logger from './logger';
import sleep from './utils/sleep';

import processExtraField from './utils/processExtraField';
import newVanityDOI from './utils/newVanityDOI';
import { createHttpClient } from './http.client';
import {
  as_array,
  as_value,
  catchme,
  colophon,
  getCanonicalURL,
  isomessage,
  urlify,
} from './utils';
import decoration from './decoartions';
import { readConfigFile } from './readConfigFile';

require('dotenv').config();
require('docstring');

const _ = require('lodash');
const he = require('he');
const convert = require('xml-js');

const fs = require('fs');
const path = require('path');
const LinkHeader = require('http-link-header');

const ajv = new Ajv();
const md5 = require('md5-file');

class Zotero {
  // The following config keys are expected/allowed,
  // with both "-" and "_". The corresponding variables have _
  config_keys = [
    'user-id',
    'group-id',
    'library-type',
    'api-key',
    'indent',
    'verbose',
    'debug',
    'config',
    'config-json',
    'zotero-schema',
  ];

  config: any;

  output: string = '';

  http: any;

  constructor(args = {}) {
    // Read config
    this.config = this.configure(args, true);

    this.http = createHttpClient({
      headers: {
        'User-Agent': 'Zotero-CLI',
        'Zotero-API-Version': '3',
        'Zotero-API-Key': this.config['api_key'],
      },
    });
  }

  public configure(args, shouldReadConfigFile = false) {
    // pick up config: The function reads args and populates config

    let config = {};

    // STEP 1. Read config file
    if (shouldReadConfigFile || args.config) {
      config = readConfigFile(args, config);
      logger.info('reading config files: ', config);
    }

    // STEP 2. Apply --config_json option
    if (args.config_json) {
      let configObject = args.config_json;

      if (typeof args.config_json === 'string') {
        configObject = JSON.parse(args.config_json);
      }

      config = { ...config, ...configObject };
    }

    const result = this.canonicalConfig(config, args);
    console.log('canonical config: ', result);

    if (args.verbose) {
      console.log('config=' + JSON.stringify(result, null, 2));
    }

    // Check that not both are undefined:
    if (!result.user_id && !result.group_id) {
      console.log('result: ', result);
      throw new Error(
        'Both user/group are missing. You must provide exactly one of --user-id or --group-id',
      );
    }

    // Check that one and only one is defined:
    if (result.user_id && result.group_id) {
      throw new Error(
        'Both user/group are specified. You must provide exactly one of --user-id or --group-id',
      );
    }

    if (args.indent === null) {
      args.indent = 2;
    }

    if (result.indent === null) {
      result.indent = 2;
    }

    return result;
  }

  /**
   * format Array of string tags as Array of Object tags
   * Will convert ['title'] to [{tag: 'title', type: 0}]
   */
  public objectifyTags(tags) {
    const result = [];
    if (tags) {
      tags = as_array(tags);
      tags.forEach((item) => {
        result.push({ tag: item, type: 0 });
      });
    }
    return result;
  }

  /**
   * Takes config and args defined in various supported formats
   * and return standardized configs i.e. it will convert api-key,
   * api_key, zotero-api-key or zotero_api_key to api_key
   * @param _config - current configs
   * @param _args - configs provided in args
   * @returns standardized configs
   */
  private canonicalConfig(_config: any, args: any) {
    const config = { ..._config };

    console.log('config', config);
    console.log('args', args);

    this.config_keys.forEach((key) => {
      const key_zotero = 'zotero-' + key;
      const key_underscore = key.replace(/-/g, '_');
      const key_zotero_underscore = key_zotero.replace(/-/g, '_');

      if (key !== key_underscore) {
        // Fix existing config
        if (config[key]) {
          config[key_underscore] = config[key];
          delete config[key];
        }
        // Fix existing arg
        if (args[key]) {
          args[key_underscore] = args[key];
          delete args[key];
        }
      }

      // Now we just have the underscore form of the key.
      // If there is a "zotero-" form, copy to "zotero_" form.
      if (args[key_zotero]) {
        args[key_zotero_underscore] = args[key_zotero];
        delete args[key_zotero];
      }
      // If there is a key_zotero_underscore, let it override key_underscore
      if (args[key_zotero_underscore]) {
        args[key_underscore] = args[key_zotero_underscore];
        // retain the key.
      }
      // finally, copy available value to config:
      if (args[key_underscore]) {
        args[key_underscore] = as_value(args[key_underscore]);
        config[key_underscore] = args[key_underscore];
      }
    });
    return config;
  }

  public showConfig() {
    console.log('showConfig=' + JSON.stringify(this.config, null, 2));
    return this.config;
  }

  private async reconfigure(args) {
    // Changing this to a more limited reconfigure
    const canonicalArgs = this.canonicalConfig({}, args);
    this.configure(canonicalArgs, false);
  }

  private message(stat = 0, msg = 'None', data = null) {
    return {
      status: stat,
      message: msg,
      data,
    };
  }

  private finalActions(output) {
    // console.log("args="+JSON.stringify(args))
    // TODO: Look at the type of output: if string, then print, if object, then stringify
    if (this.config.out) {
      fs.writeFileSync(
        this.config.out,
        JSON.stringify(output, null, this.config.indent),
      );
    }
    if (this.config.show || this.config.verbose) this.show(output);
  }

  // library starts.
  //TODO: this was made public because of cli refactoring
  // see if we can make it private again
  public print(...args: any[]) {
    if (!this.config.out) {
      console.log.apply(console, args);
    } else {
      this.output +=
        args
          .map((m) => {
            const type = typeof m;

            if (
              type === 'string' ||
              m instanceof String ||
              type === 'number' ||
              type === 'undefined' ||
              type === 'boolean' ||
              m === null
            ) {
              return m;
            }

            if (m instanceof Error) {
              return `<Error: ${m.message || m.name}${
                m.stack ? `\n${m.stack}` : ''
              }>`;
            }

            if (m && type === 'object' && m.message) {
              return `<Error: ${m.message}#\n${m.stack}>`;
            }

            return JSON.stringify(m, null, this.config.indent);
          })
          .join(' ') + '\n';
    }
  }

  // Function to get more than 100 records, i.e. chunked retrieval.
  async all(uri, params = {}) {
    let chunk = await this.http
      .get(
        uri,
        {
          resolveWithFullResponse: true,
          params,
        },
        this.config,
      )
      .catch((error) => {
        console.log('Error in all: ' + error);
      });

    let data = chunk.body;

    let link =
      chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
    while (link && link.length && link[0].uri) {
      if (chunk.headers.backoff) {
        await sleep(parseInt(chunk.headers.backoff) * 1000);
      }

      chunk = await this.http
        .get(link[0].uri, {
          fulluri: true,
          resolveWithFullResponse: true,
          params,
        })
        .catch((error) => {
          console.log('Error in all: ' + error);
        });
      data = data.concat(chunk.body);
      link =
        chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
    }
    return data;
  }

  /**
   * Expose 'get'
   * Make a direct query to the API using 'GET uri'.
   */
  public async __get(args) {
    this.reconfigure(args);

    const out = [];
    for (const uri of args.uri) {
      const res = await this.http.get(
        uri,
        { userOrGroupPrefix: !args.root },
        this.config,
      );
      if (args.show) {
        this.show(res);
      }
      out.push(res);
    }
    return out;
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,

  /**
   * Expose 'post'. Make a direct query to the API using
   * 'POST uri [--data data]'.
   */
  public async __post(args) {
    this.reconfigure(args);

    const res = await this.http.post(args.uri, args.data, {}, this.config);
    this.print(res);
    return res;
  }

  /**
   * Make a direct query to the API using
   * 'PUT uri [--data data]'.
   */
  public async __put(args) {
    this.reconfigure(args);

    const res = await this.http.put(args.uri, args.data, this.config);
    this.print(res);
    return res;
  }

  /**
   * Make a direct query to the API using
   * 'PATCH uri [--data data]'.
   */
  public async __patch(args) {
    this.reconfigure(args);

    const res = await this.http.patch(
      args.uri,
      args.data,
      args.version,
      this.config,
    );
    this.print(res);
    return res;
  }

  /**
   * Make a direct delete query to the API using
   * 'DELETE uri'.
   */
  public async __delete(args) {
    this.reconfigure(args);

    const out = [];
    for (const uri of args.uri) {
      // console.log(uri)
      const response = await this.http.get(uri, undefined, this.config);
      // console.log(response)
      out.push[await this.http.delete(uri, response.version, this.config)];
    }
    process.exit(1);
    return out;
  }

  /**
   * Show details about this API key.
   * (API: /keys )
   */
  public async key(args) {
    this.reconfigure(args);

    if (!args.api_key) {
      args.api_key = this.config.api_key;
    }
    const res = await this.http.get(
      `/keys/${args.api_key}`,
      {
        userOrGroupPrefix: false,
      },
      this.config,
    );
    this.show(res);
    let res2 = [];
    if (args.groups) {
      // TODO: This only retrieves 100 libraries. Need to an 'all' query.
      res2 = await this.http.get(
        `/users/${res.userID}/groups`,
        {
          params: { limit: 100 },
          userOrGroupPrefix: false,
        },
        this.config,
      );
      // /users/<userID>/groups
      if (args.terse) {
        console.log(`Number of groups: ${res2.length}`);
        const res3 = res2.sort((a, b) =>
          a.data.name > b.data.name ? 1 : b.data.name > a.data.name ? -1 : 0,
        );
        res3.forEach((element) => {
          const data = element.data;
          console.log(`${data.id}\t${data.name} ${data.owner} ${data.type}`);
        });
      } else {
        this.show(res2);
      }
      if (res2.length > 100) {
        console.log(`Warning - only first 100 retrieved. ${res2.length}`);
      }
    }
    return { key: res, groups: res2 };
  }

  // End of standard API calls

  // Utility functions. private?
  async count(uri, params = {}) {
    return (
      await this.http.get(
        uri,
        { resolveWithFullResponse: true, params },
        this.config,
      )
    ).headers['total-results'];
  }

  private show(v) {
    // TODO: Look at the type of v: if string, then print, if object, then stringify
    // this.print(JSON.stringify(v, null, this.config.indent).replace(new RegExp(this.config.api_key, 'g'), '<API-KEY>'))
    this.print(JSON.stringify(v, null, this.config.indent));
  }

  private extractKeyGroupVariable(key, n) {
    // n=1 -> group
    // n=2 -> items vs. collections
    // n=3 -> key
    // zotero://select/groups/(\d+)/(items|collections)/([A-Z01-9]+)
    // TO DO - make this function array->array and string->string.
    if (Array.isArray(key)) {
      key = key.map((mykey) => {
        return this.extractKeyGroupVariable(mykey, n);
      });
      return key;
    } else {
      let out = '';
      key = key.toString();
      const res = key.match(
        /^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/,
      );
      if (res) {
        // console.log("extractKeyGroupVariable -> res=" + JSON.stringify(res, null, 2))
        if (res[2] === 'library') {
          console.log(
            'You cannot specify zotero-select links (zotero://...) to select user libraries.',
          );
          return null;
        } else {
          // console.log("Key: zotero://-key provided for "+res[2]+" Setting group-id.")
          this.config.group_id = res[1];
          out = res[n];
          // console.log(`--> ${n}/${out}`)
        }
      } else {
        // There wasn't a match. We might have a group, or a key.
        // console.log("extractKeyGroupVariable: direct return")
        if (key.match(/^([A-Z01-9]+)/)) {
          if (n === 1) {
            // Group requested
            if (key.match(/^([01-9]+)/)) {
              // This is slightly ropy - presumably a zotero item key could just be numbers?
              out = key;
            } else {
              out = undefined;
            }
          } else if (n === 2) {
            // items|collections requested - but we cannot tell
            out = undefined;
          } else if (n === 3) {
            // item requested - this is ok, because we wouldn't expect a group to go in as sole argument
            out = key;
          } else {
            out = undefined;
          }
        } else {
          out = undefined;
        }
      }
      // console.log("extractKeyGroupVariable:result=" + out)
      return out;
    }
  }

  private extractKeyAndSetGroup(key) {
    // console.log("extractKeyAndSetGroup")
    return this.extractKeyGroupVariable(key, 3);
  }

  public async attachNoteToItem(
    PARENT,
    options: { content?: string; tags?: any } = {
      content: 'Note note.',
      tags: [],
    },
  ) {
    const tags = this.objectifyTags(options.tags);
    // const noteText = options.content.replace(/\n/g, "\\n").replace(/\"/g, '\\\"')
    const noteText = options.content.replace(/\n/g, '<br>');
    const json = {
      parentItem: PARENT,
      itemType: 'note',
      note: noteText,
      tags,
      collections: [],
      relations: {},
    };
    return this.create_item({ item: json });
  }

  // TODO: Rewrite other function args like this.
  // Rather than fn(args) have fn({......})
  public async attachLinkToItem(
    PARENT,
    URL,
    options: { title?: string; tags?: any } = {
      title: 'Click to open',
      tags: [],
    },
  ) {
    const tags = this.objectifyTags(options.tags);
    console.log('Linktitle=' + options.title);
    const json = {
      parentItem: PARENT,
      itemType: 'attachment',
      linkMode: 'linked_url',
      title: options.title,
      url: URL,
      note: '',
      contentType: '',
      charset: '',
      tags,
      relations: {},
    };
    return this.create_item({ item: json });
  }

  /**
   * Retrieve a list of collections or create a collection.
   * (API: /collections, /collections/top, /collections/<collectionKey>/collections).
   * Use 'collections --help' for details.
   *
   * https://www.zotero.org/support/dev/web_api/v3/basics
   * Collections
   * <userOrGroupPrefix>/collections Collections in the library
   * <userOrGroupPrefix>/collections/top Top-level collections in the library
   * <userOrGroupPrefix>/collections/<collectionKey> A specific collection in the library
   * <userOrGroupPrefix>/collections/<collectionKey>/collections Subcollections within a specific collection in the library
   * TODO: --create-child should go into 'collection'.
   */
  public async collections(args) {
    this.reconfigure(args);

    if (args.key) {
      args.key = this.extractKeyAndSetGroup(as_value(args.key));
    }

    // 'Unable to extract group/key from the string provided.',
    if (!args.key && !args.top) {
      return this.message(0, 'You should specify key or --top.');
    }

    args.create_child = as_array(args.create_child);

    if (args.create_child) {
      let response;
      if (args.key) {
        console.log('args.key=>args.create_child');
        response = await this.http.post(
          '/collections',
          JSON.stringify(
            args.create_child.map((c) => {
              return { name: c, parentCollection: args.key };
            }),
          ),
          {},
          this.config,
        );
      } else {
        console.log('(top)=>args.create_child');
        response = await this.http.post(
          '/collections',
          JSON.stringify(
            args.create_child.map((c) => {
              return { name: c };
            }),
          ),
          {},
          this.config,
        );
      }
      const resp = response;
      console.log('response=' + JSON.stringify(resp, null, 2));
      if (resp.successful) {
        this.print('Collections created: ', resp.successful);
        console.log('collection....done');
        return resp.successful;
      } else {
        console.log('collection....failed');
        console.log('response=' + JSON.stringify(resp, null, 2));
        return resp;
      }
      // TODO: In all functions where data is returned, add '.successful' - Zotero always wraps in that.
      // This leaves an array.
    } else {
      console.log('get...');
      // test for args.top: Not required.
      // If create_child==false:
      let collections = null;
      if (args.key) {
        collections = await this.all(`/collections/${args.key}/collections`);
      } else {
        collections = await this.all(`/collections${args.top ? '/top' : ''}`);
      }
      this.show(collections);
      this.finalActions(collections);
      if (args.terse) {
        console.log('test');
        collections = collections.map((element) =>
          Object({ key: element.data.key, name: element.data.name }),
        );
      }
      return collections;
    }
  }

  /**
   * Retrieve information about a specific collection
   * --key KEY (API: /collections/KEY or /collections/KEY/tags).
   * Use 'collection --help' for details.
   * (Note: Retrieve items is a collection via 'items --collection KEY'.)
   *
   * Operate on a specific collection.
   * <userOrGroupPrefix>/collections/<collectionKey>/items Items within a specific collection in the library
   * <userOrGroupPrefix>/collections/<collectionKey>/items/top Top-level items within a specific collection in the library
   * TODO: --create-child should go into 'collection'.
   * DONE: Why is does the setup for --add and --remove differ? Should 'add' not be "nargs: '*'"? Remove 'itemkeys'?
   * TODO: Add option "--output file.json" to pipe output to file.
   */
  async collection(args) {
    this.reconfigure(args);

    if (args.key) {
      args.key = this.extractKeyAndSetGroup(args.key);
    } else {
      const msg = this.message(
        0,
        'Unable to extract group/key from the string provided.',
      );
      return msg;
    }

    if (args.tags && args.add) {
      const msg = this.message(0, '--tags cannot be combined with --add');
      return msg;
    }
    if (args.tags && args.remove) {
      const msg = this.message(0, '--tags cannot be combined with --remove');
      return msg;
    }

    if (args.add) {
      for (const itemKey of args.add) {
        const item = await this.http.get(
          `/items/${itemKey}`,
          undefined,
          this.config,
        );
        if (item.data.collections.includes(args.key)) continue;
        await this.http.patch(
          `/items/${itemKey}`,
          JSON.stringify({
            collections: item.data.collections.concat(args.key),
          }),
          item.version,
          this.config,
        );
      }
    }

    if (args.remove) {
      for (const itemKey of args.remove) {
        const item = await this.http.get(`/items/${itemKey}`);
        const index = item.data.collections.indexOf(args.key);
        if (index > -1) {
          item.data.collections.splice(index, 1);
        }
        await this.http.patch(
          `/items/${itemKey}`,
          JSON.stringify({ collections: item.data.collections }),
          item.version,
          this.config,
        );
      }
    }

    const res = await this.http.get(
      `/collections/${args.key}${args.tags ? '/tags' : ''}`,
      undefined,
      this.config,
    );
    this.show(res);
    return res;
  }

  /**
   * Retrieve list of items from API.
   * (API: /items, /items/top, /collections/COLLECTION/items/top).
   * Use 'items --help' for details.
   * By default, all items are retrieved. With --top or limit (via --filter) the default number of items are retrieved.
   *
   * URI Description
   * https://www.zotero.org/support/dev/web_api/v3/basics
   * <userOrGroupPrefix>/items All items in the library, excluding trashed items
   * <userOrGroupPrefix>/items/top Top-level items in the library, excluding trashed items
   */
  async items(args) {
    this.reconfigure(args);
    let items;
    if (typeof args.filter === 'string') {
      args.filter = JSON.parse(args.filter);
    }

    if (args.count && args.validate) {
      const msg = this.message(0, '--count cannot be combined with --validate');
      return msg;
    }

    if (args.collection) {
      args.collection = this.extractKeyAndSetGroup(args.collection);
      if (!args.collection) {
        const msg = this.message(
          0,
          'Unable to extract group/key from the string provided.',
        );
        return msg;
      }
    }

    const collection = args.collection ? `/collections/${args.collection}` : '';

    if (args.count) {
      this.print(
        await this.count(
          `${collection}/items${args.top ? '/top' : ''}`,
          args.filter || {},
        ),
      );
      return;
    }

    const params = args.filter || {};

    if (args.top) {
      // This should be all - there may be more than 100 items.
      // items = await this.all(`${collection}/items/top`, { params })
      items = await this.all(`${collection}/items/top`, params);
    } else if (params.limit) {
      if (params.limit > 100) {
        const msg = this.message(
          0,
          'You can only retrieve up to 100 items with with params.limit.',
        );
        return msg;
      }
      // console.log("get-----")
      items = await this.http.get(
        `${collection}/items`,
        { params },
        this.config,
      );
    } else {
      // console.log("all-----")
      items = await this.all(`${collection}/items`, params);
    }

    if (args.validate || args.validate_with) {
      this.validate_items(args, items);
    }

    if (args.show) this.show(items);
    return items;
  }

  private async validate_items(args: any, items: any) {
    let schema_path = '';
    if (args.validate_with) {
      if (!fs.existsSync(args.validate_with))
        throw new Error(
          `You have provided a schema with --validate-with that does not exist: ${args.validate_with} does not exist`,
        );
      else schema_path = args.validate_with;
    } else {
      if (!fs.existsSync(this.config.zotero_schema))
        throw new Error(
          `You have asked for validation, but '${this.config.zotero_schema}' does not exist`,
        );
      else schema_path = this.config.zotero_schema;
    }
    const oneSchema = fs.lstatSync(schema_path).isFile();

    let validate = oneSchema
      ? ajv.compile(JSON.parse(fs.readFileSync(schema_path, 'utf-8')))
      : null;

    const validators = {};
    // still a bit rudimentary
    for (const item of items) {
      if (!oneSchema) {
        validate = validators[item.itemType] =
          validators[item.itemType] ||
          ajv.compile(
            JSON.parse(
              fs.readFileSync(
                path.join(schema_path, `${item.itemType}.json`),
                'utf-8',
              ),
            ),
          );
      }

      if (!validate(item)) {
        this.show(validate.errors);
      } else {
        console.log(`item ok! ${item.key}`);
      }
    }
  }

  //TODO: method name which are calling zotero endpoints should include links to relevant api docs
  /**
   * Retrieve an item (item --key KEY), save/add file attachments,
   * retrieve children. Manage collections and tags.
   * (API: /items/KEY/ or /items/KEY/children).
   * Also see 'attachment', 'create' and 'update'.
   * https://www.zotero.org/support/dev/web_api/v3/basics
   * <userOrGroupPrefix>/items/<itemKey> A specific item in the library
   * <userOrGroupPrefix>/items/<itemKey>/children Child items under a specific item
   */
  public async item(args) {
    this.reconfigure(args);

    const output = [];

    const my_key = this.extractKeyAndSetGroup(args.key);
    //args.group_id = my_group_id;
    args.key = my_key;
    // TODO: Need to implement filter as a command line option --filter="{...}"
    if (!args.key && !(args.filter && args.filter.itemKey)) {
      const msg = this.message(
        0,
        'Unable to extract group/key from the string provided.',
      );
      return msg;
    }

    var item;
    if (args.key) {
      item = await this.http.get(`/items/${args.key}`, undefined, this.config);
      output.push({ record: item });

      if (args.savefiles) {
        const children = await this.http.get(
          `/items/${args.key}/children`,
          undefined,
          this.config,
        );
        output.push({ children });
        await Promise.all(
          children
            .filter((item) => item.data.itemType === 'attachment')
            .map(async (item) => {
              if (item.data.filename) {
                console.log(`Downloading file ${item.data.filename}`);
                // TODO:
                // ??? await this.attachment({key: item.key, save: item.data.filename})
                // TODO: Is 'binary' correct?
                fs.writeFileSync(
                  item.data.filename,
                  await this.http.get(
                    `/items/${item.key}/file`,
                    undefined,
                    this.config,
                  ),
                  'binary',
                );
              } else {
                console.log(
                  `Not downloading file ${item.key}/${item.data.itemType}/${item.data.linkMode}/${item.data.title}`,
                );
              }
            }),
        );
      }

      if (args.addfiles) {
        console.log('Adding files...');
        const attachmentTemplate = await this.http.get(
          '/items/new?itemType=attachment&linkMode=imported_file',
          { userOrGroupPrefix: false },
          this.config,
        );
        for (const filename of args.addfiles) {
          if (args.debug) console.log('Adding file: ' + filename);
          if (!fs.existsSync(filename)) {
            const msg = this.message(
              0,
              `Ignoring non-existing file: ${filename}.`,
            );
            return msg;
          }

          const attach = attachmentTemplate;
          attach.title = path.basename(filename);
          attach.filename = path.basename(filename);
          attach.contentType = `application/${path.extname(filename).slice(1)}`;
          attach.parentItem = args.key;
          const stat = fs.statSync(filename);
          const uploadItem = JSON.parse(
            await this.http.post(
              '/items',
              JSON.stringify([attach]),
              {},
              this.config,
            ),
          );
          const uploadAuth = JSON.parse(
            await this.http.post(
              `/items/${uploadItem.successful[0].key}/file?md5=${md5.sync(
                filename,
              )}&filename=${attach.filename}&filesize=${
                fs.statSync(filename)['size']
              }&mtime=${stat.mtimeMs}`,
              '{}',
              { 'If-None-Match': '*' },
              this.config,
            ),
          );
          let request_post = null;
          if (uploadAuth.exists !== 1) {
            const uploadResponse = await this.http
              .post(
                uploadAuth.url,
                Buffer.concat([
                  Buffer.from(uploadAuth.prefix),
                  fs.readFileSync(filename),
                  Buffer.from(uploadAuth.suffix),
                ]),
                { 'Content-Type': uploadAuth.contentType },
                this.config,
              )
              .then((res) => res.data);
            if (args.verbose) {
              console.log('uploadResponse=');
              this.show(uploadResponse);
            }
            request_post = await this.http.post(
              `/items/${uploadItem.successful[0].key}/file?upload=${uploadAuth.uploadKey}`,
              '{}',
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                'If-None-Match': '*',
              },
              this.config,
            );
          }
          output.push({ file: request_post });
        }
      }

      if (args.addtocollection) {
        // console.log("-->" + args.addtocollection)
        // args.addtocollection = this.extractKeyAndSetGroup(args.addtocollection)
        // console.log("-->" + args.addtocollection)
        const newCollections = item.data.collections;
        args.addtocollection.forEach((itemKey) => {
          if (!newCollections.includes(itemKey)) {
            newCollections.push(itemKey);
          }
        });
        const addTo = await this.http.patch(
          `/items/${args.key}`,
          JSON.stringify({ collections: newCollections }),
          item.version,
          this.config,
        );
        output.push({ addtocollection: addTo });
      }

      console.log('args = ', { ...args });
      if (args.switchNames) {
        const { creators = [] } = item.data;

        logger.info('switching creators, old = %O', creators);

        let updatedCreators = creators.map((creator) => {
          if ('name' in creator) {
            return creator;
          }

          const { firstName, lastName, creatorType } = creator;

          return { lastName: firstName, firstName: lastName, creatorType };
        });

        logger.info('switched creators, new = %O', updatedCreators);
        const res = await this.http.patch(
          `/items/${args.key}`,
          JSON.stringify({ creators: updatedCreators }),
          item.version,
          this.config,
        );
        output.push({ switchNames: res });
      }

      if (args.organise_extra) {
        logger.info('organise extra: ' + item.data.extra);
        let updatedExtra = item.data.extra;
        const vanityDOI = newVanityDOI(
          item,
          this.config.group_id,
          args.crossref_user,
        );
        if (vanityDOI && !updatedExtra.match(`DOI: ${vanityDOI}`)) {
          updatedExtra = `DOI: ${vanityDOI}\n` + updatedExtra;
        }
        updatedExtra = processExtraField(updatedExtra);
        // logger.info(updatedExtra)
        if (item.data.extra != updatedExtra) {
          const res = await this.http.patch(
            `/items/${args.key}`,
            JSON.stringify({ extra: updatedExtra }),
            item.version,
            this.config,
          );
          logger.info('organise extra: ' + updatedExtra);
          output.push({ organise_extra: res });
          logger.info('We have added a new DOI - add a link as well.');
          const link0 = await this.attach_link({
            group_id: this.config.group_id,
            key: args.key,
            url: `https://doi.org/${vanityDOI}`,
            title: '👀View item via CrossRef DOI',
            tags: ['_r:doi', '_r:crossref'],
          });
          output.push({ link: link0 });
        } else {
          output.push({ organise_extra: null });
        }
      }

      if (args.removefromcollection) {
        args.removefromcollection = this.extractKeyAndSetGroup(
          args.removefromcollection,
        );
        const newCollections = item.data.collections;
        args.removefromcollection.forEach((itemKey) => {
          const index = newCollections.indexOf(itemKey);
          if (index > -1) {
            newCollections.splice(index, 1);
          }
        });
        const removefrom = await this.http.patch(
          `/items/${args.key}`,
          JSON.stringify({ collections: newCollections }),
          item.version,
          this.config,
        );
        output.push({ removefromcollection: removefrom });
      }

      if (args.addtags) {
        const newTags = item.data.tags;
        args.addtags.forEach((tag) => {
          if (!newTags.find((newTag) => newTag.tag === tag)) {
            newTags.push({ tag });
          }
        });
        const res = await this.http.patch(
          `/items/${args.key}`,
          JSON.stringify({ tags: newTags }),
          item.version,
          this.config,
        );
        output.push({ addtags: res });
      }

      if (args.removetags) {
        const newTags = item.data.tags.filter(
          (tag) => !args.removetags.includes(tag.tag),
        );
        const res = await this.http.patch(
          `/items/${args.key}`,
          JSON.stringify({ tags: newTags }),
          item.version,
          this.config,
        );
        output.push({ removetags: res });
      }
    }
    const params = args.filter || {};
    let result;
    if (args.children) {
      console.log('children');
      result = await this.http.get(
        `/items/${args.key}/children`,
        { params },
        this.config,
      );
      output.push({ children_final: result });
    } else {
      if (
        args.addtocollection ||
        args.removefromcollection ||
        args.removetags ||
        args.addtags ||
        args.filter
      ) {
        result = await this.http.get(
          `/items/${args.key}`,
          { params },
          this.config,
        );
      } else {
        // Nothing about the item has changed:
        result = item;
      }
      output.push({ item_final: result });
      if (args.fullresponse) {
        // return result
      } else {
        if (result && result.data) result = result.data;
      }
    }

    if (args.validate || args.validate_with) {
      this.validate_items(args, [result]);
    }

    // this.show(result)
    // console.log(JSON.stringify(args))
    this.output = JSON.stringify(output);

    if (args.show)
      console.log('item -> resul=' + JSON.stringify(result, null, 2));

    // return this.message(0,"Success", output)
    const finalactions = await this.finalActions(result);
    const return_value = args.fullresponse
      ? {
          status: 0,
          message: 'success',
          output,
          result,
          final: finalactions,
        }
      : result;
    return return_value;
    // TODO: What if this fails? Zotero will return, e.g.   "message": "404 - {\"type\":\"Buffer\",\"data\":[78,111,116,32,102,111,117,110,100]}",
    // console.log(Buffer.from(obj.data).toString())
    // Need to return a proper message.
  }

  /**
   * Retrieve/save file attachments for the item specified with --key KEY
   * (API: /items/KEY/file).
   * Also see 'item', which has options for adding/saving file attachments.
   */
  async attachment(args) {
    this.reconfigure(args);

    if (args.key) {
      args.key = this.extractKeyAndSetGroup(args.key);
      if (!args.key) {
        const msg = this.message(
          0,
          'Unable to extract group/key from the string provided.',
        );
        return msg;
      }
    }

    const blob = await this.http.get(
      `/items/${args.key}/file`,
      {
        arraybuffer: true,
      },
      this.config,
    );

    fs.writeFileSync(args.save, blob, 'binary');

    // TODO return better value.
    const response = await this.http.get(
      `/items/${args.key}`,
      undefined,
      this.config,
    );
    // At this point we should compare response.data.md5 and the md5sum(blob)

    return this.message(0, 'File saved', {
      filename: args.save,
      md5: response.data.md5,
      mtime: response.data.mtime,
    });
  }

  /**
   * Create a new item or items. (API: /items/new) You can retrieve
   * a template with the --template option.Use this option to create
   * both top-level items, as well as child items (including notes and links).
   */
  public async create_item(args) {
    this.reconfigure(args);

    if (args.template) {
      const result = await this.http.get(
        '/items/new',
        {
          userOrGroupPrefix: false,
          params: { itemType: args.template },
        },
        this.config,
      );
      this.show(result);
      // console.log("/"+result+"/")
      return result;
    } else if (Array.isArray(args.files) && args.files.length > 0) {
      if (!args.files.length)
        return this.message(
          0,
          'Need at least one item (args.items) to create or use args.template',
        );
      //  all items are read into a single structure:
      const items = args.files.map((item) =>
        JSON.parse(fs.readFileSync(item, 'utf-8')),
      );
      const itemsflat = items.flat(1);
      // console.log("input")
      // this.show(items)
      let res = [];
      const batchSize = 50;
      if (itemsflat.length <= batchSize) {
        const result = await this.http.post(
          '/items',
          JSON.stringify(itemsflat),
          {},
          this.config,
        );
        res.push(result);
        this.show(res);
      } else {
        /* items.length = 151
        0..49 (end=50)
        50..99 (end=100)
        100..149 (end=150)
        150..150 (end=151)
        */
        for (var start = 0; start < itemsflat.length; start += batchSize) {
          const end =
            start + batchSize <= itemsflat.length
              ? start + batchSize
              : itemsflat.length + 1;
          // Safety check - should always be true:
          if (itemsflat.slice(start, end).length) {
            console.error(`Uploading objects ${start} to ${end}-1`);
            console.log(`Uploading objects ${start} to ${end}-1`);
            console.log(`${itemsflat.slice(start, end).length}`);
            const result = await this.http.post(
              '/items',
              JSON.stringify(itemsflat.slice(start, end)),
              {},
              this.config,
            );
            res.push(result);
          } else {
            console.error(`NOT Uploading objects ${start} to ${end}-1`);
            console.log(`NOT Uploading objects ${start} to ${end}-1`);
            console.log(`${itemsflat.slice(start, end).length}`);
          }
        }
      }
      // TODO: see how to use pruneData
      return res;
    } else if ('items' in args && args.items.length > 0) {
      const result = await this.http.post(
        '/items',
        JSON.stringify(args.items),
        {},
        this.config,
      );
      const res = result;
      this.show(res);
      // TODO: see how to use pruneData
      return res;
    } else if (args.item) {
      const result = await this.http.post(
        '/items',
        '[' + JSON.stringify(args.item) + ']',
        {},
        this.config,
      );
      this.show(result);
      return this.pruneData(result, args.fullresponse);
    }
  }

  public pruneData(res, fullresponse = false) {
    // logger.info('pruneData res = %O', res);
    if (fullresponse) return res;
    return res.successful['0'].data;
  }

  /**
   * Update/replace an item (--key KEY), either update (API: patch /items/KEY)
   * or replacing (using --replace, API: put /items/KEY).
   */
  public async update_item(args) {
    this.reconfigure(args);

    if (!args.replace) {
      args.replace = false;
    }
    // console.log("1")
    if (args.file && args.json) {
      return this.message(0, 'You cannot specify both file and json.', args);
    }
    if (!args.file && !args.json) {
      return this.message(0, 'You must specify either file or json.', args);
    }
    // console.log("2b")
    if (args.key) {
      args.key = this.extractKeyAndSetGroup(args.key);
    } else {
      const msg = this.message(
        0,
        'Unable to extract group/key from the string provided. Arguments attached.',
        args,
      );
      console.log(msg);
      // return msg
    }
    // console.log("2c")
    let originalItemVersion = 0;
    if (args.version) {
      originalItemVersion = args.version;
    } else {
      const originalItem = await this.http.get(
        `/items/${args.key}`,
        undefined,
        this.config,
      );
      originalItemVersion = originalItem.version;
    }
    let jsonstr = '';
    if (args.json) {
      args.json = as_value(args.json);
      if (typeof args.json !== 'string') jsonstr = JSON.stringify(args.json);
      else jsonstr = args.json;
      // console.log("j=" + jsonstr)
    } else if (args.file) {
      args.file = as_value(args.file);
      jsonstr = fs.readFileSync(args.file);
    }

    const result = await this[args.replace ? 'put' : 'patch'](
      `/items/${args.key}`,
      jsonstr,
      originalItemVersion,
    );

    return result;
  }

  // <userOrGroupPrefix>/items/trash Items in the trash
  /** Return a list of items in the trash. */
  // async trash(args) {
  //   this.reconfigure(args);
  //   const items = await this.http.get('/items/trash', undefined, this.config);
  //   this.show(items);
  //   return items;
  // }

  /**
   * Return a list of items in publications (user library only).
   * (API: /publications/items)
   * @param args
   * @returns
   *
   * https://www.zotero.org/support/dev/web_api/v3/basics
   * <userOrGroupPrefix>/publications/items Items in My Publications
   */
  async publications(args) {
    this.reconfigure(args);

    const items = await this.http.get(
      '/publications/items',
      undefined,
      this.config,
    );
    this.show(items);
    return items;
  }

  /**
   * Retrieve a list of items types available in Zotero.
   * (API: /itemTypes)
   */
  async types(args) {
    this.reconfigure(args);

    const types = await this.http.get(
      '/itemTypes',
      {
        userOrGroupPrefix: false,
      },
      this.config,
    );
    this.show(types);
    return types;
  }

  /**
   * Retrieve the Zotero groups data to which the current
   * library_id and api_key has access to.
   * (API: /users/<user-id>/groups)
   */
  async groups(args) {
    this.reconfigure(args);

    const groups = await this.http.get('/groups', undefined, this.config);
    this.show(groups);
    return groups;
  }

  /**
   * Retrieve a template with the fields for --type TYPE
   * (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields
   * (API: /itemFields).
   * Note that to retrieve a template, use 'create-item --template TYPE'
   * rather than this command.
   */
  async fields(args) {
    this.reconfigure(args);

    if (args.type) {
      const result = {
        itemTypeFields: await this.http.get(
          '/itemTypeFields',
          {
            params: { itemType: args.type },
            userOrGroupPrefix: false,
          },
          this.config,
        ),
        itemTypeCreatorTypes: await this.http.get(
          '/itemTypeCreatorTypes',
          {
            params: { itemType: args.type },
            userOrGroupPrefix: false,
          },
          this.config,
        ),
      };
      this.show(result);
      return result;
    } else {
      const result = {
        itemFields: await this.http.get(
          '/itemFields',
          {
            userOrGroupPrefix: false,
          },
          this.config,
        ),
      };
      this.show(result);
      return result;
    }
  }

  /**
   * Return a list of the saved searches of the library.
   * Create new saved searches. (API: /searches)
   * @param args
   * @param subparsers
   * @returns
   *
   * https://www.zotero.org/support/dev/web_api/v3/basics
   */
  async searches(args) {
    this.reconfigure(args);

    if (args.create) {
      let searchDef = [];
      try {
        searchDef = JSON.parse(fs.readFileSync(args.create[0], 'utf8'));
      } catch (ex) {
        console.log('Invalid search definition: ', ex);
      }

      searchDef = as_array(searchDef);

      const res = await this.http.post(
        '/searches',
        JSON.stringify(searchDef),
        {},
        this.config,
      );
      this.print('Saved search(s) created successfully.');
      return res;
    }
    const items = await this.http.get('/searches', undefined, this.config);
    this.show(items);
    return items;
  }

  /**
   * Return a list of tags in the library. Options to filter
   * and count tags. (API: /tags)
   */
  async tags(args) {
    this.reconfigure(args);

    let rawTags = null;
    if (args.filter) {
      rawTags = await this.all(`/ tags / ${encodeURIComponent(args.filter)} `);
    } else {
      rawTags = await this.all('/tags');
    }
    const tags = rawTags.map((tag) => tag.tag).sort();

    if (args.count) {
      const tag_counts: Record<string, number> = {};
      for (const tag of tags) {
        tag_counts[tag] = await this.count('/items', { tag });
      }
      this.print(tag_counts);
      return tag_counts;
    } else {
      this.show(tags);
      return tags;
    }
  }

  /**
   * Utility functions.
   */

  public async enclose_item_in_collection(args) {
    this.reconfigure(args);

    const output = [];
    if (!args.key) {
      return this.message(1, 'You must provide --key/args.key', args);
    }
    if (!args.collection) {
      args.collection = '';
    }

    const key = as_value(this.extractKeyAndSetGroup(args.key));
    const base_collection = as_value(
      this.extractKeyAndSetGroup(args.collection),
    );
    const group_id = args.group_id ? args.group_id : this.config.group_id;

    if (!group_id) {
      console.log(
        'ERROR ERROR ERROR - no group id in zotero->enclose_item_in_collection',
      );
    } else {
      console.log(
        `zotero -> enclose_item_in_collection: group_id ${group_id} `,
      );
    }

    const response = await this.item({ key: key, group_id: group_id });
    // console.log("response = " + JSON.stringify(response, null, 2))
    // TODO: Have automated test to see whether successful.
    output.push({ response1: response });
    if (!response) {
      console.log('1 - item not found - item does not exist');
      return this.message();
    }
    console.log('-->' + response.collections);
    const child_name = args.title
      ? args.title
      : (response.reportNumber ? response.reportNumber + '. ' : '') +
        response.title;
    // const new_coll = zotero.create_collection(group, base_collection, $name)
    // console.log("ch="+child_name)
    output.push({ child_name });

    // Everything below here should be done as Promise.all
    // This causes the problem.
    console.log('collections -- base', base_collection);
    const new_coll = await this.collections({
      group_id: group_id,
      key: as_value(base_collection),
      create_child: as_array(child_name),
    });

    output.push({ collection: new_coll });

    console.log('Move item to collection');
    const ecoll = as_array(new_coll[0].key);
    const res = await this.item({
      key,
      addtocollection: ecoll,
    });
    output.push({ response2: res });

    console.log('0-link');
    const link0 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${new_coll[0].key}`,
      title: '🆉View enclosing collection',
      tags: ['_r:enclosing_collection'],
    });
    output.push({ link: link0 });

    console.log('1-collections');
    const refcol_res = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅_References'],
    });
    output.push({ collection: refcol_res });

    console.log(`1-links: ${group_id}:${key}`);

    const refcol = refcol_res[0].key;
    const link1 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${refcol}`,
      title: '✅View collection with references.',
      tags: ['_r:viewRefs'],
    });
    output.push({ link: link1 });

    console.log('2-collection');
    const refcol_citing = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅Citing articles'],
    });
    output.push({ collection: refcol_citing });
    const citingcol = refcol_citing[0].key;
    console.log('2-link');
    const link2 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${citingcol}`,
      title: '✅View collection with citing articles (cited by).',
      tags: ['_r:viewCitedBy'],
    });
    output.push({ link: link2 });

    console.log('3-collection');
    const refcol_rem = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅Removed references'],
    });
    output.push({ collection: refcol_rem });
    const refremcol = refcol_rem[0].key;
    console.log('3-link');
    const link3 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${refremcol}`,
      title: '✅View collection with removed references.',
      tags: ['_r:viewRRemoved'],
    });
    output.push({ link: link3 });

    logger.info('Creating notes');
    // say "Creating note for item key. Note key: "
    // ERROR HERE: key is still an array.
    const key2 = this.extractKeyAndSetGroup(key);
    const note = await this.attachNoteToItem(key2, {
      // group_id,
      // key: key2,
      content: `<h1>Bibliography</h1><p>Updated: date</p><p>Do not edit this note manually.</p><p><b>bibliography://select/groups/${group_id}/collections/${refcol}</b></p>`,
      tags: ['_cites'],
    });
    output.push({ note });

    const response3 = await this.item({ key });
    output.push({ response3 });

    return this.message(0, 'Succes', output);
  }

  /**
   * Get the DOI of the item provided.
   * @param args
   * @param subparsers
   * @returns
   */
  public async get_doi(args) {
    this.reconfigure(args);
    // We dont know what kind of item this is - gotta get the item to see

    args.fullresponse = false;
    const item = await this.item(args);
    const doi = this.get_doi_from_item(item);
    console.log(`DOI: ${doi}, ${typeof doi}`);
    // ACTION: return values
    // doi = 'doi->' + doi;
    return doi;
  }

  public get_doi_from_item(item) {
    let doi = '';
    if ('doi' in item) {
      doi = item.doi;
    } else {
      item.extra.split('\n').forEach((element) => {
        var mymatch = element.match(/^DOI\:\s*(.*?)\s*$/);
        if (mymatch) {
          doi = mymatch[1];
        }
      });
    }
    return doi;
  }

  /**
   * Update the DOI of the item provided.
   */
  public async update_doi(args) {
    this.reconfigure(args);

    args.fullresponse = false;
    args.key = as_value(args.key);
    // We dont know what kind of item this is - gotta get the item to see
    const item = await this.item(args);
    const existingDOI = this.get_doi_from_item(item);
    if ('doi' in args || 'zenodoRecordID' in args) {
      let json = {};
      let update = false;
      let extra2 = '';
      if ('zenodoRecordID' in args) {
        // console.log("update_doi: " + `ZenodoArchiveID: ${args.zenodoRecordID}`)
        extra2 = `ZenodoArchiveID: ${args.zenodoRecordID}\n`;
        update = true;
      }
      // console.log("update_doi: " + `${args.doi} != ${existingDOI}`)
      if (args.doi != existingDOI) {
        update = true;
        if ('doi' in item) {
          json['doi'] = args.doi;
        } else {
          extra2 = `DOI: ${args.doi}\n` + extra2;
        }
      }
      if (extra2 != '') {
        update = true;
        json['extra'] = extra2 + item.extra;
      }
      // const extra = `DOI: ${args.doi}\n` + item.extra;
      if (update) {
        const updateargs = {
          key: args.key,
          version: item.version,
          json: json,
          fullresponse: false,
          show: true,
        };
        // ACTION: check arguments
        // ACTION: run code
        const update = await this.update_item(updateargs);
        if (update.statusCode == 204) {
          var today = new Date();
          if (args.doi != existingDOI) {
            const message = `Attached new DOI ${
              args.doi
            } on ${today.toLocaleDateString()}`;
            await this.attachNoteToItem(args.key, {
              content: message,
              tags: ['_r:message'],
            });
          }
          const zoteroRecord = await this.item({ key: args.key });
          if (args.verbose)
            console.log('Result=' + JSON.stringify(zoteroRecord, null, 2));
          return zoteroRecord;
        } else {
          console.log(
            'async update_doi - update failed',
            JSON.stringify(update, null, 2),
          );
          return this.message(1, 'async update_doi - update failed');
        }
      } else {
        console.log('async update_doi. No updates required.');
      }
    } else {
      return this.message(
        1,
        'async update_doi - update failed - no doi provided',
      );
    }
    // ACTION: return values
    // return 1
  }

  public async template(args) {
    this.reconfigure(args);

    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async attach_link(args) {
    this.reconfigure(args);

    // TODO: There's a problem here... the following just offer docorations. We need to have inputs too...

    // TODO: Make this consistent
    args.key = as_value(args.key);
    args.key = this.extractKeyAndSetGroup(args.key);
    args.title = as_value(args.title);
    const tags = [];
    if (args.tags) tags.push(args.tags);
    args.url = as_value(args.url);
    var dataout = [];
    if (args.zenodo) {
      let xdoi = await this.get_doi(args);
      xdoi = 'x' + xdoi;
      const mymatch = xdoi.match(/10.5281\/zenodo\.(\d+)/);
      const id = mymatch[1];
      // args.id = id
      args.id = id;
      console.log(`${id}, ${xdoi}, ${typeof xdoi}`);
    }
    // add links based on args.id
    if (args.id) {
      const id = args.id;
      const xargs = args;
      delete xargs.deposit, xargs.record, xargs.doi;
      const data1 = await this.attach_link({
        key: xargs.key,
        deposit: 'https://zenodo.org/deposit/' + id,
        record: 'https://zenodo.org/record/' + id,
        doi: 'https://doi.org/10.5281/zenodo.' + id,
      });
      dataout.push({ id_out: data1 });
    }
    // add links on keys in decoration
    const arr = Object.keys(decoration);
    for (const i in arr) {
      const option = arr[i];
      if (args[option]) {
        console.log(`Link: ${option} => ${args[option]}`);
        let title = as_value(decoration[option].title);
        let tags = decoration[option].tags;
        title = args.title ? title + ' ' + args.title : title;
        tags = args.tags ? tags.push(args.tags) : tags;
        const addkey = option === 'kerko_site_url' ? as_value(args.key) : '';
        // ACTION: run code
        const data = await this.attachLinkToItem(
          as_value(args.key),
          as_value(args[option]) + addkey,
          { title, tags },
        );
        dataout.push({
          decoration: option,
          data,
        });
      }
    }
    // Add link based on URL
    if (args.url) {
      const datau = await this.attachLinkToItem(
        as_value(args.key),
        as_value(args.url),
        { title: as_value(args.title), tags: args.tags },
      );
      dataout.push({ url_based: datau });
    }
    if (args.update_url_field) {
      if (args.url || args.kerko_site_url) {
        const argx = {
          key: as_value(args.key),
          value: as_value(args.url)
            ? as_value(args.url)
            : as_value(args.kerko_site_url)
            ? as_value(args.kerko_site_url) + as_value(args.key)
            : '',
        };
        const datau = await this.update_url(argx);

        dataout.push({ url_field: datau });
      } else {
        console.log(
          'You have to set url or kerko_url_key for update-url-field to work',
        );
      }
    }
    // ACTION: return values
    return this.message(0, 'exist status', dataout);
  }

  public async field(args) {
    this.reconfigure(args);
    // ACTION: define CLI interface

    if (!args.field) {
      console.log('args.field is required.');
      process.exit(1);
    }
    args.fullresponse = false;
    let thisversion = '';
    let item;
    if (args.version) {
      thisversion = as_value(args.version);
    } else {
      item = await this.item(args);
      thisversion = item.version;
    }
    // const item = this.pruneData(response)
    const myobj = {};
    if (args.value) {
      myobj[args.field] = as_value(args.value);
      const updateargs = {
        key: args.key,
        version: thisversion,
        json: myobj,
        fullresponse: false,
        show: true,
      };
      const update = await this.update_item(updateargs);
      if (update.statusCode == 204) {
        console.log('update successfull - getting record');
        const zoteroRecord = await this.item({ key: args.key });
        if (args.verbose)
          console.log('Result=' + JSON.stringify(zoteroRecord, null, 2));
        return zoteroRecord;
      } else {
        console.log('update failed');
        return this.message(1, 'update failed');
      }
    } else {
      console.log(item[args.field]);
      process.exit(1);
    }
    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async extra_append(args) {
    this.reconfigure(args);

    const data = {};
    return this.message(0, 'exit status', data);
  }

  public async update_url(args) {
    this.reconfigure(args);

    args.json = {
      url: args.value,
    };
    const update = await this.update_item(args);

    return update;
  }

  public async KerkoCiteItemAlsoKnownAs(args) {
    this.reconfigure(args);

    args.fullresponse = false;
    let thisversion = '';
    let item;
    item = await this.item(args);
    thisversion = item.version;

    var extra = item.extra;
    var extraarr = extra.split('\n');

    let kciaka = -1;
    let i = -1;
    for (const value of extraarr) {
      i++;
      console.log(value);
      if (value.match(/^KerkoCite\.ItemAlsoKnownAs\: /)) {
        // console.log(i)
        kciaka = i;
      }
    }
    if (kciaka == -1) {
      return this.message(0, 'item has no ItemAlsoKnownAs', { item });
    }

    console.log(extraarr[kciaka]);
    let do_update = false;
    if (args.add) {
      var kcarr = extraarr[kciaka].split(/\s+/).slice(1);
      args.add = as_array(args.add);
      const knew =
        'KerkoCite.ItemAlsoKnownAs: ' + _.union(kcarr, args.add).join(' ');
      // console.log(knew)
      // console.log(extraarr[kciaka])
      if (knew != extraarr[kciaka]) {
        do_update = true;
        console.log('Update');
        extraarr[kciaka] = knew;
        extra = extraarr.sort().join('\n');
      }
    }
    if (do_update) {
      console.log('\n----\n' + extra + '\n----\n');
      const myobj = {};
      myobj['extra'] = extra;
      const updateargs = {
        key: args.key,
        version: thisversion,
        json: myobj,
        fullresponse: false,
        show: true,
      };
      const update = await this.update_item(updateargs);
      let zoteroRecord;
      if (update.statusCode == 204) {
        console.log('update successfull - getting record');
        zoteroRecord = await this.item({ key: args.key });
        if (args.verbose)
          console.log('Result=' + JSON.stringify(zoteroRecord, null, 2));
      } else {
        console.log('update failed');
        return this.message(1, 'update failed', { update });
      }
      return this.message(0, 'exit status', {
        update,
        item: zoteroRecord,
      });
    } else {
      return this.message(0, 'exit status', { item });
    }
  }

  // TODO: Implement
  public async getbib(args) {
    this.reconfigure(args);

    let output;
    try {
      output = await this.getZoteroDataX(args);
    } catch (e) {
      return catchme(2, 'caught error in getZoteroDataX', e, null);
    }
    // ACTION: return values

    if (args.xml) {
      console.log(output.data);
      return output;
    } else {
      return { status: 0, message: 'success', data: output };
    }
  }

  /* START FUcntionS FOR GETBIB */
  async getZoteroDataX(args) {
    //console.log("Hello")
    var d = new Date();
    var n = d.getTime();
    // TODO: We need to check the groups of requested data against the groups the API key has access to.
    var fullresponse = { data: [], message: '' };
    // We could allow responses that have arg.keys/group as well as groupkeys.
    if (args.keys || args.key) {
      console.log('Response based on group and key(s)');
      fullresponse = await this.makeZoteroQuery(args);
    } else if (args.groupkeys) {
      console.log('Response based on groupkeys');
      fullresponse = await this.makeMultiQuery(args);
      // console.log("Done.");
    } else {
      fullresponse = { data: [], message: 'not implemented' };
    }

    const response = fullresponse.data;
    if (response) {
      var resp = [];
      try {
        resp = response.map(
          (element) =>
            element.bib
              .replace(
                /\((\d\d\d\d)\)/,
                '($1' +
                  element.data.tags
                    .filter((element) => element.tag.match(/_yl:/))
                    .map((element) => element.tag)
                    .join(',')
                    .replace(/_yl\:/, '') +
                  ')',
              )
              .replace('</div>\n</div>', '')
              .replace(/\.\s*$/, '')
              .replace(
                '<div class="csl-bib-body" style="line-height: 1.35; padding-left: 1em; text-indent:-1em;">',
                '<div class="csl-bib-body">',
              ) +
            '.' +
            getCanonicalURL(args, element) +
            (element.data.rights &&
            element.data.rights.match(/Creative Commons/)
              ? ' Available under ' + he.encode(element.data.rights) + '.'
              : '') +
            colophon(element.data.extra) +
            ' (' +
            urlify(
              'details',
              element.library.id,
              element.key,
              args.zgroup,
              args.zkey,
              args.openinzotero,
            ) +
            ')' +
            '</div>\n</div>',
        );
      } catch (e) {
        return catchme(2, 'caught error in response', e, response);
      }
      if (args.test) {
        var d = new Date();
        var n = (d.getTime() - n) / 1000;
        var output = [];
        const sortresp = resp.sort();
        for (const i in sortresp) {
          let lineresult = null;
          const xml = sortresp[i];
          try {
            const payload = convert.xml2json(xml, {
              compact: false,
              spaces: 4,
            });
            lineresult = { in: xml, error: {}, out: payload };
          } catch (e) {
            lineresult = {
              in: xml,
              error: e,
              out: {},
            };
          }
          output.push(lineresult);
        }
        return { status: 0, data: output };
      } else {
        var xml = '<div>\n' + resp.sort().join('\n') + '\n</div>';
        var d = new Date();
        var n = (d.getTime() - n) / 1000;
        var outputstr = '{}';
        if (args.json) {
          try {
            const payload = convert.xml2json(xml, {
              compact: false,
              spaces: 4,
            });
            outputstr =
              `{\n"status": 0,\n"count": ${response.length},\n"duration": ${n},\n"data": ` +
              payload +
              '\n}';
          } catch (e) {
            outputstr = catchme(2, 'caught error in convert.xml2json', e, xml);
          }
          return outputstr;
        } else {
          return { status: 0, data: xml };
        }
      }
    } else {
      var d = new Date();
      var n = (d.getTime() - n) / 1000;
      return JSON.stringify(
        {
          status: 1,
          message: isomessage('error: no response'),
          duration: n,
          data: fullresponse,
        },
        null,
        2,
      );
    }
    // return xml
  }

  async makeZoteroQuery(arg) {
    var response = [];
    console.log('hello');
    // The limit is 25 results at a time - so need to check that arg.keys is not too long.
    let allkeys = [];
    if (arg.key) {
      allkeys.push(arg.key);
    }
    console.log('hello');
    if (arg.keys) {
      const arr = as_value(arg.keys).split(',');
      allkeys.push(arr);
    }
    console.log(`allkeys ${allkeys}`);
    const keyarray = [];
    var temp = [];
    for (const index in allkeys) {
      temp.push(allkeys[index]);
      if (temp.length >= 25) {
        keyarray.push(temp);
        temp = [];
      }
    }
    if (temp.length > 0) {
      keyarray.push(temp);
    }
    for (const index in keyarray) {
      // console.log("keyarray=" + JSON.stringify(keyarray[index], null, 2))
      const resp = await this.item({
        group_id: arg.group,
        key: '',
        filter: {
          format: 'json',
          include: 'data,bib',
          style: 'apa-single-spaced',
          linkwrap: 1,
          itemKey: keyarray[index].join(','),
        },
      });
      // console.log("resp=" + JSON.stringify(resp, null, 2))

      if (Array.isArray(resp)) {
        response.push(...resp);
      } else {
        response.push(resp);
      }
    }
    if (!response || response.length == 0) {
      return { status: 1, message: 'error', data: [] };
    }
    return { status: 0, message: 'Success', data: response };
  }

  async makeMultiQuery(args) {
    // console.log("Multi query 1")
    let mykeys;
    try {
      args.groupkeys = as_value(args.groupkeys);
      mykeys = args.groupkeys.split(',');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
    var a = {};
    try {
      mykeys.forEach((x) => {
        const gk = x.split(':');
        if (a[gk[0]]) {
          a[gk[0]].push(gk[1]);
        } else {
          a[gk[0]] = [gk[1]];
        }
      });
    } catch (e) {
      console.log(e);
    }
    // console.log("Multi query 2")
    var b = [];
    var errors = [];
    var zotgroup;
    var zotkeys;
    for ([zotgroup, zotkeys] of Object.entries(a)) {
      const zargs = {
        group: zotgroup,
        keys: zotkeys.join(','),
      };
      const response = await this.makeZoteroQuery(zargs);
      if (response.status == 0) {
        if (Array.isArray(response.data)) {
          b.push(...response.data);
        } else {
          b.push(response.data);
        }
      } else {
        console.log('ERROR');
        errors.push({ error: 'Failure to retrieve data', ...zargs });
      }
    }
    // console.log("Multi query 3")

    const output = { status: 0, message: 'Success', data: b, errors };
    return output;
  }

  /* END FUcntionS FOR GETBIB */

  // TODO: Implement
  public async attach_note(args) {
    this.reconfigure(args);

    args.notetext = as_value(args.notetext);
    args.key = this.extractKeyAndSetGroup(as_value(args.key));
    // console.log(args.key)
    // process.exit(1)
    // TODO: Read from --file
    // ACTION: run code
    const notefiletext = args.notefile ? fs.readFileSync(args.notefile) : '';
    const data = await this.attachNoteToItem(args.key, {
      content: args.notetext + notefiletext,
      tags: args.tags,
    });
    // ACTION: return values
    return this.message(0, 'exit status', data);
  }

  // TODO: Implement
  public async getValue(args) {
    this.reconfigure(args);

    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async collectionName(args) {
    this.reconfigure(args);

    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async amendCollection(args) {
    this.reconfigure(args);

    const data = {};
    return this.message(0, 'exit status', data);
  }
}

export = Zotero;
