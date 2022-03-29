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
import decorations from './decorations';
import { readConfigFile } from './readConfigFile';
import md5File from './utils/md5-file';
import {
  fetchCurrentKey,
  fetchGroupData,
  fetchGroups,
  fetchItemsByIds,
  getChangedItemsForGroup,
} from './local-db/api';
import { getAllGroups, saveGroup, saveZoteroItems } from './local-db/db';
import printJSON from './utils/printJSON';

require('dotenv').config();

const _ = require('lodash');
const he = require('he');
const convert = require('xml-js');

const fs = require('fs');
const path = require('path');
const LinkHeader = require('http-link-header');

const ajv = new Ajv();

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

  //TODO: config
  public configure(args, shouldReadConfigFile = false) {
    // pick up config: The function reads args and populates config

    let config = {};

    // STEP 1. Read config file
    if (shouldReadConfigFile || args.config) {
      config = readConfigFile(args);
    }

    // STEP 2. Apply --config_json option
    if (args.config_json) {
      let configObject = args.config_json;

      if (typeof args.config_json === 'string') {
        configObject = JSON.parse(args.config_json);
      }

      //TODO: is it intended way to merge???
      config = { ...config, ...configObject };
    }

    const result = this.canonicalConfig(config, args);

    if (args.verbose) {
      logger.info('config=' + JSON.stringify(result, null, 2));
    }

    // Check that not both are undefined:
    if (!result.user_id && !result.group_id) {
      logger.info('result: ', result);
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

  //TODO: config
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
    logger.info('showConfig=' + JSON.stringify(this.config, null, 2));
    return this.config;
  }

  private message(stat = 0, msg = 'None', data = null) {
    return {
      status: stat,
      message: msg,
      data,
    };
  }

  private finalActions(output) {
    // logger.info("args="+JSON.stringify(args))
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
      logger.info(args);
      return;
    }

    this.output +=
      args
        .map((m) => {
          return this.formatMessage(m);
        })
        .join(' ') + '\n';
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
        logger.info('Error in all: ' + error);
      });

    let data = chunk.body;

    let link =
      chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
    while (link && link.length && link[0].uri) {
      if (chunk.headers.backoff) {
        await sleep(parseInt(chunk.headers.backoff) * 1000);
      }

      chunk = await this.http
        .get(
          link[0].uri,
          {
            fulluri: true,
            resolveWithFullResponse: true,
            params,
          },
          this.config,
        )
        .catch((error) => {
          logger.info('Error in all: ' + error);
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
    const res = await this.http.post(args.uri, args.data, {}, this.config);
    this.print(res);
    return res;
  }

  /**
   * Make a direct query to the API using
   * 'PUT uri [--data data]'.
   */
  public async __put(args) {
    const res = await this.http.put(args.uri, args.data, this.config);
    this.print(res);
    return res;
  }

  /**
   * Make a direct query to the API using
   * 'PATCH uri [--data data]'.
   */
  public async __patch(args) {
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
    const output = [];
    for (const uri of args.uri) {
      const response = await this.http.get(uri, undefined, this.config);
      const deleteResponse = await this.http.delete(
        uri,
        response.version,
        this.config,
      );
      output.push(deleteResponse);
    }
    return output;
  }

  /**
   * Show details about this API key.
   * (API: /keys )
   */
  public async key(args) {
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
        logger.info(`Number of groups: ${res2.length}`);
        const res3 = [...res2].sort((a, b) => {
          if (a.data.name > b.data.name) {
            return 1;
          } else if (b.data.name > a.data.name) {
            return -1;
          }
          return 0;
        });

        res3.forEach((element) => {
          const data = element.data;
          logger.info(`${data.id}\t${data.name} ${data.owner} ${data.type}`);
        });
      } else {
        this.show(res2);
      }
      if (res2.length > 100) {
        logger.info(`Warning - only first 100 retrieved. ${res2.length}`);
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
    if (typeof v === 'string') {
      this.print(v);
      return;
    }

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
    }

    let out = undefined;
    key = key.toString();
    const res = key.match(
      /^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/,
    );

    if (res) {
      // logger.info("extractKeyGroupVariable -> res=" + JSON.stringify(res, null, 2))
      if (res[2] === 'library') {
        logger.info(
          'You cannot specify zotero-select links (zotero://...) to select user libraries.',
        );
        return null;
      }
      // logger.info("Key: zotero://-key provided for "+res[2]+" Setting group-id.")
      this.config.group_id = res[1];
      out = res[n];
    }

    if (!res) {
      // There wasn't a match. We might have a group, or a key.
      if (key.match(/^([A-Z01-9]+)/)) {
        if ((n === 1 && key.match(/^([01-9]+)/)) || n === 3) {
          // Group requested
          // This is slightly ropy - presumably a zotero item key could just be numbers?
          // item requested - this is ok, because we wouldn't expect a group to go in as sole argument
          out = key;
        }
      }
    }
    return out;
  }

  // TODO: args parsing code
  private extractKeyAndSetGroup(key) {
    // logger.info("extractKeyAndSetGroup")
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
    logger.info('Linktitle=' + options.title);
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
    // TODO: args parsing code
    if (args.key) {
      args.key = this.extractKeyAndSetGroup(as_value(args.key));
    }

    // TODO: args parsing code
    // 'Unable to extract group/key from the string provided.',
    if (!args.key && !args.top) {
      return this.message(0, 'You should specify key or --top.');
    }

    // TODO: args parsing code
    args.create_child = as_array(args.create_child);

    if (args.create_child) {
      let response;
      if (args.key) {
        logger.info('args.key=>args.create_child');
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
        logger.info('(top)=>args.create_child');
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
      logger.info('response=' + JSON.stringify(resp, null, 2));
      if (resp.successful) {
        this.print('Collections created: ', resp.successful);
        logger.info('collection....done');
        return resp.successful;
      } else {
        logger.info('collection....failed');
        logger.info('response=' + JSON.stringify(resp, null, 2));
        return resp;
      }
      // TODO: In all functions where data is returned, add '.successful' - Zotero always wraps in that.
      // This leaves an array.
    } else {
      logger.info('get...');
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
        logger.info('test');
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
    // TODO: args parsing code
    if (args.key) {
      args.key = this.extractKeyAndSetGroup(args.key);
    } else {
      return this.message(
        0,
        'Unable to extract group/key from the string provided.',
      );
    }

    // TODO: args parsing code
    if (args.tags && args.add) {
      return this.message(0, '--tags cannot be combined with --add');
    }
    // TODO: args parsing code
    if (args.tags && args.remove) {
      return this.message(0, '--tags cannot be combined with --remove');
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
    //
    let items;
    // TODO: args parsing code
    if (typeof args.filter === 'string') {
      args.filter = JSON.parse(args.filter);
    }

    // TODO: args parsing code
    if (args.count && args.validate) {
      return this.message(0, '--count cannot be combined with --validate');
    }

    // TODO: args parsing code
    if (args.collection) {
      args.collection = this.extractKeyAndSetGroup(args.collection);
      if (!args.collection) {
        return this.message(
          0,
          'Unable to extract group/key from the string provided.',
        );
      }
    }

    // TODO: args parsing code
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

    // TODO: args parsing code
    const params = args.filter || {};

    if (args.top) {
      // This should be all - there may be more than 100 items.
      // items = await this.all(`${collection}/items/top`, { params })
      items = await this.all(`${collection}/items/top`, params);
    } else if (params.limit) {
      if (params.limit > 100) {
        return this.message(
          0,
          'You can only retrieve up to 100 items with with params.limit.',
        );
      }
      // logger.info("get-----")
      items = await this.http.get(
        `${collection}/items`,
        { params },
        this.config,
      );
    } else {
      // logger.info("all-----")
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
      else {
        schema_path = args.validate_with;
      }
    } else {
      if (!fs.existsSync(this.config.zotero_schema))
        throw new Error(
          `You have asked for validation, but '${this.config.zotero_schema}' does not exist`,
        );
      else {
        schema_path = this.config.zotero_schema;
      }
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
        logger.info(`item ok! ${item.key}`);
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
    const output = [];

    // TODO: args parsing code
    const my_key = this.extractKeyAndSetGroup(args.key);
    args.key = my_key;
    // TODO: Need to implement filter as a command line option --filter="{...}"
    if (!args.key && !(args.filter && args.filter.itemKey)) {
      return this.message(
        0,
        'Unable to extract group/key from the string provided.',
      );
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
            .filter((i) => i.data.itemType === 'attachment')
            .map(async (child) => {
              if (child.data.filename) {
                logger.info(`Downloading file ${child.data.filename}`);
                // TODO: Is 'binary' correct?
                fs.writeFileSync(
                  child.data.filename,
                  await this.http.get(
                    `/items/${child.key}/file`,
                    undefined,
                    this.config,
                  ),
                  'binary',
                );

                // checking md5, if it doesn't match we throw an error
                const downloadedFilesMD5 = md5File(child.data.filename);
                if (child.data.md5 !== downloadedFilesMD5) {
                  throw new Error("The md5 doesn't match for downloaded file");
                }
              } else {
                logger.info(
                  `Not downloading file ${child.key}/${child.data.itemType}/${child.data.linkMode}/${child.data.title}`,
                );
              }
            }),
        );
      }

      //TODO: extract UploadItem class
      if (args.addfiles) {
        logger.info('Adding files...');

        // get attachment template
        const attachmentTemplate = await this.http.get(
          '/items/new?itemType=attachment&linkMode=imported_file',
          { userOrGroupPrefix: false },
          this.config,
        );

        // try to upload each file
        for (const filename of args.addfiles) {
          if (args.debug) logger.info('Adding file: ' + filename);
          if (!fs.existsSync(filename)) {
            return this.message(0, `Ignoring non-existing file: ${filename}.`);
          }

          // create an upload file using attachment template
          const attachmentFileData = { ...attachmentTemplate };
          attachmentFileData.title = path.basename(filename);
          attachmentFileData.filename = path.basename(filename);
          attachmentFileData.contentType = `application/${path
            .extname(filename)
            .slice(1)}`;
          attachmentFileData.parentItem = args.key;

          const stat = fs.statSync(filename);

          // upload file using attachment template
          const uploadItem = await this.http.post(
            '/items',
            JSON.stringify([attachmentFileData]),
            {},
            this.config,
          );
          const uploadAuthorization = await this.http.post(
            `/items/${uploadItem.successful[0].key}/file?md5=${md5File(
              filename,
            )}&filename=${attachmentFileData.filename}&filesize=${
              fs.statSync(filename)['size']
            }&mtime=${stat.mtimeMs}`,
            '{}',
            { 'If-None-Match': '*' },
            this.config,
          );

          let request_post = null;
          if (uploadAuthorization.exists !== 1) {
            const uploadResponse = await this.http
              .post(
                uploadAuthorization.url,
                Buffer.concat([
                  Buffer.from(uploadAuthorization.prefix),
                  fs.readFileSync(filename),
                  Buffer.from(uploadAuthorization.suffix),
                ]),
                { 'Content-Type': uploadAuthorization.contentType },
                this.config,
              )
              .then((res) => res.data);
            if (args.verbose) {
              logger.info('uploadResponse=');
              this.show(uploadResponse);
            }
            request_post = await this.http.post(
              `/items/${uploadItem.successful[0].key}/file?upload=${uploadAuthorization.uploadKey}`,
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
      logger.info('children');
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

    this.output = JSON.stringify(output);

    if (args.show)
      logger.info('item -> resul=' + JSON.stringify(result, null, 2));

    const finalactions = this.finalActions(result);
    return args.fullresponse
      ? {
          status: 0,
          message: 'success',
          output,
          result,
          final: finalactions,
        }
      : result;
    // TODO: What if this fails? Zotero will return, e.g.   "message": "404 - {\"type\":\"Buffer\",\"data\":[78,111,116,32,102,111,117,110,100]}",
    // logger.info(Buffer.from(obj.data).toString())
    // Need to return a proper message.
  }

  /**
   * Retrieve/save file attachments for the item specified with --key KEY
   * (API: /items/KEY/file).
   * Also see 'item', which has options for adding/saving file attachments.
   */
  async attachment(args) {
    if (args.key) {
      //TODO: args parsing code
      args.key = this.extractKeyAndSetGroup(args.key);
      if (!args.key) {
        return this.message(
          0,
          'Unable to extract group/key from the string provided.',
        );
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
   *
   * see api docs for creating
   * [single item](https://www.zotero.org/support/dev/web_api/v3/write_requests#_an_item) OR
   * [multiple items](https://www.zotero.org/support/dev/web_api/v3/write_requests#creating_multiple_items)
   */
  public async create_item(args) {
    //

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
      // logger.info("/"+result+"/")
      return result;
    }

    if (Array.isArray(args.files) && args.files.length > 0) {
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
            logger.error(`Uploading objects ${start} to ${end}-1`);
            logger.info(`Uploading objects ${start} to ${end}-1`);
            logger.info(`${itemsflat.slice(start, end).length}`);
            const result = await this.http.post(
              '/items',
              JSON.stringify(itemsflat.slice(start, end)),
              {},
              this.config,
            );
            res.push(result);
          } else {
            logger.error(`NOT Uploading objects ${start} to ${end}-1`);
            logger.info(`NOT Uploading objects ${start} to ${end}-1`);
            logger.info(`${itemsflat.slice(start, end).length}`);
          }
        }
      }
      // TODO: see how to use pruneData
      return res;
    }

    if ('items' in args) {
      logger.info('args.items = ', args.items);
      let items = args.items;

      if (Array.isArray(args.items) && args.items.length > 0) {
        items = items.map((item) =>
          typeof item === 'string' ? JSON.parse(item) : item,
        );
        items = JSON.stringify(items);
      }

      if (items.length > 0) {
        const result = await this.http.post('/items', items, {}, this.config);
        const res = result;
        this.show(res);
        return this.pruneData(res, args.fullresponse);
      }
      return { type: 'success', message: 'No items to create' };
    }

    if (args.item) {
      let item =
        typeof args.item === 'string' ? JSON.parse(args.item) : args.item;
      let items = JSON.stringify([item]);

      const result = await this.http.post('/items', items, {}, this.config);
      this.show(result);
      return this.pruneData(result, args.fullresponse);
    }
  }

  public pruneData(res, fullresponse = false) {
    if (fullresponse) return res;
    return res.successful['0'].data;
  }

  /**
   * Update/replace an item with given key (--key KEY),
   * either update the item (API: patch /items/KEY)
   * or replace (using --replace, API: put /items/KEY).
   *
   * [see api docs](https://www.zotero.org/support/dev/web_api/v3/write_requests#updating_an_existing_item)
   */
  public async update_item(args) {
    //TODO: args parsing code
    args.replace = args.replace || false;

    //TODO: args parsing code
    if (args.file && args.json) {
      return this.message(0, 'You cannot specify both file and json.', args);
    }
    //TODO: args parsing code
    if (!args.file && !args.json) {
      return this.message(0, 'You must specify either file or json.', args);
    }

    //TODO: args parsing code
    if (args.key) {
      args.key = this.extractKeyAndSetGroup(args.key);
    } else {
      const msg = this.message(
        0,
        'Unable to extract group/key from the string provided. Arguments attached.',
        args,
      );
      logger.info(msg);
    }

    let originalItemVersion = 0;
    //TODO: args parsing code
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

    let data = '';
    //TODO: args parsing code
    if (args.json) {
      args.json = as_value(args.json);
      if (typeof args.json !== 'string') {
        data = JSON.stringify(args.json);
      } else {
        data = args.json;
      }
    } else if (args.file) {
      //TODO: args parsing code
      args.file = as_value(args.file);
      data = fs.readFileSync(args.file);
    }

    let result;

    if (args.replace) {
      result = await this.http.put(`/items/${args.key}`, data, this.config);
    } else {
      result = await this.http.patch(
        `/items/${args.key}`,
        data,
        originalItemVersion,
        this.config,
      );
    }

    return result;
  }

  // <userOrGroupPrefix>/items/trash Items in the trash
  /** Return a list of items in the trash. */
  // async trash(args) {
  //
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
    if (args.create) {
      let searchDef = [];
      try {
        searchDef = JSON.parse(fs.readFileSync(args.create[0], 'utf8'));
      } catch (ex) {
        logger.info('Invalid search definition: ', ex);
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
    const output = [];
    //TODO: args parsing code
    if (!args.key) {
      return this.message(1, 'You must provide --key/args.key', args);
    }

    //TODO: args parsing code
    if (!args.collection) {
      args.collection = '';
    }

    //TODO: args parsing code
    const key = as_value(this.extractKeyAndSetGroup(args.key));

    //TODO: args parsing code
    const base_collection = as_value(
      this.extractKeyAndSetGroup(args.collection),
    );
    //TODO: args parsing code
    const group_id = args.group_id ? args.group_id : this.config.group_id;

    //TODO: args parsing code
    if (!group_id) {
      logger.info(
        'ERROR ERROR ERROR - no group id in zotero->enclose_item_in_collection',
      );
    } else {
      logger.info(
        `zotero -> enclose_item_in_collection: group_id ${group_id} `,
      );
    }

    const response = await this.item({ key: key, group_id: group_id });
    // logger.info("response = " + JSON.stringify(response, null, 2))
    // TODO: Have automated test to see whether successful.
    output.push({ response1: response });
    if (!response) {
      logger.info('1 - item not found - item does not exist');
      return this.message();
    }
    logger.info('-->' + response.collections);
    const title = response.reportNumber ? response.reportNumber + '. ' : '';
    const child_name = args.title ? args.title : title + response.title;

    output.push({ child_name });

    // Everything below here should be done as Promise.all
    // This causes the problem.
    logger.info('collections -- base', base_collection);
    const new_coll = await this.collections({
      group_id: group_id,
      key: as_value(base_collection),
      create_child: as_array(child_name),
    });

    output.push({ collection: new_coll });

    logger.info('Move item to collection');
    const ecoll = as_array(new_coll[0].key);
    const res = await this.item({
      key,
      addtocollection: ecoll,
    });
    output.push({ response2: res });

    logger.info('0-link');
    const link0 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${new_coll[0].key}`,
      title: '🆉View enclosing collection',
      tags: ['_r:enclosing_collection'],
    });
    output.push({ link: link0 });

    logger.info('1-collections');
    const refcol_res = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅_References'],
    });
    output.push({ collection: refcol_res });

    logger.info(`1-links: ${group_id}:${key}`);

    const refcol = refcol_res[0].key;
    const link1 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${refcol}`,
      title: '✅View collection with references.',
      tags: ['_r:viewRefs'],
    });
    output.push({ link: link1 });

    logger.info('2-collection');
    const refcol_citing = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅Citing articles'],
    });
    output.push({ collection: refcol_citing });
    const citingcol = refcol_citing[0].key;
    logger.info('2-link');
    const link2 = await this.attach_link({
      group_id,
      key,
      url: `zotero://select/groups/${group_id}/collections/${citingcol}`,
      title: '✅View collection with citing articles (cited by).',
      tags: ['_r:viewCitedBy'],
    });
    output.push({ link: link2 });

    logger.info('3-collection');
    const refcol_rem = await this.collections({
      group_id,
      key: ecoll,
      create_child: ['✅Removed references'],
    });
    output.push({ collection: refcol_rem });
    const refremcol = refcol_rem[0].key;
    logger.info('3-link');
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
    // We dont know what kind of item this is - gotta get the item to see

    args.fullresponse = false;
    const item = await this.item(args);
    const doi = this.get_doi_from_item(item);
    logger.info(`DOI: ${doi}, ${typeof doi}`);
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

  public async manageLocalDB(args) {
    console.log('args: ', { ...args }, this.config);

    if (args.import_json) {
      console.log('importing json from file: ', args.import_json);
    } else {
      console.log('skipping importing json');
    }

    if (args.sync) {
      console.log('syncing local db with online library');

      // perform key check i.e. do we have valid key and we'll also get userId as a bonus
      const keyCheck = await fetchCurrentKey(this.config);
      //TODO: here we can perform extra check that the key is still valid and has access to groups
      const { userID } = keyCheck;

      args.user_id = userID;

      // fetch groups version and check which are changed
      const onlineGroups = await fetchGroups({ ...args, ...this.config });
      console.log('online groups: ', onlineGroups);

      const offlineGroups = await getAllGroups({ ...args, ...this.config });
      console.log('offline groups: ', offlineGroups);

      const offlineItemsVersion = offlineGroups.reduce(
        (a, c) => ({ ...a, [c.id]: c.itemsVersion }),
        {},
      );

      function getChangedGroups(online, local) {
        const localGroupsMap = local.reduce(
          (a, c) => ({ ...a, [c.id]: c.version }),
          {},
        );

        let res = [];

        for (let group in online) {
          if (online[group] !== localGroupsMap[group]) {
            res.push(group);
          }
        }

        return res;
      }

      const changedGroups = getChangedGroups(onlineGroups, offlineGroups);

      if (changedGroups.length === 0) {
        console.log('found no changed group, so not fetch group data');
      } else {
        console.log('changed group count: ', changedGroups.length);
        console.log('changed  groups: ', changedGroups);
        let allChangedGroupsData = await Promise.all(
          changedGroups.map((changedGroup) =>
            fetchGroupData({ ...args, ...this.config, group_id: changedGroup }),
          ),
        );
        // console.log('allChangedGroupsData: ', printJSON(allChangedGroupsData));

        const savedChangedGroups = await Promise.all(
          allChangedGroupsData.map((groupData) =>
            saveGroup({ database: args.database, group: groupData }),
          ),
        );
        console.log('savedChangedGroups: ', printJSON(savedChangedGroups));
      }

      const changedGroupsArray = Object.keys(onlineGroups);
      //TODO: push local changes

      // get remote changes
      const changedItemsForGroups = await Promise.all(
        changedGroupsArray.map((group) =>
          getChangedItemsForGroup({
            ...args,
            ...this.config,
            group,
            version: offlineItemsVersion[group],
          }),
        ),
      );

      const totalToBeSynced = changedItemsForGroups.reduce(
        (a, c) => a + Object.keys(c).length,
        0,
      );
      // console.log('changed items for groups: ', changedItemsForGroups);
      console.log('Total items to be synced: ', totalToBeSynced);
      if (totalToBeSynced > 0) {
        // convert id: version map to array of ids, chuncked by 50 items max
        const chunckedItemsByGroup = changedItemsForGroups.map(
          (item, index) => ({
            group: changedGroupsArray[index],
            itemIds: _.chunk(Object.keys(item), 50),
          }),
        );

        // console.log('chuncked items by group: ', printJSON(chunckedItemsByGroup));

        const itemsLastModifiedVersion = {};
        // for each group fetch all items with given ids, in batch of 50
        const allFetchedItems = await Promise.all(
          chunckedItemsByGroup.flatMap(({ group, itemIds }) =>
            Promise.all(
              itemIds.map((chunk) =>
                fetchItemsByIds({
                  ...args,
                  ...this.config,
                  itemIds: chunk,
                  group,
                }).then((res) => {
                  itemsLastModifiedVersion[group] =
                    res.headers['last-modified-version'];
                  return res.data;
                }),
              ),
            ),
          ),
        );

        if (allFetchedItems.length) {
          console.log('itemsVersion: ', itemsLastModifiedVersion);
          // console.log('allfetchedItems: ', printJSON(allFetchedItems));
          saveZoteroItems({
            allFetchedItems,
            database: args.database,
            lastModifiedVersion: itemsLastModifiedVersion,
          });
        }
      } else {
        console.log('Everything already synced!!! Hurray!!!');
      }
    } else {
      console.log('skipping syncing with online library');
    }

    if (args.export_json) {
      console.log('importing json from file: ', args.export_json);
    } else {
      console.log('skipping exporting json');
    }
  }

  /**
   * Update the DOI of the item provided.
   */
  public async update_doi(args) {
    //TODO: args parsing code
    args.fullresponse = false;
    //TODO: args parsing code
    args.key = as_value(args.key);
    // We dont know what kind of item this is - gotta get the item to see
    const item = await this.item(args);
    const existingDOI = this.get_doi_from_item(item) || '';
    if ('doi' in args || 'zenodoRecordID' in args) {
      let json = {};
      let update = false;
      let extra2 = '';
      if ('zenodoRecordID' in args) {
        // logger.info("update_doi: " + `ZenodoArchiveID: ${args.zenodoRecordID}`)
        extra2 = `ZenodoArchiveID: ${args.zenodoRecordID}\n`;
        update = true;
      }
      // logger.info("update_doi: " + `${args.doi} != ${existingDOI}`)
      //TODO: args parsing code
      args.doi = args.doi || '';
      if (args.doi !== existingDOI) {
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

      if (update) {
        const updateargs = {
          key: args.key,
          version: item.version,
          json: json,
          fullresponse: false,
          show: true,
        };

        const updatedItem = await this.update_item(updateargs);
        if (updatedItem.statusCode == 204) {
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
            logger.info('Result=' + JSON.stringify(zoteroRecord, null, 2));
          return zoteroRecord;
        } else {
          logger.info(
            'async update_doi - update failed',
            JSON.stringify(updatedItem, null, 2),
          );
          return this.message(1, 'async update_doi - update failed');
        }
      } else {
        logger.info('async update_doi. No updates required.');
      }
    } else {
      return this.message(
        1,
        'async update_doi - update failed - no doi provided',
      );
    }
  }

  public async TEMPLATE(args) {
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async attach_link(args) {
    // TODO: There's a problem here... the following just offer docorations. We need to have inputs too...

    // TODO: Make this consistent
    //TODO: args parsing code
    args.key = as_value(args.key);
    //TODO: args parsing code
    args.key = this.extractKeyAndSetGroup(args.key);
    //TODO: args parsing code
    args.title = as_value(args.title);

    args.url = as_value(args.url);
    var dataout = [];
    if (args.zenodo) {
      let xdoi = await this.get_doi(args);
      xdoi = 'x' + xdoi;
      const mymatch = xdoi.match(/10.5281\/zenodo\.(\d+)/);
      const id = mymatch[1];
      // args.id = id
      args.id = id;
      logger.info(`${id}, ${xdoi}, ${typeof xdoi}`);
    }
    // add links based on args.id
    if (args.id) {
      const id = args.id;
      const xargs = { ...args };

      delete xargs.deposit;
      delete xargs.record;
      delete xargs.doi;

      const data1 = await this.attach_link({
        key: xargs.key,
        deposit: 'https://zenodo.org/deposit/' + id,
        record: 'https://zenodo.org/record/' + id,
        doi: 'https://doi.org/10.5281/zenodo.' + id,
      });
      dataout.push({ id_out: data1 });
    }
    // add links on keys in decoration
    const arr = Object.keys(decorations);
    for (const i in arr) {
      const option = arr[i];
      if (args[option]) {
        logger.info(`Link: ${option} => ${args[option]}`);
        let title = as_value(decorations[option].title);
        let tags = decorations[option].tags;
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
      //TODO: args parsing code
      const datau = await this.attachLinkToItem(
        as_value(args.key),
        as_value(args.url),
        { title: as_value(args.title), tags: args.tags },
      );
      dataout.push({ url_based: datau });
    }
    if (args.update_url_field) {
      if (args.url || args.kerko_site_url) {
        const kerkoUrl = as_value(args.kerko_site_url)
          ? as_value(args.kerko_site_url) + as_value(args.key)
          : '';
        //TODO: args parsing code
        const argx = {
          key: as_value(args.key),
          value: as_value(args.url) ? as_value(args.url) : kerkoUrl,
        };
        const datau = await this.update_url(argx);

        dataout.push({ url_field: datau });
      } else {
        logger.info(
          'You have to set url or kerko_url_key for update-url-field to work',
        );
      }
    }

    return this.message(0, 'exist status', dataout);
  }

  public async field(args) {
    //TODO: args parsing code
    if (!args.field) {
      logger.info('args.field is required.');
      process.exit(1);
    }
    args.fullresponse = false;
    let thisversion = '';
    let item;
    if (args.version) {
      //TODO: args parsing code
      thisversion = as_value(args.version);
    } else {
      item = await this.item(args);
      thisversion = item.version;
    }
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
        logger.info('update successfull - getting record');
        const zoteroRecord = await this.item({ key: args.key });
        if (args.verbose)
          logger.info('Result=' + JSON.stringify(zoteroRecord, null, 2));
        return zoteroRecord;
      } else {
        logger.info('update failed');
        return this.message(1, 'update failed');
      }
    } else {
      logger.info(item[args.field]);
      process.exit(1);
    }
    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async extra_append(args) {
    const data = {};
    return this.message(0, 'exit status', data);
  }

  public async update_url(args) {
    //TODO: args parsing code
    args.json = {
      url: args.value,
    };
    return this.update_item(args);
  }

  public async KerkoCiteItemAlsoKnownAs(args) {
    //TODO: args parsing code
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
      logger.info(value);
      if (value.match(/^KerkoCite\.ItemAlsoKnownAs\: /)) {
        // logger.info(i)
        kciaka = i;
      }
    }
    if (kciaka == -1) {
      return this.message(0, 'item has no ItemAlsoKnownAs', { item });
    }

    logger.info(extraarr[kciaka]);
    let do_update = false;
    if (args.add) {
      var kcarr = extraarr[kciaka].split(/\s+/).slice(1);
      args.add = as_array(args.add);
      const knew =
        'KerkoCite.ItemAlsoKnownAs: ' + _.union(kcarr, args.add).join(' ');
      if (knew != extraarr[kciaka]) {
        do_update = true;
        logger.info('Update');
        extraarr[kciaka] = knew;
        extra = extraarr.sort().join('\n');
      }
    }
    if (do_update) {
      logger.info('\n----\n' + extra + '\n----\n');
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
        logger.info('update successfull - getting record');
        zoteroRecord = await this.item({ key: args.key });
        if (args.verbose)
          logger.info('Result=' + JSON.stringify(zoteroRecord, null, 2));
      } else {
        logger.info('update failed');
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
    let output;
    try {
      output = await this.getZoteroDataX(args);
    } catch (e) {
      return catchme(2, 'caught error in getZoteroDataX', e, null);
    }

    if (args.xml) {
      logger.info(output.data);
      return output;
    } else {
      return { status: 0, message: 'success', data: output };
    }
  }

  /* START FUcntionS FOR GETBIB */
  async getZoteroDataX(args) {
    //logger.info("Hello")
    let d = new Date();
    let n = d.getTime();
    // TODO: We need to check the groups of requested data against the groups the API key has access to.
    let fullresponse;
    // We could allow responses that have arg.keys/group as well as groupkeys.
    if (args.keys || args.key) {
      logger.info('Response based on group and key(s)');
      fullresponse = await this.makeZoteroQuery(args);
    } else if (args.groupkeys) {
      logger.info('Response based on groupkeys');
      fullresponse = await this.makeMultiQuery(args);
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
                    .filter((i) => i.tag.match(/_yl:/))
                    .map((item) => item.tag)
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
        let output = [];
        const sortresp = [...resp].sort();
        for (const i in sortresp) {
          let lineresult = null;
          const xmlStr = sortresp[i];
          try {
            const payload = convert.xml2json(xmlStr, {
              compact: false,
              spaces: 4,
            });
            lineresult = { in: xmlStr, error: {}, out: payload };
          } catch (e) {
            lineresult = {
              in: xmlStr,
              error: e,
              out: {},
            };
          }
          output.push(lineresult);
        }
        return { status: 0, data: output };
      } else {
        let xml = '<div>\n' + [...resp].sort().join('\n') + '\n</div>';
        let innerN = (d.getTime() - n) / 1000;
        let outputstr;
        if (args.json) {
          try {
            const payload = convert.xml2json(xml, {
              compact: false,
              spaces: 4,
            });
            outputstr =
              `{\n"status": 0,\n"count": ${response.length},\n"duration": ${innerN},\n"data": ` +
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
      let date = new Date();
      let innerN = (date.getTime() - n) / 1000;
      return JSON.stringify(
        {
          status: 1,
          message: isomessage('error: no response'),
          duration: innerN,
          data: fullresponse,
        },
        null,
        2,
      );
    }
  }

  async makeZoteroQuery(arg) {
    var response = [];
    logger.info('hello');
    // The limit is 25 results at a time - so need to check that arg.keys is not too long.
    let allkeys = [];
    if (arg.key) {
      allkeys.push(arg.key);
    }
    logger.info('hello');
    if (arg.keys) {
      const arr = as_value(arg.keys).split(',');
      allkeys.push(arr);
    }
    logger.info(`allkeys ${allkeys}`);
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
      // logger.info("keyarray=" + JSON.stringify(keyarray[index], null, 2))
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
      // logger.info("resp=" + JSON.stringify(resp, null, 2))

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
    // logger.info("Multi query 1")
    let mykeys;
    try {
      //TODO: args parsing code
      args.groupkeys = as_value(args.groupkeys);
      mykeys = args.groupkeys.split(',');
    } catch (e) {
      logger.info(e);
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
      logger.info(e);
    }
    // logger.info("Multi query 2")
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
        logger.info('ERROR');
        errors.push({ error: 'Failure to retrieve data', ...zargs });
      }
    }

    return { status: 0, message: 'Success', data: b, errors };
  }

  /* END Fucntions FOR GETBIB */

  // TODO: Implement
  public async attach_note(args) {
    //TODO: args parsing code
    args.notetext = as_value(args.notetext);
    args.key = this.extractKeyAndSetGroup(as_value(args.key));
    // logger.info(args.key)
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
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async collectionName(args) {
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async amendCollection(args) {
    const data = {};
    return this.message(0, 'exit status', data);
  }

  // private methods
  formatMessage(m) {
    const type = typeof m;

    const validTypes = ['string', 'number', 'undefined', 'boolean'];
    if (validTypes.includes(type) || m instanceof String || m === null) {
      return m;
    }

    if (m instanceof Error) {
      return `<Error: ${m.message || m.name}\n ${m.stack || ''}>`;
    }

    if (m && type === 'object' && m.message) {
      return `<Error: ${m.message}#\n${m.stack}>`;
    }

    return JSON.stringify(m, null, this.config.indent);
  }
}

export = Zotero;
