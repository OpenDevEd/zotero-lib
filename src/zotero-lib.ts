#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import Ajv from 'ajv';
import logger from './logger';
import sleep from './utils/sleep';
import formatAsXMP from './utils/formatAsXMP';
import printJSON from './utils/printJSON';

require('dotenv').config();
require('docstring');

const os = require('os');
const _ = require('lodash');
const he = require('he');
const convert = require('xml-js');

const toml = require('@iarna/toml');
const fs = require('fs');
const path = require('path');
const LinkHeader = require('http-link-header');

const ajv = new Ajv();
const md5 = require('md5-file');

const axios = require('axios');

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

  base = 'https://api.zotero.org';

  output: string = '';

  headers = {
    'User-Agent': 'Zotero-CLI',
    'Zotero-API-Version': '3',
    'Zotero-API-Key': '',
  };

  constructor(args = {}) {
    // Read config (which also sets the Zotero-API-Key value in the header)
    // TODO: readConfig may need to perform an async operation...
    const message = this.configure(args, true);
    logger.debug('configure response: %O', message);
    // if (message['status'] === 0) {
    // }
  }

  // zotero: any

  public configure(args, readconfigfile = false) {
    // pick up config: The function reads args and populates config

    // STEP 1. Read config file
    if (readconfigfile || args.config) {
      const config: string = [
        args.config,
        'zotero-cli.toml',
        `${os.homedir()}/.config/zotero-cli/zotero-cli.toml`,
      ].find((cfg) => fs.existsSync(cfg));
      this.config = config ? toml.parse(fs.readFileSync(config, 'utf-8')) : {};
    }

    // STEP 2. Apply --config_json option
    if (args.config_json) {
      console.log('Setting from config_json');
      const confobj =
        typeof args.config_json === 'string'
          ? JSON.parse(args.config_json)
          : args.config_json;
      Object.keys(confobj).forEach((x) => {
        console.log(`Setting: ${x}`);
        this.config[x] = confobj[x];
      });
    }

    this.config = this.canonicalConfig(this.config, args);

    /*
    if (!args.config && args.zotero_config)
      args.config = args.zotero_config
    if (!args.api_key && args.zotero_api_key)
      args.api_key = args.zotero_api_key
    */
    /*
    // STEP 4. If --api_key is given, then use it.
    if (args.api_key)
      this.config.api_key = args.api_key
    */
    // We're done with reading the config.
    // Now use the config:
    if (this.config.api_key) {
      this.headers['Zotero-API-Key'] = this.config.api_key;
    } else {
      return this.message(1, 'No API key provided in args or config');
    }

    if (args.verbose) {
      console.log('config=' + JSON.stringify(this.config, null, 2));
    }
    // Check that one and only one is defined:
    if (this.config.user_id === null && this.config.group_id === null) {
      return this.message(
        0,
        'Both user/group are null. You must provide exactly one of --user-id or --group-id',
      );
    }

    // TODO:
    // if (this.config.user_id !== null && this.config.group_id !== null) return this.message(0,
    // 'Both user/group are specified. You must provide exactly one of --user-id or --group-id')

    // TODO: discuss - we'd not be doing this, constructor should not do async ops
    // user_id==0 is generic; retrieve the real user id via the api_key
    // if (this.config.user_id === 0)
    //   this.config.user_id = (
    //     await this.get(`/keys/${args.api_key}`, { userOrGroupPrefix: false })
    //   ).userID;

    // using default=2 above prevents the overrides from being picked up
    if (args.indent === null) args.indent = 2;
    if (this.config.indent === null) this.config.indent = 2;

    return this.message(0, 'success');
  }

  private canonicalConfig(_config: any, _args: any) {
    const config = { ..._config };
    const args = { ..._args };
    this.config_keys.forEach((key) => {
      const key_zotero = 'zotero-' + key;
      const key_underscore = key.replace(/-/g, '_');
      const key_zotero_underscore = key_zotero.replace(/-/g, '_');
      /*
      api-key
      api_key
      zotero-api-key
      zotero_api_key
      --> api_key
      */
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
      } else {
        // Key is underscored already - nothing to do.
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
        args[key_underscore] = this.as_value(args[key_underscore]);
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
    // this.configure(args, false)
    // console.log("Reconfigure")
    const newargs = this.canonicalConfig({}, args);
    /* this.config_keys.forEach(item => {
      console.log("Reconf " + item)
      if (args[item])
        newargs[item] = args[item]
    }) */
    this.configure(newargs, false);
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
  private print(...args: any[]) {
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
              return `<Error: ${m.message || m.name}${m.stack ? `\n${m.stack}` : ''
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
    //console.log('all=' + uri);
    //console.log('TEMPORARY=' + JSON.stringify(params, null, 2));

    let chunk = await this.get(uri, {
      resolveWithFullResponse: true,
      params,
    }).catch((error) => {
      console.log('Error in all: ' + error);
    });

    let data = chunk.body;
    // console.log(data.length)
    // console.log('ALL-TEMPORARY=' + JSON.stringify(chunk.headers, null, 2))
    // console.log("ALL-TEMPORARY=" + JSON.stringify(data, null, 2))
    // const lh = LinkHeader.parse(chunk.headers.link)
    // console.log("ALL-TEMPORARY=" + JSON.stringify(lh, null, 2))
    let link =
      chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
    while (link && link.length && link[0].uri) {
      if (chunk.headers.backoff) {
        await sleep(parseInt(chunk.headers.backoff) * 1000);
      }

      /* chunk = await axios({
        url: link[0].uri,
        headers: this.headers,
        json: true,
        resolveWithFullResponse: true,
      }).then((res) => res.data);
      */
      chunk = await this.get(link[0].uri, {
        fulluri: true,
        resolveWithFullResponse: true,
        params,
      }).catch((error) => {
        console.log('Error in all: ' + error);
      });
      data = data.concat(chunk.body);
      link =
        chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
    }
    return data;
  }

  /**
   * get/put-type functions
   */
  // The Zotero API uses several commands: get, post, patch, delete - these are defined below.
  async get(
    uri,
    options: {
      fulluri?: boolean;
      userOrGroupPrefix?: boolean;
      params?: any;
      resolveWithFullResponse?: boolean;
      json?: boolean;
      arraybuffer?: boolean;
    } = {},
  ) {
    if (typeof options.userOrGroupPrefix === 'undefined')
      options.userOrGroupPrefix = true
    true;
    if (typeof options.params === 'undefined') options.params = {};
    if (typeof options.json === 'undefined') options.json = true;

    let prefix = '';
    if (options.userOrGroupPrefix) {
      prefix = this.config.user_id
        ? `/users/${this.config.user_id}`
        : `/groups/${this.config.group_id}`;
    }

    const params = Object.keys(options.params)
      .map((param) => {
        let values = options.params[param];
        values = this.as_array(values);
        return values.map((v) => `${param}=${encodeURI(v)}`).join('&');
      })
      .join('&');

    if (!options.fulluri) {
      uri = `${this.base}${prefix}${uri}${params ? '?' + params : ''}`;
    }

    if (this.config.verbose) console.error('GET', uri);
    logger.info('get uri: %s', uri);

    const requestConfig = {
      url: uri,
      headers: this.headers,
      encoding: null,
      json: options.json,
      resolveWithFullResponse: options.resolveWithFullResponse,
    }

    const requestConfig2 = options.arraybuffer ? {
      ...requestConfig,
      responseType: 'arraybuffer'
    } : requestConfig

    const res = await axios(requestConfig2)
      .then(
        // (resp) => resp.data
        /*
        (response) => {
          body: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config
          }  */
        function (response) {
          const out = {
            body: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config
          }
          // console.log("response-TEMPORARY=" + JSON.stringify(out, null, 2))
          return out
        }
      )
      .catch((error) => {
        if (this.config.verbose) {
          console.log(
            `Error in zotero.get = ${JSON.stringify(error, null, 2)}`,
          );
        }
        logger.error('error in zotero get %O', error);
        // console.log(`Error in zotero.get = ${JSON.stringify(error.error.data, null, 2)}`)
        const message = error.error && error.error.data;
        const shortError = {
          name: error.name,
          statusCode: error.statusCode,
          message,
          url: uri,
          json: options.json,
        };
        // console.log("DEBUG", (new Error().stack));
        // console.log(shortError)
        console.log(
          'Error in zotero.get = ' + JSON.stringify(shortError, null, 2),
        );
        return error;
      });
    // console.log("all=" + JSON.stringify(res, null, 2))
    if (options.resolveWithFullResponse) {
      return res;
    } else {
      return res.body;
    }
  }

  public async __get(args, subparsers?) {
    this.reconfigure(args);
    /** Expose 'get'
     * Make a direct query to the API using 'GET uri'.
     */
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('__get', {
        help: "Expose 'get'. Make a direct query to the API using 'GET uri'.",
      });
      argparser.set_defaults({ func: this.__get.name });
      argparser.add_argument('--root', {
        action: 'store_true',
        help: 'TODO: document',
      });
      argparser.add_argument('uri', { nargs: '+', help: 'TODO: document' });
      return { status: 0, message: 'success' };
    }

    const out = [];
    for (const uri of args.uri) {
      const res = await this.get(uri, { userOrGroupPrefix: !args.root });
      if (args.show) {
        this.show(res);
      }
      out.push(res);
    }
    return out;
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,
  async post(uri, data, headers = {}) {
    const prefix = this.config.user_id
      ? `/users/${this.config.user_id}`
      : `/groups/${this.config.group_id}`;
    console.log('POST' + uri);
    uri = `${this.base}${prefix}${uri}`;
    if (this.config.verbose) console.error('POST', uri);

    console.log('POST data: ', data);
    return axios({
      method: 'POST',
      url: uri,
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        ...headers,
      },
      data,
    }).then((res) => res.data);
  }

  public async __post(args, subparsers?) {
    this.reconfigure(args);
    /** Expose 'post'. Make a direct query to the API using 'POST uri [--data data]'. */
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('__post', {
        help:
          "Expose 'post'. Make a direct query to the API using 'POST uri [--data data]'.",
      });
      argparser.set_defaults({ func: this.__post.name });
      argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
      argparser.add_argument('--data', {
        required: true,
        help: 'Escaped JSON string for post data',
      });
      return { status: 0, message: 'success' };
    }
    const res = await this.post(args.uri, args.data);
    this.print(res);
    return res;
  }

  // TODO: Add       resolveWithFullResponse: options.resolveWithFullResponse,
  async put(uri, data) {
    const prefix = this.config.user_id
      ? `/users/${this.config.user_id}`
      : `/groups/${this.config.group_id}`;

    uri = `${this.base}${prefix}${uri}`;
    if (this.config.verbose) console.error('PUT', uri);

    return axios({
      method: 'PUT',
      url: uri,
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      data,
    }).then((res) => res.data);
  }

  public async __put(args, subparsers?) {
    this.reconfigure(args);
    /** Make a direct query to the API using 'PUT uri [--data data]'. */
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('__put', {
        help:
          "Expose 'put'. Make a direct query to the API using 'PUT uri [--data data]'.",
      });
      argparser.set_defaults({ func: this.__put.name });
      argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
      argparser.add_argument('--data', {
        required: true,
        help: 'Escaped JSON string for post data',
      });
      return { status: 0, message: 'success' };
    }

    const res = await this.put(args.uri, args.data);
    this.print(res);
    return res;
  }

  // patch does not return any data.
  // TODO: Errors are not handled - add this to patch (below) but needs adding to others.
  async patch(uri, data, version?: number) {
    const prefix = this.config.user_id
      ? `/users/${this.config.user_id}`
      : `/groups/${this.config.group_id}`;

    const headers = { ...this.headers, 'Content-Type': 'application/json' };
    if (typeof version !== 'undefined') {
      headers['If-Unmodified-Since-Version'] = version;
    }
    uri = `${this.base}${prefix}${uri}`;
    if (this.config.verbose) console.error('PATCH', uri);
    const res = await axios({
      method: 'PATCH',
      url: uri,
      headers,
      data,
      resolveWithFullResponse: true,
    })
      .then((resp) => resp.data)
      .catch((error) => {
        console.log('TEMPORARY=' + JSON.stringify(error, null, 2));
        return error;
      });
    return res;
  }

  public async __patch(args, subparsers?) {
    this.reconfigure(args);
    /** Make a direct query to the API using 'PATCH uri [--data data]'. */
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('__patch', {
        help:
          "Expose 'patch'. Make a direct query to the API using 'PATCH uri [--data data]'.",
      });
      argparser.set_defaults({ func: this.__patch.name });
      argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
      argparser.add_argument('--data', {
        required: true,
        help: 'Escaped JSON string for post data',
      });
      argparser.add_argument('--version', {
        required: true,
        help: 'Version of Zotero record (obtained previously)',
      });
      return { status: 0, message: 'success' };
    }
    const res = await this.patch(args.uri, args.data, args.version);
    this.print(res);
    return res;
  }

  // TODO: Add       resolveWithFullResponse: options.resolveWithFullResponse,
  async delete(uri, version?: number) {
    const prefix = this.config.user_id
      ? `/users/${this.config.user_id}`
      : `/groups/${this.config.group_id}`;

    const headers = { ...this.headers, 'Content-Type': 'application/json' };
    if (typeof version !== 'undefined') {
      headers['If-Unmodified-Since-Version'] = version;
    }

    uri = `${this.base}${prefix}${uri}`;
    if (this.config.verbose) console.error('DELETE', uri);

    //      console.log("TEMPORARY="+JSON.stringify(      uri      ,null,2))

    return axios({
      method: 'DELETE',
      url: uri,
      headers,
    }).then((res) => res.data);
  }

  public async __delete(args, subparsers?) {
    this.reconfigure(args);
    /** Make a direct delete query to the API using 'DELETE uri'. */
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('__delete', {
        help:
          "Expose 'delete'. Make a direct delete query to the API using 'DELETE uri'.",
      });
      argparser.set_defaults({ func: this.__delete.name });
      argparser.add_argument('uri', { nargs: '+', help: 'Request uri' });
      return { status: 0, message: 'success' };
    }
    const out = [];
    for (const uri of args.uri) {
      // console.log(uri)
      const response = await this.get(uri);
      // console.log(response)
      out.push[await this.delete(uri, response.version)];
    }
    console.log('TEMPORARY=' + JSON.stringify(out, null, 2));
    process.exit(1);
    return out;
  }

  public async key(args, subparsers?) {
    this.reconfigure(args);
    /** Show details about this API key. (API: /keys ) */
    if (args.getInterface && subparsers) {
      const parser_key = subparsers.add_parser('key', {
        help: 'Show details about an API key. (API: /keys )',
      });
      parser_key.set_defaults({ func: this.key.name });
      parser_key.add_argument('--key', {
        nargs: 1,
        help:
          'Provide the API key. Otherwise the API key given in the config is used. API: /keys',
      });
      parser_key.add_argument('--groups', {
        action: 'store_true',
        help: 'Show groups available to this key (API: /users/<userID>/groups)',
      });
      parser_key.add_argument('--terse', {
        action: 'store_true',
        help: 'Produce a simplified listing of groups',
      });
      return { status: 0, message: 'success' };
    }
    if (!args.api_key) {
      args.api_key = this.config.api_key;
    }
    const res = await this.get(`/keys/${args.api_key}`, {
      userOrGroupPrefix: false,
    });
    this.show(res);
    let res2 = [];
    if (args.groups) {
      // TODO: This only retrieves 100 libraries. Need to an 'all' query.
      res2 = await this.get(`/users/${res.userID}/groups`, {
        params: { limit: 100 },
        userOrGroupPrefix: false,
      });
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
    return (await this.get(uri, { resolveWithFullResponse: true, params }))
      .headers['total-results'];
  }

  private show(v) {
    // TODO: Look at the type of v: if string, then print, if object, then stringify
    // this.print(JSON.stringify(v, null, this.config.indent).replace(new RegExp(this.config.api_key, 'g'), '<API-KEY>'))
    this.print(JSON.stringify(v, null, this.config.indent));
  }

  private as_value(value) {
    if (Array.isArray(value)) {
      value = value[0];
    }
    return value;
  }

  private as_array(value) {
    let out = [];
    if (value === undefined) {
      return value;
    }
    if (value) {
      if (!Array.isArray(value)) {
        out = [value];
      } else {
        out = value;
      }
    }
    return out;
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

  /*
  private extractGroupAndSetGroup(key) {
    // console.log("extractGroupAndSetGroup")
    return this.extractKeyGroupVariable(key, 1);
  }
  */

  public objectifyTags(tags) {
    const tagsarr = [];
    if (tags) {
      tags = this.as_array(tags);
      console.log(typeof tags);
      tags.forEach((mytag) => {
        tagsarr.push({ tag: mytag, type: 0 });
      });
    }
    return tagsarr;
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

  /// THE COMMANDS --> public
  // The following functions define key API commands: /keys, /collection, /collections, etc.

  // https://www.zotero.org/support/dev/web_api/v3/basics
  // Collections
  // <userOrGroupPrefix>/collections Collections in the library
  // <userOrGroupPrefix>/collections/top Top-level collections in the library
  // <userOrGroupPrefix>/collections/<collectionKey> A specific collection in the library
  // <userOrGroupPrefix>/collections/<collectionKey>/collections Subcollections within a specific collection in the library

  // TODO: --create-child should go into 'collection'.

  // zotero-cli,
  // If I call $collections(subparser) -> add options to subparser
  // $collections(null) -> perform cllections action (using args)
  public async collections(args, subparsers?) {
    this.reconfigure(args);
    /* Retrieve a list of collections or create a collection. (API: /collections, /collections/top, /collections/<collectionKey>/collections). Use 'collections --help' for details. */
    if (args.getInterface && subparsers) {
      // async $collections
      const parser_collections = subparsers.add_parser('collections', {
        help: 'Retrieve sub-collections and create new collections.',
      });
      parser_collections.set_defaults({ func: 'collections' });
      parser_collections.add_argument('--top', {
        action: 'store_true',
        help: 'Show only collection at top level.',
      });
      parser_collections.add_argument('--key', {
        nargs: 1,
        required: true,
        help:
          'Show all the child collections of collection with key. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_collections.add_argument('--create-child', {
        nargs: '*',
        help:
          'Create child collections of key (or at the top level if no key is specified) with the names specified.',
      });
      return { status: 0, message: 'success' };
    }
    /*
    The above means that I can call:
    args.argparser = new argparser
    Zotero.$collections(args)
    Zotero.$collection(args)
    Zotero.$items(args)
    Zotero.$item(args)
    */
    // Provide guidance to the user:  This function requires:
    // args.key (string, required)
    // args.top (boolean, optional)
    // args.create_child (string, optional)
    // perform tests: args.key
    // console.log("console args =" + JSON.stringify(args, null, 2))
    if (args.key) {
      args.key = this.extractKeyAndSetGroup(this.as_value(args.key));
    }
    // if (!args.create_child && !args.top) {
    // 'Unable to extract group/key from the string provided.',
    if (!args.key && !args.top) {
      return this.message(
        0,
        'You should specify key or --top.'
      );
    }

    // console.log("ARRAYOF: "+typeof(this.array(args.create_child)))
    // if (args.create_child) {
    args.create_child = this.as_array(args.create_child);
    // } else {
    //  console.log("TEMPORARY="+JSON.stringify(   args.create_child         ,null,2))
    // }
    // perform test: args.create_child
    // If create_child=true, then create the child and exit.
    // console.log("collection...." + args.key)
    if (args.create_child) {
      let response;
      if (args.key) {
        console.log('args.key=>args.create_child');
        response = await this.post(
          '/collections',
          JSON.stringify(
            args.create_child.map((c) => {
              return { name: c, parentCollection: args.key };
            }),
          ),
        );
      } else {
        console.log('(top)=>args.create_child');
        response = await this.post(
          '/collections',
          JSON.stringify(
            args.create_child.map((c) => {
              return { name: c };
            }),
          ),
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

  // Operate on a specific collection.
  // <userOrGroupPrefix>/collections/<collectionKey>/items Items within a specific collection in the library
  // <userOrGroupPrefix>/collections/<collectionKey>/items/top Top-level items within a specific collection in the library

  // TODO: --create-child should go into 'collection'.
  // DONE: Why is does the setup for --add and --remove differ? Should 'add' not be "nargs: '*'"? Remove 'itemkeys'?
  // TODO: Add option "--output file.json" to pipe output to file.

  async collection(args, subparsers?) {
    /**
  Retrieve information about a specific collection --key KEY (API: /collections/KEY or /collections/KEY/tags). Use 'collection --help' for details.
  (Note: Retrieve items is a collection via 'items --collection KEY'.)
     */
    this.reconfigure(args);
    if (args.getInterface && subparsers) {
      // async $collection
      const parser_collection = subparsers.add_parser('collection', {
        help:
          "Retrieve collection information, display tags, add/remove items. (API: /collections/KEY or /collections/KEY/tags). (Note: Retrieve items is a collection: use 'items --collection KEY'.) ",
      });
      parser_collection.set_defaults({ func: this.collection.name });
      parser_collection.add_argument('--key', {
        nargs: 1,
        help:
          'The key of the collection (required). You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_collection.add_argument('--tags', {
        action: 'store_true',
        help: 'Display tags present in the collection.',
      });
      parser_collection.add_argument('itemkeys', {
        nargs: '*',
        help:
          'Item keys for items to be added or removed from this collection.',
      });
      parser_collection.add_argument('--add', {
        nargs: '*',
        help:
          "Add items to this collection. Note that adding items to collections with 'item --addtocollection' may require fewer API queries. (Convenience method: patch item->data->collections.)",
      });
      parser_collection.add_argument('--remove', {
        nargs: '*',
        help:
          "Convenience method: Remove items from this collection. Note that removing items from collections with 'item --removefromcollection' may require fewer API queries. (Convenience method: patch item->data->collections.)",
      });
      return { status: 0, message: 'success' };
    }

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
    /*
    if (args.add && !args.itemkeys.length) {
      const msg = this.message(0,'--add requires item keys')
      return msg
    }
    if (!args.add && args.itemkeys.length) {
      const msg = this.message(0,'unexpected item keys')
      return msg
    }
    */
    if (args.add) {
      for (const itemKey of args.add) {
        const item = await this.get(`/items/${itemKey}`);
        if (item.data.collections.includes(args.key)) continue;
        await this.patch(
          `/items/${itemKey}`,
          JSON.stringify({
            collections: item.data.collections.concat(args.key),
          }),
          item.version,
        );
      }
    }

    if (args.remove) {
      for (const itemKey of args.remove) {
        const item = await this.get(`/items/${itemKey}`);
        const index = item.data.collections.indexOf(args.key);
        if (index > -1) {
          item.data.collections.splice(index, 1);
        }
        await this.patch(
          `/items/${itemKey}`,
          JSON.stringify({ collections: item.data.collections }),
          item.version,
        );
      }
    }

    const res = await this.get(
      `/collections/${args.key}${args.tags ? '/tags' : ''}`,
    );
    this.show(res);
    return res;
  }

  // URI Description
  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/items All items in the library, excluding trashed items
  // <userOrGroupPrefix>/items/top Top-level items in the library, excluding trashed items

  async items(args, subparsers?) {
    // console.log("items-----")
    this.reconfigure(args);
    /**
  Retrieve list of items from API. (API: /items, /items/top, /collections/COLLECTION/items/top).
  Use 'items --help' for details.
  By default, all items are retrieved. With --top or limit (via --filter) the default number of items are retrieved.
    */
    let items;
    if (args.getInterface && subparsers) {
      // async items
      const parser_items = subparsers.add_parser('items', {
        help:
          'Retrieve items, retrieve items within collections, with filter is required. Count items. By default, all items are retrieved. With --top or limit (via --filter) the default number of items are retrieved. (API: /items, /items/top, /collections/COLLECTION/items/top)',
      });
      parser_items.set_defaults({ func: this.items.name });
      /* parser_items.add_argument('itemKeys', {
         nargs: "*",
         action: 'store_true',
         help: 'items for validation'
       }) */
      parser_items.add_argument('--count', {
        action: 'store_true',
        help: 'Return the number of items.',
      });
      // argparser.add_argument('--all', { action: 'store_true', help: 'obsolete' })
      parser_items.add_argument('--filter', {
        type: subparsers.json,
        help:
          'Provide a filter as described in the Zotero API documentation under read requests / parameters. For example: \'{"format": "json,bib", "limit": 100, "start": 100}\'.',
      });
      parser_items.add_argument('--collection', {
        help:
          'Retrive list of items for collection. You can provide the collection key as a zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_items.add_argument('--top', {
        action: 'store_true',
        help:
          'Retrieve top-level items in the library/collection (excluding child items / attachments, excluding trashed items).',
      });
      parser_items.add_argument('--validate', {
        action: 'store_true',
        help:
          'Validate the record against a schema. If your config contains zotero-schema, then that file is used. Otherwise supply one with --validate-with',
      });
      parser_items.add_argument('--validate-with', {
        type: subparsers.path,
        help:
          'json-schema file for all itemtypes, or directory with schema files, one per itemtype.',
      });
      return { status: 0, message: 'success' };
    }

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
      items = await this.get(`${collection}/items`, { params });
    } else {
      // console.log("all-----")
      items = await this.all(`${collection}/items`, params);
      // console.log("TEMPORARY="+JSON.stringify(      items      ,null,2))
    }

    // console.log("TEMPORARY=" + JSON.stringify(items, null, 2))

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
      console.log('TEMPORARY=' + JSON.stringify(this.config, null, 2));
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

  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/items/<itemKey> A specific item in the library
  // <userOrGroupPrefix>/items/<itemKey>/children Child items under a specific item
  /*
    getFuncName() {
      return this.getFuncName.caller.name
    }
  */
  public async item(args, subparsers?) {
    /**
  Retrieve an item (item --key KEY), save/add file attachments, retrieve children. Manage collections and tags. (API: /items/KEY/ or /items/KEY/children).

  Also see 'attachment', 'create' and 'update'.
    */
    // console.log("HERE="+this.getFuncName())
    this.reconfigure(args);
    // $item({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      // async item
      const parser_item = subparsers.add_parser('item', {
        help:
          'Modify items: Add/remove tags, attach/save files, add to collection/remove, get child items. (API: /items/KEY/ or /items/KEY/children)',
      });
      parser_item.set_defaults({ func: this.item.name });
      parser_item.add_argument('--key', {
        action: 'store',
        required: true,
        help:
          'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_item.add_argument('--xmp', {
        action: 'store_true',
        help: 'Provide output in xmp format',
      });

      parser_item.add_argument('--switch-names', {
        action: 'store_true',
        help:
          'Switch firstName with lastName and vice versa in creators, ignoring name only creators',
        dest: 'switchNames',
      });

      parser_item.add_argument('--children', {
        action: 'store_true',
        help: 'Retrieve list of children for the item.',
      });
      parser_item.add_argument('--filter', {
        type: subparsers.json,
        help:
          'Provide a filter as described in the Zotero API documentation under read requests / parameters. To retrieve multiple items you have use "itemkey"; for example: \'{"format": "json,bib", "itemkey": "A,B,C"}\'. See https://www.zotero.org/support/dev/web_api/v3/basics#search_syntax.',
      });
      parser_item.add_argument('--addfiles', {
        nargs: '*',
        help: 'Upload attachments to the item. (/items/new)',
      });
      parser_item.add_argument('--savefiles', {
        nargs: '*',
        help: 'Download all attachments from the item (/items/KEY/file).',
      });
      parser_item.add_argument('--addtocollection', {
        nargs: '*',
        help:
          'Add item to collections. (Convenience method: patch item->data->collections.)',
      });
      parser_item.add_argument('--removefromcollection', {
        nargs: '*',
        help:
          'Remove item from collections. (Convenience method: patch item->data->collections.)',
      });
      parser_item.add_argument('--addtags', {
        nargs: '*',
        help: 'Add tags to item. (Convenience method: patch item->data->tags.)',
      });
      parser_item.add_argument('--removetags', {
        nargs: '*',
        help:
          'Remove tags from item. (Convenience method: patch item->data->tags.)',
      });
      parser_item.add_argument('--validate', {
        action: 'store_true',
        help:
          'Validate the record against a schema. If your config contains zotero-schema, then that file is used. Otherwise supply one with --validate-with',
      });
      parser_item.add_argument('--validate-with', {
        type: subparsers.path,
        help:
          'json-schema file for all itemtypes, or directory with schema files, one per itemtype.',
      });
      return { status: 0, message: 'success' };
    }

    const output = [];

    // console.log("args in ... TEMPORARY=" + JSON.stringify(args.key, null, 2))
    // const [my_group_id, my_key] = this.getGroupAndKey(args);
    const my_key = this.extractKeyAndSetGroup(args.key);
    //args.group_id = my_group_id;
    args.key = my_key;
    // console.log("args out ... TEMPORARY=" + JSON.stringify(args.key, null, 2))
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
      item = await this.get(`/items/${args.key}`);
      output.push({ record: item });

      if (args.savefiles) {
        const children = await this.get(`/items/${args.key}/children`);
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
                  await this.get(`/items/${item.key}/file`),
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
        const attachmentTemplate = await this.get(
          '/items/new?itemType=attachment&linkMode=imported_file',
          { userOrGroupPrefix: false },
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
            await this.post('/items', JSON.stringify([attach])),
          );
          const uploadAuth = JSON.parse(
            await this.post(
              `/items/${uploadItem.successful[0].key}/file?md5=${md5.sync(
                filename,
              )}&filename=${attach.filename}&filesize=${fs.statSync(filename)['size']
              }&mtime=${stat.mtimeMs}`,
              '{}',
              { 'If-None-Match': '*' },
            ),
          );
          let request_post = null;
          if (uploadAuth.exists !== 1) {
            const uploadResponse = await axios({
              method: 'POST',
              url: uploadAuth.url,
              data: Buffer.concat([
                Buffer.from(uploadAuth.prefix),
                fs.readFileSync(filename),
                Buffer.from(uploadAuth.suffix),
              ]),
              headers: { 'Content-Type': uploadAuth.contentType },
            }).then((res) => res.data);
            if (args.verbose) {
              console.log('uploadResponse=');
              this.show(uploadResponse);
            }
            request_post = await this.post(
              `/items/${uploadItem.successful[0].key}/file?upload=${uploadAuth.uploadKey}`,
              '{}',
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                'If-None-Match': '*',
              },
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
        const addto = await this.patch(
          `/items/${args.key}`,
          JSON.stringify({ collections: newCollections }),
          item.version,
        );
        output.push({ addtocollection: addto });
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
        const res = await this.patch(
          `/items/${args.key}`,
          JSON.stringify({ creators: updatedCreators }),
          item.version,
        );
        output.push({ switchNames: res });
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
        const removefrom = await this.patch(
          `/items/${args.key}`,
          JSON.stringify({ collections: newCollections }),
          item.version,
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
        const res = await this.patch(
          `/items/${args.key}`,
          JSON.stringify({ tags: newTags }),
          item.version,
        );
        output.push({ addtags: res });
      }

      if (args.removetags) {
        const newTags = item.data.tags.filter(
          (tag) => !args.removetags.includes(tag.tag),
        );
        const res = await this.patch(
          `/items/${args.key}`,
          JSON.stringify({ tags: newTags }),
          item.version,
        );
        output.push({ removetags: res });
      }
    }
    const params = args.filter || {};
    let result;
    if (args.children) {
      console.log('children');
      result = await this.get(`/items/${args.key}/children`, { params });
      output.push({ children_final: result });
    } else {
      if (
        args.addtocollection ||
        args.removefromcollection ||
        args.removetags ||
        args.addtags ||
        args.filter
      ) {
        result = await this.get(`/items/${args.key}`, { params });
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

  async attachment(args, subparsers?) {
    /**
  Retrieve/save file attachments for the item specified with --key KEY (API: /items/KEY/file).
  Also see 'item', which has options for adding/saving file attachments.
    */
    this.reconfigure(args);
    if (args.getInterface && subparsers) {
      // async attachement
      const parser_attachment = subparsers.add_parser('attachment', {
        help:
          "Save file attachments for the item specified with --key KEY (API: /items/KEY/file). Also see 'item', which has options for adding/saving file attachments. ",
      });
      parser_attachment.set_defaults({ func: this.attachment.name });
      parser_attachment.add_argument('--key', {
        action: 'store',
        required: true,
        help:
          'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_attachment.add_argument('--save', {
        action: 'store',
        required: true,
        help: 'Filename to save attachment to.',
      });
      return { status: 0, message: 'success' };
    }

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

    /*
        const response = await this.get(`/items/${args.key}/file`, { arraybuffer: true });
        // console.log("TEMPORARY="+JSON.stringify( response           ,null,2))
        console.log("Got response")
        try {
          const blob = new Blob([response.body.data], {
            type: 'application/pdf',
          });
          fs.writeFileSync(
            args.save,
            blob,
            'binary',
          );
        } catch (e) {
          console.log(e)
        }
    */

    const blob = await this.get(`/items/${args.key}/file`, { arraybuffer: true });

    fs.writeFileSync(
      args.save,
      blob,
      'binary',
    );

    // TODO return better value.
    const response = await this.get(`/items/${args.key}`)
    // console.log("TEMPORARY=" + JSON.stringify(response.data.md5, null, 2))
    // At this point we should compare response.data.md5 and the md5sum(blob)

    return this.message(0, 'File saved', { filename: args.save, md5: response.data.md5, mtime: response.data.mtime });
  }

  public async create_item(args, subparsers?) {
    /**
  Create a new item or items. (API: /items/new) You can retrieve a template with the --template option.
  Use this option to create both top-level items, as well as child items (including notes and links).
    */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      // async create item
      const parser_create = subparsers.add_parser('create', {
        help:
          'Create a new item or items. (API: /items/new) You can retrieve a template with the --template option. Use this option to create both top-level items, as well as child items (including notes and links).',
      });
      parser_create.set_defaults({ func: this.create_item.name });
      parser_create.add_argument('--template', {
        help:
          "Retrieve a template for the item you wish to create. You can retrieve the template types using the main argument 'types'.",
      });
      parser_create.add_argument('--files', {
        nargs: '*',
        help: 'Text files with JSON for the items to be created.',
      });
      parser_create.add_argument('--items', {
        nargs: '*',
        help: 'JSON string(s) for the item(s) to be created.',
      });
      return { status: 0, message: 'success' };
    }

    if (args.template) {
      const result = await this.get('/items/new', {
        userOrGroupPrefix: false,
        params: { itemType: args.template },
      });
      this.show(result);
      // console.log("/"+result+"/")
      return result;
    } else if (Array.isArray(args.files) && args.files.length > 0) {
      if (!args.files.length)
        return this.message(
          0,
          'Need at least one item (args.items) to create or use args.template',
        );
      const items = args.files.map((item) =>
        JSON.parse(fs.readFileSync(item, 'utf-8')),
      );
      // console.log("input")
      // this.show(items)
      const result = await this.post('/items', JSON.stringify(items));
      const res = result;
      this.show(res);
      // TODO: see how to use pruneData
      return res;
    } else if ('items' in args && args.items.length > 0) {
      const result = await this.post('/items', JSON.stringify(args.items));
      const res = result;
      this.show(res);
      // TODO: see how to use pruneData
      return res;
    } else if (args.item) {
      const result = await this.post(
        '/items',
        '[' + JSON.stringify(args.item) + ']',
      );
      this.show(result);
      return this.pruneData(result, args.fullresponse);
    }
  }

  /*
    private pruneResponse(res) {
      return this.pruneData(res, args.fullresponse)
    }
  */
  public pruneData(res, fullresponse = false) {
    // logger.info('pruneData res = %O', res);
    if (fullresponse) return res;
    return res.successful['0'].data;
  }

  public async update_item(args, subparsers?) {
    /** Update/replace an item (--key KEY), either update (API: patch /items/KEY) or replacing (using --replace, API: put /items/KEY). */
    this.reconfigure(args);
    if (args.getInterface && subparsers) {
      // update item
      const parser_update = subparsers.add_parser('update', {
        help:
          'Update/replace an item (--key KEY), either update (API: patch /items/KEY) or replacing (using --replace, API: put /items/KEY).',
      });
      parser_update.set_defaults({ func: this.update_item.name });
      parser_update.add_argument('--key', {
        required: true,
        help:
          'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
      });
      parser_update.add_argument('--replace', {
        action: 'store_true',
        help: 'Replace the item by sumbitting the complete json.',
      });
      parser_update.add_argument('--json', {
        nargs: 1,
        help: 'New item as JSON. For library use, an object is possible.',
      });
      parser_update.add_argument('--file', {
        nargs: 1,
        help: 'Path of file in json format.',
      });
      parser_update.add_argument('--version', {
        nargs: 1,
        help:
          'You have to supply the version of the item via the --version argument or else the latest version will be used.',
      });
      return { status: 0, message: 'success' };
    }
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
      const originalItem = await this.get(`/items/${args.key}`);
      originalItemVersion = originalItem.version;
    }
    // console.log("3")
    // console.log("TEMPORARY args=" + JSON.stringify(args, null, 2))
    let jsonstr = '';
    if (args.json) {
      args.json = this.as_value(args.json);
      if (typeof args.json !== 'string') jsonstr = JSON.stringify(args.json);
      else jsonstr = args.json;
      // console.log("j=" + jsonstr)
    } else if (args.file) {
      args.file = this.as_value(args.file);
      jsonstr = fs.readFileSync(args.file);
    }
    const result = await this[args.replace ? 'put' : 'patch'](
      `/items/${args.key}`,
      jsonstr,
      originalItemVersion,
    );
    // console.log("X=" + JSON.stringify(result, null, 2))
    return result;
  }

  // <userOrGroupPrefix>/items/trash Items in the trash
  async trash(args, subparsers?) {
    /** Return a list of items in the trash. */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      return null;
    }
    const items = await this.get('/items/trash');
    this.show(items);
    return items;
  }

  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/publications/items Items in My Publications

  async publications(args, subparsers?) {
    /** Return a list of items in publications (user library only). (API: /publications/items) */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('publications', {
        help:
          'Return a list of items in publications (user library only). (API: /publications/items)',
      });
      argparser.set_defaults({ func: this.publications.name });
      return;
    }

    const items = await this.get('/publications/items');
    this.show(items);
    return items;
  }

  // itemTypes

  async types(args, subparsers?) {
    /** Retrieve a list of items types available in Zotero. (API: /itemTypes) */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('types', {
        help:
          'Retrieve a list of items types available in Zotero. (API: /itemTypes).',
      });
      argparser.set_defaults({ func: this.types.name });
      return;
    }
    const types = await this.get('/itemTypes', { userOrGroupPrefix: false });
    this.show(types);
    return types;
  }

  async groups(args, subparsers?) {
    /** Retrieve the Zotero groups data to which the current library_id and api_key has access to. (API: /users/<user-id>/groups) */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('groups', {
        help:
          'Retrieve the Zotero groups data to which the current library_id and api_key has access to. (API: /users/<user-id>/groups)',
      });
      argparser.set_defaults({ func: this.groups.name });
      return this.message(0, 'success', args);
    }
    const groups = await this.get('/groups');
    this.show(groups);
    return groups;
  }

  async fields(args, subparsers?) {
    /**
     * Retrieve a template with the fields for --type TYPE (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields (API: /itemFields).
     * Note that to retrieve a template, use 'create-item --template TYPE' rather than this command.
     */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('fields', {
        help:
          "Retrieve a template with the fields for --type TYPE (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields (API: /itemFields). Note that to retrieve a template, use 'create-item --template TYPE' rather than this command.",
      });
      argparser.set_defaults({ func: this.fields.name });
      argparser.add_argument('--type', {
        help: 'Display fields types for TYPE.',
      });
      return { status: 0, message: 'success' };
    }

    if (args.type) {
      const result = {
        itemTypeFields: await this.get('/itemTypeFields', {
          params: { itemType: args.type },
          userOrGroupPrefix: false,
        }),
        itemTypeCreatorTypes: await this.get('/itemTypeCreatorTypes', {
          params: { itemType: args.type },
          userOrGroupPrefix: false,
        }),
      };
      this.show(result);
      return result;
    } else {
      const result = {
        itemFields: await this.get('/itemFields', { userOrGroupPrefix: false }),
      };
      this.show(result);
      return result;
    }
  }

  // Searches
  // https://www.zotero.org/support/dev/web_api/v3/basics

  async searches(args, subparsers?) {
    /** Return a list of the saved searches of the library. Create new saved searches. (API: /searches) */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('searches', {
        help:
          'Return a list of the saved searches of the library. Create new saved searches. (API: /searches)',
      });
      argparser.set_defaults({ func: this.searches.name });
      argparser.add_argument('--create', {
        nargs: 1,
        help: 'Path of JSON file containing the definitions of saved searches.',
      });
      return { status: 0, message: 'success' };
    }

    if (args.create) {
      let searchDef = [];
      try {
        searchDef = JSON.parse(fs.readFileSync(args.create[0], 'utf8'));
      } catch (ex) {
        console.log('Invalid search definition: ', ex);
      }

      searchDef = this.as_array(searchDef);

      const res = await this.post('/searches', JSON.stringify(searchDef));
      this.print('Saved search(s) created successfully.');
      return res;
    }
    const items = await this.get('/searches');
    this.show(items);
    return items;
  }

  // Tags
  async tags(args, subparsers?) {
    /** Return a list of tags in the library. Options to filter and count tags. (API: /tags) */
    this.reconfigure(args);
    // function.name({"argparser": subparser}) returns CLI definition.
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('tags', {
        help:
          'Return a list of tags in the library. Options to filter and count tags. (API: /tags)',
      });
      argparser.set_defaults({ func: this.tags.name });
      argparser.add_argument('--filter', {
        help: 'Tags of all types matching a specific name.',
      });
      argparser.add_argument('--count', {
        action: 'store_true',
        help: 'TODO: document',
      });
      return { status: 0, message: 'success' };
    }

    let rawTags = null;
    if (args.filter) {
      rawTags = await this.all(`/tags/${encodeURIComponent(args.filter)}`);
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

  public async enclose_item_in_collection(args, subparsers?) {
    this.reconfigure(args);
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('enclose-item', {
        help:
          'Utility function: Enlose the item in a collection and create further subcollections.',
      });
      argparser.set_defaults({ func: this.enclose_item_in_collection.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be enclosed.',
      });
      argparser.add_argument('--collection', {
        nargs: 1,
        action: 'store',
        help:
          'The Zotero collection key in which the new collection is created. (Otherwise created at top level.)',
      });
      argparser.add_argument('--group-id', {
        nargs: 1,
        action: 'store',
        help:
          'The Zotero group id.',
      });
      argparser.add_argument('--title', {
        nargs: 1,
        action: 'store',
        help:
          "The title for the new collection (otherwise it's derived from the item title).",
      });
      return { status: 0, message: 'success' };
    }
    /*
    // Get an instance of Zotero (with default group)
    const zotero = new Zotero()
    // Specify group and key via 'key' and write to output file
    const response = await zotero.item({key: "zotero://select/groups/2259720/items/YH7GFG6L", out: "item_YH7GFG6L.json"})
    */
    // run with verbosity:
    // const zotero = new Zotero({verbose: true})
    // Specify group via constructor
    const output = [];
    if (!args.key) {
      return this.message(1, 'You must provide --key/args.key', args);
    }
    if (!args.collection) {
      args.collection = '';
    }
    // This line produces the issue. XXX
    // const [group_id, key] = this.getGroupAndKey(args);
    const key = this.as_value(this.extractKeyAndSetGroup(args.key));
    const base_collection = this.as_value(
      this.extractKeyAndSetGroup(args.collection),
    );
    const group_id = args.group_id ? args.group_id : this.config.group_id;
    /* console.log(
      `CHECKING
      Key = ${key};
      group_id = ${group_id};
      ${this.extractGroupAndSetGroup(args.key)},
      ${this.extractGroupAndSetGroup(args.collection)}`,
    ); */
    if (!group_id) {
      console.log("ERROR ERROR ERROR - no group id in zotero->enclose_item_in_collection")
    } else {
      console.log(`zotero->enclose_item_in_collection: group_id ${group_id}`)
    }
    // const zotero = new Zotero();
    // Failure previously here.
    // const response = await zotero.item({ key: key, group_id: group_id });
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
      key: this.as_value(base_collection),
      create_child: this.as_array(child_name),
    });
    //console.log(
    //  'TEMPORARY res collections=' + JSON.stringify(new_coll, null, 2),
    //);
    output.push({ collection: new_coll });

    console.log('Move item to collection');
    const ecoll = this.as_array(new_coll[0].key);
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
    console.log('TEMPORARY=' + JSON.stringify(refcol_res, null, 2));
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
    // console.log("-->" + response2.collections)
    console.log('TEMPORARY=' + JSON.stringify(output, null, 2));

    return this.message(0, 'Succes', output);
  }
  /*
    private getGroupAndKey(args: any) {
      // console.log("getGroupAndKey TEMPORARY=" + JSON.stringify(args, null, 2))
      this.reconfigure(args);
      // Precendence: explicit argument - otherwise from args.key, otherwise from args.collection
      // TODO: Check this with "  private extractKeyGroupVariable " - because that sets this.config.group_id - does that matter?
      const group_id = this.as_value(
        args.group_id
          ? args.group_id
          : (
            args.key && this.extractGroupAndSetGroup(args.key)
              ? this.extractGroupAndSetGroup(args.key)
              : (
                args.collection && this.extractGroupAndSetGroup(args.collection)
                  ? this.extractGroupAndSetGroup(args.collection)
                  : this.config.group_id
              )
          )
      );
      console.log(`
  getGroupAndKey
  args.key = ${args.key}
  args.group_id = ${args.group_id}
  args.collection = ${args.collection}
  this.extractGroupAndSetGroup(args.key) = ${this.extractGroupAndSetGroup(args.key)}
  this.extractGroupAndSetGroup(args.collection) = ${this.extractGroupAndSetGroup(args.collection)}
  this.config.group_id = ${this.config.group_id}
  -> args.group_id = ${args.group_id}
      `)
      const key = this.as_value(this.extractKeyAndSetGroup(args.key));
      // console.log(`getGroupAndKey ${args.key} -> ${group_id} / ${key}`)
      return [group_id, key];
    }
  */

  // Update the DOI of the item provided.
  public async get_doi(args, subparsers?) {
    this.reconfigure(args);
    // We dont know what kind of item this is - gotta get the item to see
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('get-doi', {
        help: 'Utility function: Get the DOI for the item.',
      });
      argparser.set_defaults({ func: this.get_doi.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be updated.',
      });
      return { status: 0, message: 'success' };
    }
    args.fullresponse = false;
    const item = await this.item(args);
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
    console.log(`DOI: ${doi}, ${typeof doi}`);
    // ACTION: return values
    doi = 'doi->' + doi;
    return doi;
  }

  // Update the DOI of the item provided.
  public async update_doi(args, subparsers?) {
    this.reconfigure(args);
    // We dont know what kind of item this is - gotta get the item to see
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('update-doi', {
        help: 'Utility function: Update the DOI for the item.',
      });
      argparser.set_defaults({ func: this.update_doi.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be updated.',
      });
      argparser.add_argument('--doi', {
        nargs: 1,
        action: 'store',
        help: 'The DOI for the item',
      });
      return { status: 0, message: 'success' };
    }
    args.fullresponse = false;
    const item = await this.item(args);
    // const item = this.pruneData(response)
    if (args.doi) {
      // TODO: should scan item.extra and check for existing DOI
      if (!item.doi)
        console.log(
          'TODO: zotero-lib - should scan item.extra and check for existing DOI',
        );
      const extra = item.extra + `\nDOI: ${args.doi}`;
      const updateargs = {
        key: args.key,
        version: item.version,
        json: item.doi ? { doi: args.doi } : { extra },
        fullresponse: false,
        show: true,
      };
      // ACTION: check arguments
      // ACTION: run code
      const update = await this.update_item(updateargs);
      if (update.statusCode == 204) {
        console.log('update successfull - getting record');
        // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today = new Date();
        // const message = `Attached new DOI ${args.doi} on ${today.toLocaleDateString("en-US", options)}`
        const message = `Attached new DOI ${args.doi
          } on ${today.toLocaleDateString()}`;
        await this.attachNoteToItem(args.key, {
          content: message,
          tags: ['_r:message'],
        });
        const zoteroRecord = await this.item({ key: args.key });
        if (args.verbose)
          console.log('Result=' + JSON.stringify(zoteroRecord, null, 2));
        return zoteroRecord;
      } else {
        console.log('update failed');
        return this.message(1, 'update failed');
      }
    } else {
      return this.message(1, 'update failed - no doi provided');
    }
    // ACTION: return values
    // return 1
  }

  public async TEMPLATE(args, subparsers?) {
    this.reconfigure(args);
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('TEMPLATE', { help: 'HELPTEXT' });
      argparser.set_defaults({ func: this.TEMPLATE.name });
      argparser.add_argument('--switch', {
        action: 'store_true',
        help: 'HELPTEXT',
      });
      argparser.add_argument('--arguments', {
        nargs: '*',
        action: 'store',
        help: 'HELPTEXT',
      });
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code

    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async attach_link(args, subparsers?) {
    this.reconfigure(args);
    // public async attachLinkToItem(PARENT, URL, options: { title?: string, tags?: any } = { title: "Click to open", tags: [] }) {
    // ACTION: define CLI interface
    // TODO: There's a problem here... the following just offer docorations. We need to have inputs too...
    const decoration = {
      kerko_url: {
        title: '👀View item in Evidence Library',
        tags: ['_r:kerko', '_r:zotzen'],
      },
      kerko_site_url: {
        title: '👀View item in Evidence Library',
        tags: ['_r:kerko', '_r:zotzen'],
      },
      googledoc: {
        title: '📝View Google Doc and download alternative formats',
        tags: ['_r:googleDoc', '_r:zotzen'],
      },
      deposit: {
        title: '🔄View entry on Zenodo (deposit)',
        tags: ['_r:zenodoDeposit', '_r:zotzen'],
      },
      record: {
        title: '🔄View entry on Zenodo (record)',
        tags: ['_r:zenodoRecord', '_r:zotzen'],
      },
      doi: {
        title: '🔄Look up this DOI (once activated)',
        tags: ['_r:doi', '_r:zotzen'],
      },
      primarycollection: {
        title: '🆉View primary collection for this item',
        tags: ['_r:primary_collection', '_r:zotzen'],
      },
      collection: {
        title: '🆉View collection for this item',
        tags: ['_r:collection', '_r:zotzen'],
      },
    };
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('attach-link', {
        help: 'Utility function: attach a link to an item',
      });
      argparser.set_defaults({ func: this.attach_link.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'Required.xx',
      });
      argparser.add_argument('--url', {
        nargs: 1,
        action: 'store',
        help:
          'Provide a URL here and/or use the specific URL options below. If you use both --url and on of the options below, both will be added.',
      });
      argparser.add_argument('--update-url-field', {
        action: 'store_true',
        help:
          'Update/overwrite the url field of the item. The url used is --url (if set) or --kerko-link-key.',
      });
      argparser.add_argument('--title', {
        nargs: 1,
        action: 'store',
        help:
          'Optional. The options for specific URLs below can supply default titles.',
      });
      argparser.add_argument('--tags', {
        nargs: '*',
        action: 'store',
        help: 'Optional',
      });
      // TODO: There's a problem here... the following just offer docorations. We need to have inputs too...
      // This should probably just be the title used if there is no title, or --decorate is given.
      Object.keys(decoration).forEach((option) => {
        const extra_text =
          option === 'kerko_site_url'
            ? ' The item key will be added automatically.'
            : (
              option === 'kerko_url'
                ? ' You need to provide the full URL with the item key.'
                : ''
            );
        argparser.add_argument(`--${option}`, {
          nargs: 1,
          action: 'store',
          help: `Provide a specific URL for '${option}'.${extra_text} The prefix '${decoration[option].title
            }' will be added to a title (if provided) and the following tags are added: ${JSON.stringify(
              decoration[option].tags,
            )}`,
        });
      });
      // ... otherwise --id adds the three zenodo options, which otherwise are specified ...
      argparser.add_argument('--id', {
        nargs: 1,
        action: 'store',
        help:
          'Provide a Zenodo id to add links for Zenodo record, deposit and doi.',
      });
      argparser.add_argument('--zenodo', {
        action: 'store_true',
        help:
          'Determine Zenodo id from Zotero item and then add links for Zenodo record, deposit and doi.',
      });
      argparser.add_argument('--decorate', {
        action: 'store_true',
        help:
          "Optional 'decoration/default title prefix'. Without title, this is used anyway. But if you give a title, specify this option to have the prefix anyway.",
      });
      // ... individually
      // --zenodorecord
      // --zenododeposit
      // --doi
      // --kerko-url
      // --googledoc
      // .... ok... no... the url would give this... but... e.g. with kerko-url, the url given should be postfixed with the item...
      // with --zenodorecord... the zenodo-id should be obtained from the item if possible...
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // TODO: Make this consistent
    args.key = this.as_value(args.key);
    args.key = this.extractKeyAndSetGroup(args.key);
    args.title = this.as_value(args.title);
    const tags = [];
    if (args.tags) tags.push(args.tags);
    args.url = this.as_value(args.url);
    // console.log("attach", args.key, args.url, Array.isArray(args.tags))
    // console.log("TEMPORARY=" + JSON.stringify(args.tags, null, 2))
    var dataout = [];
    if (args.zenodo) {
      let xdoi = await this.get_doi(args);
      xdoi = 'x' + xdoi;
      const mymatch = xdoi.match(/zenodo\.(\d+)/);
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
        let title = this.as_value(decoration[option].title);
        let tags = decoration[option].tags;
        title = args.title ? title + ' ' + args.title : title;
        tags = args.tags ? tags.push(args.tags) : tags;
        const addkey =
          option === 'kerko_site_url' ? this.as_value(args.key) : '';
        // ACTION: run code
        const data = await this.attachLinkToItem(
          this.as_value(args.key),
          this.as_value(args[option]) + addkey,
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
        this.as_value(args.key),
        this.as_value(args.url),
        { title: this.as_value(args.title), tags: args.tags },
      );
      dataout.push({ url_based: datau });
    }
    if (args.update_url_field) {
      if (args.url || args.kerko_site_url) {
        const argx = {
          key: this.as_value(args.key),
          value: this.as_value(args.url)
            ? this.as_value(args.url)
            : this.as_value(args.kerko_site_url)
              ? this.as_value(args.kerko_site_url) + this.as_value(args.key)
              : '',
        };
        const datau = await this.update_url(argx);
        console.log('TEMPORARY...=' + JSON.stringify(datau, null, 2));

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

  public async field(args, subparsers?) {
    this.reconfigure(args);
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('field', {
        help: 'Utility function: Update a field for a specific item.',
      });
      argparser.set_defaults({ func: this.field.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be updated.',
      });
      argparser.add_argument('--field', {
        nargs: 1,
        action: 'store',
        help: 'The field to be updated',
      });
      argparser.add_argument('--value', {
        nargs: 1,
        action: 'store',
        help:
          'The value for the update (if not provided, the value of the field is shown).',
      });
      argparser.add_argument('--version', {
        nargs: 1,
        help:
          'You have to supply the version of the item via the --version argument or else the latest version will be used.',
      });
      return { status: 0, message: 'success' };
    }
    if (!args.field) {
      console.log('args.field is required.');
      process.exit(1);
    }
    args.fullresponse = false;
    let thisversion = '';
    let item;
    if (args.version) {
      thisversion = this.as_value(args.version);
    } else {
      item = await this.item(args);
      thisversion = item.version;
    }
    // const item = this.pruneData(response)
    const myobj = {};
    if (args.value) {
      myobj[args.field] = this.as_value(args.value);
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
  public async extra_append(args, subparsers?) {
    this.reconfigure(args);
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('extra-append', {
        help: 'HELPTEXT',
      });
      argparser.set_defaults({ func: this.extra_append.name });
      argparser.add_argument('--switch', {
        action: 'store_true',
        help: 'HELPTEXT',
      });
      argparser.add_argument('--arguments', {
        nargs: '*',
        action: 'store',
        help: 'HELPTEXT',
      });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code

    // ACTION: return values
    const data = {};
    return this.message(0, 'exit status', data);
    /*
  Implement: extra_append

    my $str = `./zotUpdateField.pl $thegroup --item $key --key extra | jq " .extra "`;

  my @extra ;
  if ($str =~ m/\S/s) {
      $str =~ s/\n$//s;
      $str =~ s/\"$//s;
      $str =~ s/^\"//s;
      @extra = split(/\\n/,$str);
  };

  push @extra, @t;

  my $string = shell_quote("\"" . join("\\n", @extra) . "\"");
  #print $string;

  say `./zotUpdateField.pl $thegroup  --item $key --key extra --value $string --update`;

    */
  }

  public async update_url(args, subparsers?) {
    this.reconfigure(args);
    // system("./zotUpdateField.pl --update --group $a --item $c --key url --value \"\\\"https://docs.opendeved.net/lib/$c\\\"\"");
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('update-url', {
        help: 'Utility function: Update the url for a specific item.',
      });
      argparser.set_defaults({ func: this.update_url.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be updated.',
      });
      argparser.add_argument('--value', {
        nargs: 1,
        action: 'store',
        help:
          'The value for the update (if not provided, the value of the field is shown).',
      });
      argparser.add_argument('--version', {
        nargs: 1,
        help:
          'You have to supply the version of the item via the --version argument or else the latest version will be used.',
      });
      return { status: 0, message: 'success' };
    }
    // args.field = "url"
    args.json = {
      url: args.value,
    };
    // console.log("TEMPORARY (update_url)="+JSON.stringify(   args         ,null,2))
    const update = await this.update_item(args);
    // console.log("TEMPORARY="+JSON.stringify( update           ,null,2))

    return update;
  }

  public async KerkoCiteItemAlsoKnownAs(args, subparsers?) {
    this.reconfigure(args);
    // system("./zotUpdateField.pl --update --group $a --item $c --key url --value \"\\\"https://docs.opendeved.net/lib/$c\\\"\"");
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('kciaka', {
        help: 'Utility function: View/merge - extra>Kerko.CiteItemAlsoKnownAs.',
      });
      argparser.set_defaults({ func: this.KerkoCiteItemAlsoKnownAs.name });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help: 'The Zotero item key for the item to be updated.',
      });
      argparser.add_argument('--add', {
        nargs: '*',
        action: 'store',
        help:
          'The value for the update (if not provided, the value of the field is shown).',
      });
      return { status: 0, message: 'success' };
    }
    args.fullresponse = false;
    let thisversion = '';
    let item;
    item = await this.item(args);
    thisversion = item.version;
    // const item = this.pruneData(response)
    //  console.log("TEMPORARY="+JSON.stringify(     item       ,null,2))

    var extra = item.extra;
    var extraarr = extra.split('\n');

    // console.log("TEMPORARY=" + JSON.stringify(thisversion, null, 2))
    // console.log("TEMPORARY=" + JSON.stringify(extraarr, null, 2))

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
      args.add = this.as_array(args.add);
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
  public async getbib(args, subparsers?) {
    this.reconfigure(args);
    // my($gp, $collRefs) = @_;
    // return `zotero-cli --group $gp items --collection $collRefs --filter "{\\\"format\\\": \\\"json\\\", \\\"include\\\": \\\"data,bib\\\", \\\"style\\\": \\\"apa\\\"}" `;
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('bibliography', {
        help: 'Get bibliography',
      });
      argparser.add_argument('--key', {
        nargs: 1,
        action: 'store',
        help:
          'A Zotero item key for the item for which the bib is obtained. Can be provided in zotero://select format.',
      });
      argparser.add_argument('--keys', {
        nargs: 1,
        action: 'store',
        help:
          'A Zotero item key for the item for which the bib is obtained. Can be provided as list ABC,DEF,...',
      });
      argparser.add_argument('--group', {
        nargs: 1,
        action: 'store',
        help:
          'If you use --keys, use --group to specify the group.',
      });
      argparser.add_argument('--groupkeys', {
        nargs: 1,
        action: 'store',
        help:
          'The Zotero item key for the item for which the bib is obtained. Unlike other functions, this is a string of the format 1234567:ABCDEFGH,1234567:ABCDEFGH,...',
      });
      argparser.add_argument('--xml', {
        action: 'store_true',
        help:
          'The default is for this function to return xml/html (wrapped in json). Use this switch to only return the xml.',
      });
      argparser.add_argument('--json', {
        action: 'store_true',
        help:
          'The default is for this function to return xml/html (wrapped in json). Use this switch to convert the xml to json.',
      });
      argparser.add_argument('--zgroup', {
        nargs: 1,
        action: 'store',
        help: 'Source group (added to links)',
      });
      argparser.add_argument('--zkey', {
        nargs: 1,
        action: 'store',
        help: 'Source key (added to links)',
      });
      argparser.add_argument('--openinzotero', {
        action: 'store_true',
        help: 'Target zotero app (added to links)',
      });
      argparser.add_argument('--test', {
        action: 'store_true',
        help:
          'Text xml to json conversion ref-by-ref. Helpful for debugging the xml to json conversion.',
      });
      argparser.set_defaults({ func: this.getbib.name });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code
    let output;
    try {
      output = await this.getZoteroDataX(args);
    } catch (e) {
      return this.catchme(2, 'caught error in getZoteroDataX', e, null);
    }
    // ACTION: return values

    if (args.xml) {
      console.log(output.data);
      return output
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
    /*
    const evlib = {
  2129771: "https://docs.opendeved.net/lib/",
  2405685: "https://docs.edtechhub.org/lib/"
  } */
    // console.log("TEMPORARY=" + JSON.stringify(fullresponse, null, 2))

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
            this.getCanonicalURL(args, element) +
            (element.data.rights &&
              element.data.rights.match(/Creative Commons/)
              ? ' Available under ' + he.encode(element.data.rights) + '.'
              : '') +
            this.colophon(element.data.extra)
            +
            ' (' +
            this.urlify(
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
        return this.catchme(2, 'caught error in response', e, response);
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
            outputstr = this.catchme(
              2,
              'caught error in convert.xml2json',
              e,
              xml,
            );
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
          message: this.isomessage('error: no response'),
          duration: n,
          data: fullresponse,
        },
        null,
        2,
      );
    }
    // return xml
  }

  private colophon(string) {
    let colophon = ""
    const match = string.match(/Colophon: (.*?)\n/)
    if (match) {
      colophon = " " + match[1]
    }
    return colophon
  }

  private urlify(
    details,
    elementlibraryid,
    elementkey,
    argszgroup,
    argszkey,
    argsopeninzotero,
  ) {
    return `<a href="https://ref.opendeved.net/zo/zg/${elementlibraryid}/7/${elementkey}/NA?${argszgroup || argszkey ? `src=${argszgroup}:${argszkey}&` : ''
      }${argsopeninzotero ? 'openin=zotero' : ''}">${details}</a>`;
  }

  private getCanonicalURL(args, element) {
    let url = '';
    url =
      element.data.url != '' && !element.bib.match(element.data.url)
        ? ` Available from <a href="${he.encode(element.data.url)}">${he.encode(
          element.data.url,
        )}</a>.`
        : '';
    url = element.data.url.match(/docs.edtechhub.org|docs.opendeved.net/)
      ? ' (' +
      this.urlify(
        element.data.url,
        element.library.id,
        element.key,
        args.zgroup,
        args.zkey,
        args.openinzotero,
      ) +
      ')'
      : url;
    return url;
  }

  async makeZoteroQuery(arg) {
    var response = [];
    console.log("hello")
    // The limit is 25 results at a time - so need to check that arg.keys is not too long.
    let allkeys = []
    if (arg.key) {
      allkeys.push(arg.key)
    }
    console.log("hello")
    if (arg.keys) {
      const arr = this.as_value(arg.keys).split(',')
      allkeys.push(arr)
    }
    console.log(`allkeys ${allkeys}`)
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
      args.groupkeys = this.as_value(args.groupkeys);
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
      // console.log("TEMPORARY="+JSON.stringify(   [zotgroup, zotkeys]         ,null,2))
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
    // console.log("TEMPORARY=" + JSON.stringify(output, null, 2))
    return output;
  }

  private catchme(number, text, error, data) {
    return JSON.stringify(
      {
        status: number,
        message: this.isomessage(text),
        error: error.toString(),
        data,
      },
      null,
      2,
    );
  }

  private isomessage(text) {
    var d = new Date();
    var n = d.toISOString();
    return text + '; on ' + n;
  }

  /* END FUcntionS FOR GETBIB */

  // TODO: Implement
  public async attach_note(args, subparsers?) {
    this.reconfigure(args);
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('attach-note', {
        help: 'Utility function: Attach note to item',
      });
      argparser.set_defaults({ func: this.attach_note.name });
      argparser.add_argument('--key', {
        action: 'store',
        nargs: 1,
        help: 'The item key to which the note is attached.',
      });
      // TODO: Allow file argument (html file)
      /*argparser.add_argument("--file", {
        "action": "store_true",
        "help": "HELPTEXT"
      }); */
      argparser.add_argument('--notetext', {
        action: 'store',
        nargs: 1,
        help: 'The text of the note',
      });
      argparser.add_argument('--notefile', {
        action: 'store',
        nargs: 1,
        help: 'The text of the note',
      });
      argparser.add_argument('--tags', {
        nargs: '*',
        action: 'store',
        help: 'Tags to be attached to the note',
      });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    args.notetext = this.as_value(args.notetext);
    args.key = this.extractKeyAndSetGroup(this.as_value(args.key));
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

  /*
  // TODO: Implement
  public async createSubCollections(parent_key, group_id, child_name) {
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser("createSubCollections", { "help": "HELPTEXT" });
      argparser.set_defaults({ "func": this.createSubCollections.name });
      argparser.add_argument("--switch", {
        "action": "store_true",
        "help": "HELPTEXT"
      });
      argparser.add_argument("--arguments", {
        "nargs": "*",
        "action": "store",
        "help": "HELPTEXT"
      });
    }
    // ACTION: check arguments
    if (args.switch) {

    }
    if (args.arguments) {

    }
    // ACTION: run code
    const data = this.collections({group_id: group_id, key: parent_key, create_child: child_name})
    // `zotero-cli --group-id $group collections --key $parent --create-child $string`;
    // ACTION: return values
    return this.message(0, "exist status", data)
  }
  */

  // TODO: Implement
  public async getValue(args, subparsers?) {
    this.reconfigure(args);
    /*
    sub itemGetField() {
      my($gp, $pkey, $field) = @_;
      if (!$field) {
        $field = "title";
      };
      my $coll = `zotero-cli --group $gp item --key $pkey`;
      $coll =  & jq(".data", $coll);
      my $oname = & jqx(".$field", $coll);
      return $oname;
    };
    */
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('getValue', { help: 'HELPTEXT' });
      argparser.set_defaults({ func: this.getValue.name });
      argparser.add_argument('--switch', {
        action: 'store_true',
        help: 'HELPTEXT',
      });
      argparser.add_argument('--arguments', {
        nargs: '*',
        action: 'store',
        help: 'HELPTEXT',
      });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code

    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async collectionName(args, subparsers?) {
    this.reconfigure(args);
    /* sub collectionName() {
       my($gp, $key) = @_;
       my $coll = `zotero-cli --group $gp collection --key $key`;
       $coll =  & jq(".data", $coll);
  #    say "collectionName";
  #    say $coll;
       my $oname = & jqx(".name", $coll);
     #my $oparent = & jqx(".parentCollection", $coll);
       return $oname;
     }; */
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('collectionName', {
        help: 'HELPTEXT',
      });
      argparser.set_defaults({ func: this.collectionName.name });
      argparser.add_argument('--switch', {
        action: 'store_true',
        help: 'HELPTEXT',
      });
      argparser.add_argument('--arguments', {
        nargs: '*',
        action: 'store',
        help: 'HELPTEXT',
      });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code

    // ACTION: return values
    const data = {};
    return this.message(0, 'exist status', data);
  }

  // TODO: Implement
  public async amendCollection(args, subparsers?) {
    this.reconfigure(args);
    // ACTION: define CLI interface
    if (args.getInterface && subparsers) {
      const argparser = subparsers.add_parser('amendCollection', {
        help: 'HELPTEXT',
      });
      argparser.set_defaults({ func: this.amendCollection.name });
      argparser.add_argument('--switch', {
        action: 'store_true',
        help: 'HELPTEXT',
      });
      argparser.add_argument('--arguments', {
        nargs: '*',
        action: 'store',
        help: 'HELPTEXT',
      });
      return { status: 0, message: 'success' };
    }
    // ACTION: check arguments
    // if (args.switch) {
    // }
    // if (args.arguments) {
    // }
    // ACTION: run code

    // ACTION: return values
    const data = {};
    return this.message(0, 'exit status', data);
    /*
    sub amendCollection() {
      my($gp, $key, $parent, $top, $name, $prefix, $append) = @_;
      my $coll = `zotero-cli --group $gp collection --key $key`;
      $coll =  & jq(".data", $coll);
  #    say $coll;

      my $oname = & jqx(".name", $coll);
      my $oparent = & jqx(".parentCollection", $coll);

    # A name must always be provided.
        if($name) {
  #    $name = qq{, "name": "$name" };
      } else {
        $name = $oname;
      };

      if ($prefix) {
        $name = $prefix.$name;
      }

      if ($append) {
        $name = $name.$append;
      }

      $name = qq{, "name": "$name" };

      if ($parent) {
        $parent = qq{, "parentCollection": "$parent" };
      } else {
        $parent = qq{, "parentCollection": "$oparent" };
      };

    # If no parent is provided, the collection is moved to the top level:
      if ($top) {
        $parent = "";
      }

      my $command = qq < zotero - cli--group $gp put / collections / $key--data '{"version": >
        .& jqx(".version", $coll)
          .qq < $name $parent
    } '>;
    say $command;
    say`$command`;

    my $coll2 = `zotero-cli --group $gp collection --key $key`;
    $coll2 =  & jq(".data", $coll);
    say "Result:";
    say $coll;
    };
    */
  }

  /**
   *  Command Line Interface
   *
   */
  public async commandlineinterface() {
    // --- main ---
    var args = this.getArguments();
    // const zotero = new Zotero()
    if (args.version) {
      this.getVersion();
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

      if (args.verbose) this.showConfig();
      // call the actual command
      if (!args.func) {
        console.log('No arguments provided. Use -h for help.');
        process.exit(0);
      }
      try {
        // await this['$' + args.command.replace(/-/g, '_')]()
        // await this[args.command.replace(/-/g, '_')]()
        if (args.verbose) console.log('ARGS=' + JSON.stringify(args, null, 2));
        let result = await this[args.func](args);
        if (args.xmp) {
          result = formatAsXMP(result);
        }
        if (args.verbose) {
          const myout = {
            result,
            output: this.output,
          };
          console.log(
            '{Result, output}=' +
            JSON.stringify(myout, null, this.config.indent),
          );
        }

        if (args.out) {
          logger.info(`writing output to file ${args.out}`);
          fs.writeFileSync(
            args.out,
            JSON.stringify(result, null, this.config.indent),
          );
        } else {
          logger.info(`writing output to console`);
          console.log(printJSON(result));
        }
      } catch (ex) {
        this.print('Command execution failed: ', ex);
        process.exit(1);
      }
    }
  }

  // local functions
  getVersion() {
    const pjson = require('../package.json');
    if (pjson.version) console.log(`zenodo-lib version=${pjson.version}`);
    return pjson.version;
  }

  getArguments() {
    const parser = new ArgumentParser({
      description: 'Zotero command line utility',
    });
    parser.add_argument('--api-key', {
      help: 'The API key to access the Zotero API.',
    });
    parser.add_argument('--config', {
      type: parser.file,
      help:
        'Configuration file (toml format). Note that ./zotero-cli.toml and ~/.config/zotero-cli/zotero-cli.toml is picked up automatically.',
    });
    parser.add_argument('--config-json', {
      type: parser.string,
      help: 'Configuration string in json format.',
    });
    parser.add_argument('--user-id', {
      type: parser.integer,
      help: 'The id of the user library.',
    });
    parser.add_argument('--group-id', {
      action: 'store',
      type: parser.integer,
      help: 'The id of the group library.',
    });
    // See below. If changed, add: You can provide the group-id as zotero-select link (zotero://...). Only the group-id is used, the item/collection id is discarded.
    parser.add_argument('--indent', {
      type: parser.integer,
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

    this.item({ getInterface: true }, subparsers);
    this.items({ getInterface: true }, subparsers);
    this.create_item({ getInterface: true }, subparsers);
    this.update_item({ getInterface: true }, subparsers);
    this.collection({ getInterface: true }, subparsers);
    this.collections({ getInterface: true }, subparsers);
    this.publications({ getInterface: true }, subparsers);
    this.tags({ getInterface: true }, subparsers);

    this.attachment({ getInterface: true }, subparsers);
    this.types({ getInterface: true }, subparsers);
    this.groups({ getInterface: true }, subparsers);
    this.fields({ getInterface: true }, subparsers);

    this.searches({ getInterface: true }, subparsers);
    this.key({ getInterface: true }, subparsers);

    // Utility functions
    this.field({ getInterface: true }, subparsers);
    this.update_url({ getInterface: true }, subparsers);
    this.get_doi({ getInterface: true }, subparsers);
    this.update_doi({ getInterface: true }, subparsers);
    this.enclose_item_in_collection({ getInterface: true }, subparsers);
    this.attach_link({ getInterface: true }, subparsers);
    this.attach_note({ getInterface: true }, subparsers);
    this.KerkoCiteItemAlsoKnownAs({ getInterface: true }, subparsers);
    this.getbib({ getInterface: true }, subparsers);

    // Functions for get, post, put, patch, delete. (Delete query to API with uri.)
    this.__get({ getInterface: true }, subparsers);
    this.__post({ getInterface: true }, subparsers);
    this.__put({ getInterface: true }, subparsers);
    this.__patch({ getInterface: true }, subparsers);
    this.__delete({ getInterface: true }, subparsers);

    // Other URLs
    // https://www.zotero.org/support/dev/web_api/v3/basics
    // /keys/<key>
    // /users/<userID>/groups

    // parser.set_defaults({ "func": new Zotero().run() });
    // this.parser.parse_args();

    return parser.parse_args();
  }
}

export = Zotero;
