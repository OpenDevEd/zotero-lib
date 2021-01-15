#!/usr/bin/env node

require('dotenv').config();
require('docstring');
const os = require('os');

// import { ArgumentParser } from 'argparse'
const { ArgumentParser } = require('argparse');
const toml = require('@iarna/toml');
const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const { LinkHeader } = require('http-link-header');
const Ajv = require('ajv');
const { parse } = require("args-any");


/*
TO DO: 
module.exports...
*/

/*
TODO: Check this compiles. package.json / tsconfig will need to be adjusted.
*/


// import { parse as TOML } from '@iarna/toml'
// import fs = require('fs')
// import path = require('path')

// import request = require('request-promise')
// import * as LinkHeader from 'http-link-header'

// import Ajv = require('ajv')
const ajv = new Ajv()

const md5 = require('md5-file')

function sleep(msecs) {
  return new Promise(resolve => setTimeout(resolve, msecs))
}

const arg = new class {
  integer(v) {
    if (isNaN(parseInt(v))) throw new Error(`${JSON.stringify(v)} is not an integer`)
    return parseInt(v)
  }

  file(v) {
    if (!fs.existsSync(v) || !fs.lstatSync(v).isFile()) throw new Error(`${JSON.stringify(v)} is not a file`)
    return v
  }

  path(v) {
    if (!fs.existsSync(v)) throw new Error(`${JSON.stringify(v)} does not exist`)
    return v
  }

  json(v) {
    return JSON.parse(v)
  }
}


module.exports = class Zotero {

  args: any
  config: any
  base = "https://api.zotero.org"
  output: string = ''
  headers = {
    'User-Agent': 'Zotero-CLI',
    'Zotero-API-Version': '3',
    'Zotero-API-Key': ''
  }

  // constructor...
  constructor(args) {
    this.args = args
    // Read config (which also sets the Zotero-API-Key value in the header)
    const message = this.readConfig(args)
    if (message["status"] == "success") {

    }
  }

  // zotero: any

  public async readConfig(args) {
    // pick up config: The function reads args and populates config
    /* 
    Called during initialisation.

    INPUT:

    args = {
      config: "zotero-lib.toml"
    }

    or

    args = {
      user-id: "XXX",
      group-id: "123",
      library-type: "group",
      indent = 4,
      api-key: "XXX"
    } 

    OUTPUT:

    this.config = {
      user-id: "XXX",
      group-id: "123",
      library-type: "group",
      indent = 4,
      api-key: "XXX"
    }
    */

    this.args = args

    const config: string = [this.args.config, 'zotero-cli.toml', `${os.homedir()}/.config/zotero-cli/zotero-cli.toml`].find(cfg => fs.existsSync(cfg))
    this.config = config ? toml.parse(fs.readFileSync(config, 'utf-8')) : {}

    // Make - to _
    if (this.config['user-id']) {
      this.config.user_id = this.config['user-id']
    }
    delete this.config['user-id']
    // Make - to _
    if (this.config['group-id']) {
      this.config.group_id = this.config['group-id']
    }
    delete this.config['group-id']
    // Overwrite config with values from args    
    if (this.args.user_id) {
      this.config.user_id = this.args.user_id
    }
    if (this.args.group_id) {
      this.config.group_id = this.args.group_id
    }

    // Make - to _
    if (this.config['api-key']) {
      this.config.api_key = this.config['api-key']
    }
    delete this.config['api-key']
    if (this.args.api_key) {
      this.config.api_key = this.args.api_key
    }
    if (this.config.api_key) {
      this.headers['Zotero-API-Key'] = this.config.api_key
    } else {
      return this.message('No API key provided in args or config')
    }

    console.log(JSON.stringify(this.config, null, 2))
    // Check that one  and only one is defined:
    if (this.config.user_id === null && this.config.group_id === null) return this.message('Both user/group are null. You must provide exactly one of --user-id or --group-id')
    // TODO
    // if (this.config.user_id !== null && this.config.group_id !== null) return this.message('Both user/group are specified. You must provide exactly one of --user-id or --group-id')
    // user_id==0 is generic; retrieve the real user id via the api_key
    if (this.config.user_id === 0) this.config.user_id = (await this.get(`/keys/${this.args.api_key}`, { userOrGroupPrefix: false })).userID

    // using default=2 above prevents the overrides from being picked up
    if (this.args.indent === null) this.args.indent = 2

    return this.message("success")
  }

  async showConfig() {
    console.log(JSON.stringify(this.config, null, 2))
  }

  async message(msg) {
    return { "status": msg }
  }

  finalActions() {
    if (this.args.out) fs.writeFileSync(this.args.out, this.output)
    if (this.args.show) console.log(this.output)
  }

  // library starts.
  public print(...args: any[]) {
    if (!this.args.out) {
      console.log.apply(console, args)
    } else {
      this.output += args.map(m => {
        const type = typeof m

        if (type === 'string' || m instanceof String || type === 'number' || type === 'undefined' || type === 'boolean' || m === null) return m

        if (m instanceof Error) return `<Error: ${m.message || m.name}${m.stack ? `\n${m.stack}` : ''}>`

        if (m && type === 'object' && m.message) return `<Error: ${m.message}#\n${m.stack}>`

        return JSON.stringify(m, null, this.args.indent)

      }).join(' ') + '\n'
    }
  }

  // Function to get more than 100 records, i.e. chunked retrieval.
  async all(uri, params = {}) {
    let chunk = await this.get(uri, { resolveWithFullResponse: true, params })
    let data = chunk.body

    let link = chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next')
    while (link && link.length && link[0].uri) {
      if (chunk.headers.backoff) await sleep(parseInt(chunk.headers.backoff) * 1000)

      chunk = await request({
        uri: link[0].uri,
        headers: this.headers,
        json: true,
        resolveWithFullResponse: true,
      })
      data = data.concat(chunk.body)
      link = chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next')
    }
    return data
  }

  // The Zotero API uses several commands: get, post, patch, delete - these are defined below.
  async get(uri, options: { userOrGroupPrefix?: boolean, params?: any, resolveWithFullResponse?: boolean, json?: boolean } = {}) {
    if (typeof options.userOrGroupPrefix === 'undefined') options.userOrGroupPrefix = true
    if (typeof options.params === 'undefined') options.params = {}
    if (typeof options.json === 'undefined') options.json = true

    let prefix = ''
    if (options.userOrGroupPrefix) prefix = this.args.user_id ? `/users/${this.args.user_id}` : `/groups/${this.args.group_id}`

    const params = Object.keys(options.params).map(param => {
      let values = options.params[param]
      if (!Array.isArray(values)) values = [values]
      return values.map(v => `${param}=${encodeURI(v)}`).join('&')
    }).join('&')

    uri = `${this.base}${prefix}${uri}${params ? '?' + params : ''}`
    if (this.args.verbose) console.error('GET', uri)

    return request({
      uri,
      headers: this.headers,
      encoding: null,
      json: options.json,
      resolveWithFullResponse: options.resolveWithFullResponse,
    })
  }

  async post(uri, data, headers = {}) {
    const prefix = this.config.user_id ? `/users/${this.config.user_id}` : `/groups/${this.config.group_id}`

    uri = `${this.base}${prefix}${uri}`
    if (this.args.verbose) console.error('POST', uri)

    return request({
      method: 'POST',
      uri,
      headers: { ...this.headers, 'Content-Type': 'application/json', ...headers },
      body: data,
    })
  }

  async put(uri, data) {
    const prefix = this.args.user_id ? `/users/${this.args.user_id}` : `/groups/${this.args.group_id}`

    uri = `${this.base}${prefix}${uri}`
    if (this.args.verbose) console.error('PUT', uri)

    return request({
      method: 'PUT',
      uri,
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: data,
    })
  }

  async patch(uri, data, version?: number) {
    const prefix = this.args.user_id ? `/users/${this.args.user_id}` : `/groups/${this.args.group_id}`

    const headers = { ...this.headers, 'Content-Type': 'application/json' }
    if (typeof version !== 'undefined') headers['If-Unmodified-Since-Version'] = version

    uri = `${this.base}${prefix}${uri}`
    if (this.args.verbose) console.error('PATCH', uri)

    return request({
      method: 'PATCH',
      uri,
      headers,
      body: data,
    })
  }

  async delete(uri, version?: number) {
    const prefix = this.args.user_id ? `/users/${this.args.user_id}` : `/groups/${this.args.group_id}`

    const headers = { ...this.headers, 'Content-Type': 'application/json' }
    if (typeof version !== 'undefined') headers['If-Unmodified-Since-Version'] = version

    uri = `${this.base}${prefix}${uri}`
    if (this.args.verbose) console.error('DELETE', uri)

    return request({
      method: 'DELETE',
      uri,
      headers,
    })
  }
  // End of standard API calls


  // Utility functions. private?
  async count(uri, params = {}) {
    return (await this.get(uri, { resolveWithFullResponse: true, params })).headers['total-results']
  }

  show(v) {
    // this.print(JSON.stringify(v, null, this.args.indent).replace(new RegExp(this.args.api_key, 'g'), '<API-KEY>'))
    this.print(JSON.stringify(v, null, this.args.indent))
  }

  extractKeyAndSetGroup(key) {
    // zotero://select/groups/(\d+)/(items|collections)/([A-Z01-9]+)
    var out = key;
    var res = key.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/)
    if (res) {
      if (res[2] == "library") {
        console.log('You cannot specify zotero-select links (zotero://...) to select user libraries.')
        return
      } else {
        // console.log("Key: zotero://-key provided for "+res[2]+" Setting group-id.")
        this.args.group_id = res[1]
        out = res[3]
      };
    }
    return out
  }

  /// THE COMMANDS --> public
  // The following functions define key API commands: /keys, /collection, /collections, etc.

  // https://www.zotero.org/support/dev/web_api/v3/basics
  // Collections
  // <userOrGroupPrefix>/collections	Collections in the library
  // <userOrGroupPrefix>/collections/top	Top-level collections in the library
  // <userOrGroupPrefix>/collections/<collectionKey>	A specific collection in the library
  // <userOrGroupPrefix>/collections/<collectionKey>/collections	Subcollections within a specific collection in the library

  // TODO: --create-child should go into 'collection'.


  // zotero-cli, 
  // If I call $collections(subparser) -> add options to subparser
  // $collections(null) -> perform cllections action (using args)
  //async $collections(argparser = null) {
  public async $collections(args) {
    this.args = args
    /* Retrieve a list of collections or create a collection. (API: /collections, /collections/top, /collections/<collectionKey>/collections). Use 'collections --help' for details. */
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--top', { action: 'storeTrue', help: 'Show only collection at top level.' })
      args.argparser.addArgument('--key', { help: 'Show all the child collections of collection with key. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' })
      args.argparser.addArgument('--create-child', { nargs: '*', help: 'Create child collections of key (or at the top level if no key is specified) with the names specified.' })
      return
      /*
      The above means that I can call:
      args.argparser = new argparser
      Zotero.$collections(args)
      Zotero.$collection(args)
      Zotero.$items(args)
      Zotero.$item(args)
      */
    }
    // Provide guidance to the user:  This function requires:
    // args.key (string, required) 
    // args.top (boolean, optional)
    // args.create_child (string, optional)
    // perform tests: args.key
    if (this.args.key) {
      this.args.key = this.extractKeyAndSetGroup(this.args.key)
    }
    else {
      return this.message('Unable to extract group/key from the string provided.')
    }
    // perform test: args.create_child
    // If create_child=true, then create the child and exit.
    if (this.args.create_child) {
      const response = await this.post('/collections',
        JSON.stringify(this.args.create_child.map(c => { return { name: c, parentCollection: this.args.key } })))
      //this.print('Collections created: ', JSON.parse(response).successful)
      return JSON.parse(response).successful
    } else {
      // test for args.top: Not required.

      // If create_child==false:
      let collections = null;
      if (this.args.key) {
        collections = await this.all(`/collections/${this.args.key}/collections`)
      } else {
        collections = await this.all(`/collections${this.args.top ? '/top' : ''}`)
      }
      this.show(collections)
      return JSON.parse(collections).successful
    }
  }

  // Operate on a specific collection.
  // <userOrGroupPrefix>/collections/<collectionKey>/items	Items within a specific collection in the library
  // <userOrGroupPrefix>/collections/<collectionKey>/items/top	Top-level items within a specific collection in the library

  // TODO: --create-child should go into 'collection'.
  // DONE: Why is does the setup for --add and --remove differ? Should 'add' not be "nargs: '*'"? Remove 'itemkeys'?
  // TODO: Add option "--output file.json" to pipe output to file.

  async $collection(argparser = null) {
    /** 
  Retrieve information about a specific collection --key KEY (API: /collections/KEY or /collections/KEY/tags). Use 'collection --help' for details.   
  (Note: Retrieve items is a collection via 'items --collection KEY'.)
     */
    /*
      if (argparser) {
        argparser.addArgument('--key', { required: true, help: 'The key of the collection (required). You can provide the key as zotero-select link (zotero://...) to also set the group-id.' })
        argparser.addArgument('--tags', { action: 'storeTrue', help: 'Display tags present in the collection.' })
        // argparser.addArgument('itemkeys', { nargs: '*' , help: 'Item keys for items to be added or removed from this collection.'})
        argparser.addArgument('--add', { nargs: '*', help: 'Add items to this collection. Note that adding items to collections with \'item --addtocollection\' may require fewer API queries. (Convenience method: patch item->data->collections.)' })
        argparser.addArgument('--remove', { nargs: '*', help: 'Convenience method: Remove items from this collection. Note that removing items from collections with \'item --removefromcollection\' may require fewer API queries. (Convenience method: patch item->data->collections.)' })
        return
      }
  
      */

    if (this.args.key) {
      this.args.key = this.extractKeyAndSetGroup(this.args.key)

    }

    else {
      const msg = this.message('Unable to extract group/key from the string provided.')
      return msg
    }

    if (this.args.tags && this.args.add) {
      const msg = this.message('--tags cannot be combined with --add')
      return msg
    }
    if (this.args.tags && this.args.remove) {
      const msg = this.message('--tags cannot be combined with --remove')
      return msg
    }
    /*
    if (this.args.add && !this.args.itemkeys.length) {
      const msg = this.message('--add requires item keys')
      return msg
    }
    if (!this.args.add && this.args.itemkeys.length) {
      const msg = this.message('unexpected item keys')
      return msg
    }
    */
    if (this.args.add) {
      for (const itemKey of this.args.add) {
        const item = await this.get(`/items/${itemKey}`)
        if (item.data.collections.includes(this.args.key)) continue
        await this.patch(`/items/${itemKey}`, JSON.stringify({ collections: item.data.collections.concat(this.args.key) }), item.version)
      }
    }

    if (this.args.remove) {
      for (const itemKey of this.args.remove) {
        const item = await this.get(`/items/${itemKey}`)
        const index = item.data.collections.indexOf(this.args.key)
        if (index > -1) {
          item.data.collections.splice(index, 1)
        }
        await this.patch(`/items/${itemKey}`, JSON.stringify({ collections: item.data.collections }), item.version)
      }
    }

    this.show(await this.get(`/collections/${this.args.key}${this.args.tags ? '/tags' : ''}`))
  }

  // URI	Description
  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/items	All items in the library, excluding trashed items
  // <userOrGroupPrefix>/items/top	Top-level items in the library, excluding trashed items
  async reReadConfig(args) {
    this.readConfig(args)
  }

  async $items(args) {
    /** 
  Retrieve list of items from API. (API: /items, /items/top, /collections/COLLECTION/items/top). 
  Use 'items --help' for details. 
  By default, all items are retrieved. With --top or limit (via --filter) the default number of items are retrieved. 
    */
    let items
    this.args = args
    this.reReadConfig(args)
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--count', { action: 'storeTrue', help: 'Return the number of items.' })
      // argparser.addArgument('--all', { action: 'storeTrue', help: 'obsolete' })
      args.argparser.addArgument('--filter', { type: arg.json, help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. For example: \'{"format": "json,bib", "limit": 100, "start": 100}\'.' })
      args.argparser.addArgument('--collection', { help: 'Retrive list of items for collection. You can provide the collection key as a zotero-select link (zotero://...) to also set the group-id.' })
      args.argparser.addArgument('--top', { action: 'storeTrue', help: 'Retrieve top-level items in the library/collection (excluding child items / attachments, excluding trashed items).' })
      args.argparser.addArgument('--validate', { type: arg.path, help: 'json-schema file for all itemtypes, or directory with schema files, one per itemtype.' })
      return
    }

    if (this.args.count && this.args.validate) {
      const msg = this.message('--count cannot be combined with --validate')
      return msg
    }

    if (this.args.collection) {
      this.args.collection = this.extractKeyAndSetGroup(this.args.collection)
      if (!this.args.collection) {
        const msg = this.message('Unable to extract group/key from the string provided.')
        return msg
      }
    }

    const collection = this.args.collection ? `/collections/${this.args.collection}` : ''

    if (this.args.count) {
      this.print(await this.count(`${collection}/items${this.args.top ? '/top' : ''}`, this.args.filter || {}))
      return
    }

    const params = this.args.filter || {}

    if (this.args.top) {
      // This should be all - there may be more than 100 items.
      // items = await this.all(`${collection}/items/top`, { params })
      items = await this.all(`${collection}/items/top`, params)
    } else if (params.limit) {
      if (params.limit > 100) {
        const msg = this.message('You can only retrieve up to 100 items with with params.limit.')
        return msg
      }
      items = await this.get(`${collection}/items`, { params })
    } else {
      items = await this.all(`${collection}/items`, params)
    }

    if (this.args.validate) {
      if (!fs.existsSync(this.args.validate)) throw new Error(`${this.args.validate} does not exist`)

      const oneSchema = fs.lstatSync(this.args.validate).isFile()

      let validate = oneSchema ? ajv.compile(JSON.parse(fs.readFileSync(this.args.validate, 'utf-8'))) : null

      const validators = {}
      // still a bit rudimentary
      for (const item of items) {
        if (!oneSchema) {
          validate = validators[item.itemType] = validators[item.itemType] || ajv.compile(JSON.parse(fs.readFileSync(path.join(this.args.validate, `${item.itemType}.json`), 'utf-8')))
        }

        if (!validate(item)) this.show(validate.errors)
      }

    } else {
      this.show(items)
    }
    return items
  }

  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/items/<itemKey>	A specific item in the library
  // <userOrGroupPrefix>/items/<itemKey>/children	Child items under a specific item

  async $item(args) {
    /** 
  Retrieve an item (item --key KEY), save/add file attachments, retrieve children. Manage collections and tags. (API: /items/KEY/ or /items/KEY/children). 
   
  Also see 'attachment', 'create' and 'update'.
    */
    this.args = args
    this.reReadConfig(args)
    // $item({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' })
      args.argparser.addArgument('--children', { action: 'storeTrue', help: 'Retrieve list of children for the item.' })
      args.argparser.addArgument('--filter', { type: arg.json, help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. To retrieve multiple items you have use "itemkey"; for example: \'{"format": "json,bib", "itemkey": "A,B,C"}\'. See https://www.zotero.org/support/dev/web_api/v3/basics#search_syntax.' })
      args.argparser.addArgument('--addfile', { nargs: '*', help: 'Upload attachments to the item. (/items/new)' })
      args.argparser.addArgument('--savefiles', { nargs: '*', help: 'Download all attachments from the item (/items/KEY/file).' })
      args.argparser.addArgument('--addtocollection', { nargs: '*', help: 'Add item to collections. (Convenience method: patch item->data->collections.)' })
      args.argparser.addArgument('--removefromcollection', { nargs: '*', help: 'Remove item from collections. (Convenience method: patch item->data->collections.)' })
      args.argparser.addArgument('--addtags', { nargs: '*', help: 'Add tags to item. (Convenience method: patch item->data->tags.)' })
      args.argparser.addArgument('--removetags', { nargs: '*', help: 'Remove tags from item. (Convenience method: patch item->data->tags.)' })
      return
    }

    if (this.args.key) {
      this.args.key = this.extractKeyAndSetGroup(this.args.key)
      if (!this.args.key) {
        const msg = this.message('Unable to extract group/key from the string provided.')
        return msg
      }
    }

    const item = await this.get(`/items/${this.args.key}`)

    if (this.args.savefiles) {
      let children = await this.get(`/items/${this.args.key}/children`);
      await Promise.all(children.filter(item => item.data.itemType === 'attachment').map(async item => {
        if (item.data.filename) {
          console.log(`Downloading file ${item.data.filename}`)
          fs.writeFileSync(item.data.filename, await this.get(`/items/${item.key}/file`), 'binary')
        } else {
          console.log(`Not downloading file ${item.key}/${item.data.itemType}/${item.data.linkMode}/${item.data.title}`)
        }
      }))
    }

    if (this.args.addfile) {
      const attachmentTemplate = await this.get('/items/new?itemType=attachment&linkMode=imported_file', { userOrGroupPrefix: false })
      for (const filename of this.args.addfile) {
        if (!fs.existsSync(filename)) {
          console.log(`Ignoring non-existing file: ${filename}`);
          return
        }

        let attach = attachmentTemplate;
        attach.title = path.basename(filename)
        attach.filename = path.basename(filename)
        attach.contentType = `application/${path.extname(filename).slice(1)}`
        attach.parentItem = this.args.key
        const stat = fs.statSync(filename)
        const uploadItem = JSON.parse(await this.post('/items', JSON.stringify([attach])))
        const uploadAuth = JSON.parse(await this.post(`/items/${uploadItem.successful[0].key}/file?md5=${md5.sync(filename)}&filename=${attach.filename}&filesize=${fs.statSync(filename)['size']}&mtime=${stat.mtimeMs}`, '{}', { 'If-None-Match': '*' }))
        if (uploadAuth.exists !== 1) {
          const uploadResponse = await request({
            method: 'POST',
            uri: uploadAuth.url,
            body: Buffer.concat([Buffer.from(uploadAuth.prefix), fs.readFileSync(filename), Buffer.from(uploadAuth.suffix)]),
            headers: { 'Content-Type': uploadAuth.contentType }
          })
          await this.post(`/items/${uploadItem.successful[0].key}/file?upload=${uploadAuth.uploadKey}`, '{}', { 'Content-Type': 'application/x-www-form-urlencoded', 'If-None-Match': '*' })
        }
      }
    }

    if (this.args.addtocollection) {
      let newCollections = item.data.collections
      this.args.addtocollection.forEach(itemKey => {
        if (!newCollections.includes(itemKey)) {
          newCollections.push(itemKey)
        }
      })
      await this.patch(`/items/${this.args.key}`, JSON.stringify({ collections: newCollections }), item.version)
    }

    if (this.args.removefromcollection) {
      let newCollections = item.data.collections
      this.args.removefromcollection.forEach(itemKey => {
        const index = newCollections.indexOf(itemKey)
        if (index > -1) {
          newCollections.splice(index, 1)
        }
      })
      await this.patch(`/items/${this.args.key}`, JSON.stringify({ collections: newCollections }), item.version)
    }

    if (this.args.addtags) {
      let newTags = item.data.tags
      this.args.addtags.forEach(tag => {
        if (!newTags.find(newTag => newTag.tag === tag)) {
          newTags.push({ tag })
        }
      })
      await this.patch(`/items/${this.args.key}`, JSON.stringify({ tags: newTags }), item.version)
    }

    if (this.args.removetags) {
      let newTags = item.data.tags.filter(tag => !this.args.removetags.includes(tag.tag))
      await this.patch(`/items/${this.args.key}`, JSON.stringify({ tags: newTags }), item.version)
    }

    const params = this.args.filter || {}
    let result = {}
    if (this.args.children) {
      result = await this.get(`/items/${this.args.key}/children`, { params })
    } else {
      result = await this.get(`/items/${this.args.key}`, { params })
    }
    this.show(result)
    return result
  }

  async $attachment(args) {
    /** 
  Retrieve/save file attachments for the item specified with --key KEY (API: /items/KEY/file). 
  Also see 'item', which has options for adding/saving file attachments. 
    */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' })
      args.argparser.addArgument('--save', { required: true, help: 'Filename to save attachment to.' })
      return
    }

    if (this.args.key) {
      this.args.key = this.extractKeyAndSetGroup(this.args.key)
      if (!this.args.key) {
        const msg = this.message('Unable to extract group/key from the string provided.')
        return msg
      }
    }

    fs.writeFileSync(this.args.save, await this.get(`/items/${this.args.key}/file`), 'binary')
  }

  async create_item(args) {
    //async $create_item(argparser = null) {
    /** 
  Create a new item or items. (API: /items/new) You can retrieve a template with the --template option.  
   
  Use this option to create both top-level items, as well as child items (including notes and links).
    */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--template', { help: "Retrieve a template for the item you wish to create. You can retrieve the template types using the main argument 'types'." })
      args.argparser.addArgument('files', { nargs: '*', help: 'Json files for the items to be created.' })
      return
    }

    if (this.args.template) {
      const result = await this.get('/items/new', { userOrGroupPrefix: false, params: { itemType: this.args.template } })
      this.show(result)
      //console.log("/"+result+"/")
      return result
    } else if ("files" in this.args && this.args.files.length > 0) {
      if (!this.args.files.length) return this.message('Need at least one item (args.items) to create or use args.template')
      const items = this.args.files.map(item => JSON.parse(fs.readFileSync(item, 'utf-8')))
      //console.log("input")
      this.show(items)
      const result = await this.post('/items', JSON.stringify(items))
      this.show(result)
      return result
    } else if ("items" in this.args && this.args.items.length > 0) {
      const result = await this.post('/items', JSON.stringify(this.args.items))
      const res = JSON.parse(result)
      this.show(res)
      return res;
    } else if (this.args.item) {
      const result = await this.post('/items', JSON.stringify(this.args.item))
      this.show(result)
      return result;
    }
  }
  async $update_item(args) {
    /** Update/replace an item (--key KEY), either update (API: patch /items/KEY) or replacing (using --replace, API: put /items/KEY). */
    this.args = args;
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' })
      args.argparser.addArgument('--replace', { action: 'storeTrue', help: 'Replace the item by sumbitting the complete json.' })
      args.argparser.addArgument('items', { nargs: 1, help: 'Path of item files in json format.' })
      return
    }

    if (this.args.key) {
      this.args.key = this.extractKeyAndSetGroup(this.args.key)
    }
    else {
      const msg = this.message('Unable to extract group/key from the string provided.')
      return msg
    }

    // TODO
    const originalItem = await this.get(`/items/${this.args.key}`)
    for (const item of this.args.items) {
      await this[this.args.replace ? 'put' : 'patch'](`/items/${this.args.key}`, fs.readFileSync(item), originalItem.version)
    }
  }

  // <userOrGroupPrefix>/items/trash	Items in the trash

  async $trash(args) {
    /** Return a list of items in the trash. */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      return null
    }
    const items = await this.get('/items/trash')
    this.show(items)
    return items
  }


  // https://www.zotero.org/support/dev/web_api/v3/basics
  // <userOrGroupPrefix>/publications/items	Items in My Publications  

  async $publications(args) {
    /** Return a list of items in publications (user library only). (API: /publications/items) */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      return
    }

    const items = await this.get('/publications/items')
    this.show(items)
  }

  // itemTypes

  async $types(args) {
    /** Retrieve a list of items types available in Zotero. (API: /itemTypes) */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      return
    }

    const types = await this.get('/itemTypes', { userOrGroupPrefix: false })
    this.show(types)
    return types
  }

  async $groups(args) {
    /** Retrieve the Zotero groups data to which the current library_id and api_key has access to. (API: /users/<user-id>/groups) */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      return
    }
    let groups = await this.get('/groups')
    this.show(groups)
    return groups
  }

  async $fields(args) {
    /**
     * Retrieve a template with the fields for --type TYPE (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields (API: /itemFields).
     * Note that to retrieve a template, use 'create-item --template TYPE' rather than this command.
     */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--type', { help: 'Display fields types for TYPE.' })
      return
    }

    if (this.args.type) {
      const result = {
        "itemTypeFields":
          await this.get('/itemTypeFields', { params: { itemType: this.args.type }, userOrGroupPrefix: false }),
        "itemTypeCreatorTypes":
          await this.get('/itemTypeCreatorTypes', { params: { itemType: this.args.type }, userOrGroupPrefix: false })
      }
      this.show(result)
      return result
    } else {
      const result = { "itemFields": await this.get('/itemFields', { userOrGroupPrefix: false }) }
      this.show(result)
      return result
    }
  }

  // Searches
  // https://www.zotero.org/support/dev/web_api/v3/basics

  async $searches(args) {
    /** Return a list of the saved searches of the library. Create new saved searches. (API: /searches) */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--create', { nargs: 1, help: 'Path of JSON file containing the definitions of saved searches.' })
      return
    }

    if (this.args.create) {
      let searchDef = [];
      try {
        searchDef = JSON.parse(fs.readFileSync(this.args.create[0], 'utf8'))
      } catch (ex) {
        console.log('Invalid search definition: ', ex)
      }

      if (!Array.isArray(searchDef)) {
        searchDef = [searchDef]
      }

      await this.post('/searches', JSON.stringify(searchDef))
      this.print('Saved search(s) created successfully.')
      return
    }

    const items = await this.get('/searches')
    this.show(items)
  }

  // Tags
  async $tags(args) {
    /** Return a list of tags in the library. Options to filter and count tags. (API: /tags) */
    this.args = args
    this.reReadConfig(args)
    // function.name({"argparser": subparser}) returns CLI definition.
    if ("argparser" in args && args.argparser) {
      args.argparser.addArgument('--filter', { help: 'Tags of all types matching a specific name.' })
      args.argparser.addArgument('--count', { action: 'storeTrue', help: 'TODO: document' })
      return
    }

    let rawTags = null;
    if (this.args.filter) {
      rawTags = await this.all(`/tags/${encodeURIComponent(this.args.filter)}`)
    } else {
      rawTags = await this.all('/tags')
    }
    const tags = rawTags.map(tag => tag.tag).sort()

    if (this.args.count) {
      const tag_counts: Record<string, number> = {}
      for (const tag of tags) {
        tag_counts[tag] = await this.count('/items', { tag })
      }
      this.print(tag_counts)

    } else {
      this.show(tags)
    }


  }

};