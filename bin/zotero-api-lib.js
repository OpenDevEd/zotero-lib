#!/usr/bin/env node
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
require('dotenv').config();
require('docstring');
var os = require('os');
// import { ArgumentParser } from 'argparse'
var ArgumentParser = require('argparse').ArgumentParser;
var toml = require('@iarna/toml');
var fs = require('fs');
var path = require('path');
var request = require('request-promise');
var LinkHeader = require('http-link-header').LinkHeader;
var Ajv = require('ajv');
var parse = require("args-any").parse;
// import { parse as TOML } from '@iarna/toml'
// import fs = require('fs')
// import path = require('path')
// import request = require('request-promise')
// import * as LinkHeader from 'http-link-header'
// import Ajv = require('ajv')
var ajv = new Ajv();
var md5 = require('md5-file');
function sleep(msecs) {
    return new Promise(function (resolve) { return setTimeout(resolve, msecs); });
}
var arg = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.integer = function (v) {
        if (isNaN(parseInt(v)))
            throw new Error(JSON.stringify(v) + " is not an integer");
        return parseInt(v);
    };
    class_1.prototype.file = function (v) {
        if (!fs.existsSync(v) || !fs.lstatSync(v).isFile())
            throw new Error(JSON.stringify(v) + " is not a file");
        return v;
    };
    class_1.prototype.path = function (v) {
        if (!fs.existsSync(v))
            throw new Error(JSON.stringify(v) + " does not exist");
        return v;
    };
    class_1.prototype.json = function (v) {
        return JSON.parse(v);
    };
    return class_1;
}());
var Zotero = /** @class */ (function () {
    function Zotero() {
        this.output = '';
        this.base = 'https://api.zotero.org';
        this.headers = {
            'User-Agent': 'Zotero-CLI',
            'Zotero-API-Version': '3'
        };
    }
    Zotero.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subparsers, _i, _a, cmd, sp, config, options, _b, options_1, option, value, _value, _c, ex_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.output = '';
                        // global parameters for all commands
                        this.parser = new ArgumentParser;
                        this.parser.addArgument('--api-key', { help: 'The API key to access the Zotero API.' });
                        this.parser.addArgument('--config', { type: arg.file, help: 'Configuration file (toml format). Note that ./zotero-cli.toml and ~/.config/zotero-cli/zotero-cli.toml is picked up automatically.' });
                        this.parser.addArgument('--user-id', { type: arg.integer, help: 'The id of the user library.' });
                        this.parser.addArgument('--group-id', { type: arg.integer, help: 'The id of the group library.' });
                        // See below. If changed, add: You can provide the group-id as zotero-select link (zotero://...). Only the group-id is used, the item/collection id is discarded.
                        this.parser.addArgument('--indent', { type: arg.integer, help: 'Identation for json output.' });
                        this.parser.addArgument('--out', { help: 'Output to file' });
                        this.parser.addArgument('--verbose', { action: 'storeTrue', help: 'Log requests.' });
                        subparsers = this.parser.addSubparsers({ title: 'commands', dest: 'command', required: true });
                        // add all methods that do not start with _ as a command
                        for (_i = 0, _a = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).sort(); _i < _a.length; _i++) {
                            cmd = _a[_i];
                            if (typeof this[cmd] !== 'function' || cmd[0] !== '$')
                                continue;
                            sp = subparsers.addParser(cmd.slice(1).replace(/_/g, '-'), { description: this[cmd].__doc__, help: this[cmd].__doc__ });
                            // when called with an argparser, the command is expected to add relevant parameters and return
                            // the command must have a docstring
                            this[cmd](sp);
                        }
                        this.args = this.parser.parseArgs();
                        config = [this.args.config, 'zotero-cli.toml', os.homedir() + "/.config/zotero-cli/zotero-cli.toml"].find(function (cfg) { return fs.existsSync(cfg); });
                        this.config = config ? toml.parse(fs.readFileSync(config, 'utf-8')) : {};
                        if (this.args.user_id || this.args.group_id) {
                            //Overwriting command line option in config
                            delete this.config['user-id'];
                            delete this.config['group-id'];
                            this.config['user-id'] = this.args.user_id;
                            this.config['group-id'] = this.args.group_id;
                            if (!this.config['user-id'])
                                delete this.config['user-id'];
                            if (!this.config['group-id'])
                                delete this.config['group-id'];
                        }
                        options = [].concat.apply([], this.parser._actions.map(function (action) { return action.dest === 'command' ? action.choices[_this.args.command] : [action]; }));
                        for (_b = 0, options_1 = options; _b < options_1.length; _b++) {
                            option = options_1[_b];
                            if (!option.dest)
                                continue;
                            if (['help', 'config'].includes(option.dest))
                                continue;
                            if (this.args[option.dest] !== null)
                                continue;
                            value = void 0;
                            // first try explicit config
                            if (typeof value === 'undefined' && this.args.config) {
                                value = (this.config[this.args.command] || {})[option.dest.replace(/_/g, '-')];
                                if (typeof value === 'undefined')
                                    value = this.config[option.dest.replace(/_/g, '-')];
                            }
                            // next, ENV vars. Also picks up from .env
                            if (typeof value === 'undefined') {
                                value = process.env["ZOTERO_CLI_" + option.dest.toUpperCase()] || process.env["ZOTERO_" + option.dest.toUpperCase()];
                            }
                            // last, implicit config
                            if (typeof value === 'undefined') {
                                value = (this.config[this.args.command] || {})[option.dest.replace(/_/g, '-')];
                                if (typeof value === 'undefined')
                                    value = this.config[option.dest.replace(/_/g, '-')];
                            }
                            if (typeof value === 'undefined')
                                continue;
                            if (option.type === arg.integer) {
                                if (isNaN(parseInt(value)))
                                    this.parser.error(option.dest + " must be numeric, not " + value);
                                value = parseInt(value);
                            }
                            else if (option.type === arg.path) {
                                if (!fs.existsSync(value))
                                    this.parser.error(option.dest + ": " + value + " does not exist");
                            }
                            else if (option.type === arg.file) {
                                if (!fs.existsSync(value) || !fs.lstatSync(value).isFile())
                                    this.parser.error(option.dest + ": " + value + " is not a file");
                            }
                            else if (option.type === arg.json && typeof value === 'string') {
                                try {
                                    value = JSON.parse(value);
                                }
                                catch (err) {
                                    this.parser.error(option.dest + ": " + JSON.stringify(value) + " is not valid JSON");
                                }
                            }
                            else if (option.choices) {
                                if (!option.choices.includes(value))
                                    this.parser.error(option.dest + " must be one of " + option.choices);
                            }
                            else if (option.action === 'storeTrue' && typeof value === 'string') {
                                _value = {
                                    "true": true,
                                    yes: true,
                                    on: true,
                                    "false": false,
                                    no: false,
                                    off: false
                                }[value];
                                if (typeof _value === 'undefined')
                                    this.parser.error("%{option.dest} must be boolean, not " + value);
                                value = _value;
                            }
                            else {
                                // string
                            }
                            this.args[option.dest] = value;
                        }
                        if (!this.args.api_key)
                            this.parser.error('no API key provided');
                        this.headers['Zotero-API-Key'] = this.args.api_key;
                        if (this.args.user_id === null && this.args.group_id === null)
                            this.parser.error('You must provide exactly one of --user-id or --group-id');
                        if (this.args.user_id !== null && this.args.group_id !== null)
                            this.parser.error('You must provide exactly one of --user-id or --group-id');
                        if (!(this.args.user_id === 0)) return [3 /*break*/, 2];
                        _c = this.args;
                        return [4 /*yield*/, this.get("/keys/" + this.args.api_key, { userOrGroupPrefix: false })];
                    case 1:
                        _c.user_id = (_d.sent()).userID;
                        _d.label = 2;
                    case 2:
                        /*
                        // Could do this here:
                        if (this.args.group_id) {
                          this.args.group_id = this.extractGroup(this.args.group_id)
                          if (!this.args.group_id) {
                      this.parser.error('Unable to extract group_id from the string provided via --group_id.')
                      return
                          }
                        }
                        */
                        // using default=2 above prevents the overrides from being picked up
                        if (this.args.indent === null)
                            this.args.indent = 2;
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this['$' + this.args.command.replace(/-/g, '_')]()];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        ex_1 = _d.sent();
                        this.print('Command execution failed: ', ex_1);
                        process.exit(1);
                        return [3 /*break*/, 6];
                    case 6:
                        if (this.args.out)
                            fs.writeFileSync(this.args.out, this.output);
                        return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.print = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.args.out) {
            console.log.apply(console, args);
        }
        else {
            this.output += args.map(function (m) {
                var type = typeof m;
                if (type === 'string' || m instanceof String || type === 'number' || type === 'undefined' || type === 'boolean' || m === null)
                    return m;
                if (m instanceof Error)
                    return "<Error: " + (m.message || m.name) + (m.stack ? "\n" + m.stack : '') + ">";
                if (m && type === 'object' && m.message)
                    return "<Error: " + m.message + "#\n" + m.stack + ">";
                return JSON.stringify(m, null, _this.args.indent);
            }).join(' ') + '\n';
        }
    };
    Zotero.prototype.all = function (uri, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var chunk, data, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(uri, { resolveWithFullResponse: true, params: params })];
                    case 1:
                        chunk = _a.sent();
                        data = chunk.body;
                        link = chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
                        _a.label = 2;
                    case 2:
                        if (!(link && link.length && link[0].uri)) return [3 /*break*/, 6];
                        if (!chunk.headers.backoff) return [3 /*break*/, 4];
                        return [4 /*yield*/, sleep(parseInt(chunk.headers.backoff) * 1000)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, request({
                            uri: link[0].uri,
                            headers: this.headers,
                            json: true,
                            resolveWithFullResponse: true
                        })];
                    case 5:
                        chunk = _a.sent();
                        data = data.concat(chunk.body);
                        link = chunk.headers.link && LinkHeader.parse(chunk.headers.link).rel('next');
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, data];
                }
            });
        });
    };
    // The Zotero API uses several commands: get, post, patch, delete - these are defined below.
    Zotero.prototype.get = function (uri, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var prefix, params;
            return __generator(this, function (_a) {
                if (typeof options.userOrGroupPrefix === 'undefined')
                    options.userOrGroupPrefix = true;
                if (typeof options.params === 'undefined')
                    options.params = {};
                if (typeof options.json === 'undefined')
                    options.json = true;
                prefix = '';
                if (options.userOrGroupPrefix)
                    prefix = this.args.user_id ? "/users/" + this.args.user_id : "/groups/" + this.args.group_id;
                params = Object.keys(options.params).map(function (param) {
                    var values = options.params[param];
                    if (!Array.isArray(values))
                        values = [values];
                    return values.map(function (v) { return param + "=" + encodeURI(v); }).join('&');
                }).join('&');
                uri = "" + this.base + prefix + uri + (params ? '?' + params : '');
                if (this.args.verbose)
                    console.error('GET', uri);
                return [2 /*return*/, request({
                        uri: uri,
                        headers: this.headers,
                        encoding: null,
                        json: options.json,
                        resolveWithFullResponse: options.resolveWithFullResponse
                    })];
            });
        });
    };
    Zotero.prototype.post = function (uri, data, headers) {
        if (headers === void 0) { headers = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var prefix;
            return __generator(this, function (_a) {
                prefix = this.args.user_id ? "/users/" + this.args.user_id : "/groups/" + this.args.group_id;
                uri = "" + this.base + prefix + uri;
                if (this.args.verbose)
                    console.error('POST', uri);
                return [2 /*return*/, request({
                        method: 'POST',
                        uri: uri,
                        headers: __assign(__assign(__assign({}, this.headers), { 'Content-Type': 'application/json' }), headers),
                        body: data
                    })];
            });
        });
    };
    Zotero.prototype.put = function (uri, data) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix;
            return __generator(this, function (_a) {
                prefix = this.args.user_id ? "/users/" + this.args.user_id : "/groups/" + this.args.group_id;
                uri = "" + this.base + prefix + uri;
                if (this.args.verbose)
                    console.error('PUT', uri);
                return [2 /*return*/, request({
                        method: 'PUT',
                        uri: uri,
                        headers: __assign(__assign({}, this.headers), { 'Content-Type': 'application/json' }),
                        body: data
                    })];
            });
        });
    };
    Zotero.prototype.patch = function (uri, data, version) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, headers;
            return __generator(this, function (_a) {
                prefix = this.args.user_id ? "/users/" + this.args.user_id : "/groups/" + this.args.group_id;
                headers = __assign(__assign({}, this.headers), { 'Content-Type': 'application/json' });
                if (typeof version !== 'undefined')
                    headers['If-Unmodified-Since-Version'] = version;
                uri = "" + this.base + prefix + uri;
                if (this.args.verbose)
                    console.error('PATCH', uri);
                return [2 /*return*/, request({
                        method: 'PATCH',
                        uri: uri,
                        headers: headers,
                        body: data
                    })];
            });
        });
    };
    Zotero.prototype["delete"] = function (uri, version) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, headers;
            return __generator(this, function (_a) {
                prefix = this.args.user_id ? "/users/" + this.args.user_id : "/groups/" + this.args.group_id;
                headers = __assign(__assign({}, this.headers), { 'Content-Type': 'application/json' });
                if (typeof version !== 'undefined')
                    headers['If-Unmodified-Since-Version'] = version;
                uri = "" + this.base + prefix + uri;
                if (this.args.verbose)
                    console.error('DELETE', uri);
                return [2 /*return*/, request({
                        method: 'DELETE',
                        uri: uri,
                        headers: headers
                    })];
            });
        });
    };
    Zotero.prototype.count = function (uri, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(uri, { resolveWithFullResponse: true, params: params })];
                    case 1: return [2 /*return*/, (_a.sent()).headers['total-results']];
                }
            });
        });
    };
    Zotero.prototype.show = function (v) {
        this.print(JSON.stringify(v, null, this.args.indent).replace(new RegExp(this.args.api_key, 'g'), '<API-KEY>'));
    };
    Zotero.prototype.extractKeyAndSetGroup = function (key) {
        // zotero://select/groups/(\d+)/(items|collections)/([A-Z01-9]+)
        var out = key;
        var res = key.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
        if (res) {
            if (res[2] == "library") {
                console.log('You cannot specify zotero-select links (zotero://...) to select user libraries.');
                return;
            }
            else {
                // console.log("Key: zotero://-key provided for "+res[2]+" Setting group-id.")
                this.args.group_id = res[1];
                out = res[3];
            }
            ;
        }
        return out;
    };
    /// THE COMMANDS ///
    // The following functions define key API commands: /keys, /collection, /collections, etc.
    // https://www.zotero.org/support/dev/web_api/v3/basics
    // Collections
    // <userOrGroupPrefix>/collections	Collections in the library
    // <userOrGroupPrefix>/collections/top	Top-level collections in the library
    // <userOrGroupPrefix>/collections/<collectionKey>	A specific collection in the library
    // <userOrGroupPrefix>/collections/<collectionKey>/collections	Subcollections within a specific collection in the library
    // TODO: --create-child should go into 'collection'.
    Zotero.prototype.$collections = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var response, collections;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /** Retrieve a list of collections or create a collection. (API: /collections, /collections/top, /collections/<collectionKey>/collections). Use 'collections --help' for details. */
                        if (argparser) {
                            argparser.addArgument('--top', { action: 'storeTrue', help: 'Show only collection at top level.' });
                            argparser.addArgument('--key', { help: 'Show all the child collections of collection with key. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--create-child', { nargs: '*', help: 'Create child collections of key (or at the top level if no key is specified) with the names specified.' });
                            return [2 /*return*/];
                        }
                        if (this.args.key) {
                            this.args.key = this.extractKeyAndSetGroup(this.args.key);
                            if (!this.args.key) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        if (!this.args.create_child) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.post('/collections', JSON.stringify(this.args.create_child.map(function (c) { return { name: c, parentCollection: _this.args.key }; })))];
                    case 1:
                        response = _a.sent();
                        this.print('Collections created: ', JSON.parse(response).successful);
                        return [2 /*return*/];
                    case 2:
                        collections = null;
                        if (!this.args.key) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.all("/collections/" + this.args.key + "/collections")];
                    case 3:
                        collections = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.all("/collections" + (this.args.top ? '/top' : ''))];
                    case 5:
                        collections = _a.sent();
                        _a.label = 6;
                    case 6:
                        this.show(collections);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Operate on a specific collection.
    // <userOrGroupPrefix>/collections/<collectionKey>/items	Items within a specific collection in the library
    // <userOrGroupPrefix>/collections/<collectionKey>/items/top	Top-level items within a specific collection in the library
    // TODO: --create-child should go into 'collection'.
    // DONE: Why is does the setup for --add and --remove differ? Should 'add' not be "nargs: '*'"? Remove 'itemkeys'?
    // TODO: Add option "--output file.json" to pipe output to file.
    Zotero.prototype.$collection = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, itemKey, item, _b, _c, itemKey, item, index, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        /**
                      Retrieve information about a specific collection --key KEY (API: /collections/KEY or /collections/KEY/tags). Use 'collection --help' for details.
                      (Note: Retrieve items is a collection via 'items --collection KEY'.)
                         */
                        if (argparser) {
                            argparser.addArgument('--key', { required: true, help: 'The key of the collection (required). You can provide the key as zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--tags', { action: 'storeTrue', help: 'Display tags present in the collection.' });
                            // argparser.addArgument('itemkeys', { nargs: '*' , help: 'Item keys for items to be added or removed from this collection.'})
                            argparser.addArgument('--add', { nargs: '*', help: 'Add items to this collection. Note that adding items to collections with \'item --addtocollection\' may require fewer API queries. (Convenience method: patch item->data->collections.)' });
                            argparser.addArgument('--remove', { nargs: '*', help: 'Convenience method: Remove items from this collection. Note that removing items from collections with \'item --removefromcollection\' may require fewer API queries. (Convenience method: patch item->data->collections.)' });
                            return [2 /*return*/];
                        }
                        if (this.args.key) {
                            this.args.key = this.extractKeyAndSetGroup(this.args.key);
                            if (!this.args.key) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        if (this.args.tags && this.args.add) {
                            this.parser.error('--tags cannot be combined with --add');
                            return [2 /*return*/];
                        }
                        if (this.args.tags && this.args.remove) {
                            this.parser.error('--tags cannot be combined with --remove');
                            return [2 /*return*/];
                        }
                        if (!this.args.add) return [3 /*break*/, 5];
                        _i = 0, _a = this.args.add;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        itemKey = _a[_i];
                        return [4 /*yield*/, this.get("/items/" + itemKey)];
                    case 2:
                        item = _e.sent();
                        if (item.data.collections.includes(this.args.key))
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.patch("/items/" + itemKey, JSON.stringify({ collections: item.data.collections.concat(this.args.key) }), item.version)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (!this.args.remove) return [3 /*break*/, 10];
                        _b = 0, _c = this.args.remove;
                        _e.label = 6;
                    case 6:
                        if (!(_b < _c.length)) return [3 /*break*/, 10];
                        itemKey = _c[_b];
                        return [4 /*yield*/, this.get("/items/" + itemKey)];
                    case 7:
                        item = _e.sent();
                        index = item.data.collections.indexOf(this.args.key);
                        if (index > -1) {
                            item.data.collections.splice(index, 1);
                        }
                        return [4 /*yield*/, this.patch("/items/" + itemKey, JSON.stringify({ collections: item.data.collections }), item.version)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 6];
                    case 10:
                        _d = this.show;
                        return [4 /*yield*/, this.get("/collections/" + this.args.key + (this.args.tags ? '/tags' : ''))];
                    case 11:
                        _d.apply(this, [_e.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    // URI	Description
    // https://www.zotero.org/support/dev/web_api/v3/basics
    // <userOrGroupPrefix>/items	All items in the library, excluding trashed items
    // <userOrGroupPrefix>/items/top	Top-level items in the library, excluding trashed items
    Zotero.prototype.$items = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var items, collection, _a, params, oneSchema, validate, validators, _i, items_1, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (argparser) {
                            argparser.addArgument('--count', { action: 'storeTrue', help: 'Return the number of items.' });
                            // argparser.addArgument('--all', { action: 'storeTrue', help: 'obsolete' })
                            argparser.addArgument('--filter', { type: arg.json, help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. For example: \'{"format": "json,bib", "limit": 100, "start": 100}\'.' });
                            argparser.addArgument('--collection', { help: 'Retrive list of items for collection. You can provide the collection key as a zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--top', { action: 'storeTrue', help: 'Retrieve top-level items in the library/collection (excluding child items / attachments, excluding trashed items).' });
                            argparser.addArgument('--validate', { type: arg.path, help: 'json-schema file for all itemtypes, or directory with schema files, one per itemtype.' });
                            return [2 /*return*/];
                        }
                        if (this.args.count && this.args.validate) {
                            this.parser.error('--count cannot be combined with --validate');
                            return [2 /*return*/];
                        }
                        if (this.args.collection) {
                            this.args.collection = this.extractKeyAndSetGroup(this.args.collection);
                            if (!this.args.collection) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        collection = this.args.collection ? "/collections/" + this.args.collection : '';
                        if (!this.args.count) return [3 /*break*/, 2];
                        _a = this.print;
                        return [4 /*yield*/, this.count(collection + "/items" + (this.args.top ? '/top' : ''), this.args.filter || {})];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/];
                    case 2:
                        params = this.args.filter || {};
                        if (!this.args.top) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.all(collection + "/items/top", params)];
                    case 3:
                        // This should be all - there may be more than 100 items.
                        // items = await this.all(`${collection}/items/top`, { params })
                        items = _b.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!params.limit) return [3 /*break*/, 6];
                        if (params.limit > 100) {
                            this.parser.error('You can only retrieve up to 100 items with with params.limit.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.get(collection + "/items", { params: params })];
                    case 5:
                        items = _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.all(collection + "/items", params)];
                    case 7:
                        items = _b.sent();
                        _b.label = 8;
                    case 8:
                        if (this.args.validate) {
                            if (!fs.existsSync(this.args.validate))
                                throw new Error(this.args.validate + " does not exist");
                            oneSchema = fs.lstatSync(this.args.validate).isFile();
                            validate = oneSchema ? ajv.compile(JSON.parse(fs.readFileSync(this.args.validate, 'utf-8'))) : null;
                            validators = {};
                            // still a bit rudimentary
                            for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                                item = items_1[_i];
                                if (!oneSchema) {
                                    validate = validators[item.itemType] = validators[item.itemType] || ajv.compile(JSON.parse(fs.readFileSync(path.join(this.args.validate, item.itemType + ".json"), 'utf-8')));
                                }
                                if (!validate(item))
                                    this.show(validate.errors);
                            }
                        }
                        else {
                            this.show(items);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // https://www.zotero.org/support/dev/web_api/v3/basics
    // <userOrGroupPrefix>/items/<itemKey>	A specific item in the library
    // <userOrGroupPrefix>/items/<itemKey>/children	Child items under a specific item
    Zotero.prototype.$item = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var item, children, attachmentTemplate, _i, _a, filename, attach, stat, uploadItem, _b, _c, uploadAuth, _d, _e, uploadResponse, newCollections_1, newCollections_2, newTags_1, newTags, params, _f, _g;
            var _this = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        /**
                      Retrieve an item (item --key KEY), save/add file attachments, retrieve children. Manage collections and tags. (API: /items/KEY/ or /items/KEY/children).
                     
                      Also see 'attachment', 'create' and 'update'.
                        */
                        if (argparser) {
                            argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--children', { action: 'storeTrue', help: 'Retrieve list of children for the item.' });
                            argparser.addArgument('--filter', { type: arg.json, help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. To retrieve multiple items you have use "itemkey"; for example: \'{"format": "json,bib", "itemkey": "A,B,C"}\'. See https://www.zotero.org/support/dev/web_api/v3/basics#search_syntax.' });
                            argparser.addArgument('--addfile', { nargs: '*', help: 'Upload attachments to the item. (/items/new)' });
                            argparser.addArgument('--savefiles', { nargs: '*', help: 'Download all attachments from the item (/items/KEY/file).' });
                            argparser.addArgument('--addtocollection', { nargs: '*', help: 'Add item to collections. (Convenience method: patch item->data->collections.)' });
                            argparser.addArgument('--removefromcollection', { nargs: '*', help: 'Remove item from collections. (Convenience method: patch item->data->collections.)' });
                            argparser.addArgument('--addtags', { nargs: '*', help: 'Add tags to item. (Convenience method: patch item->data->tags.)' });
                            argparser.addArgument('--removetags', { nargs: '*', help: 'Remove tags from item. (Convenience method: patch item->data->tags.)' });
                            return [2 /*return*/];
                        }
                        if (this.args.key) {
                            this.args.key = this.extractKeyAndSetGroup(this.args.key);
                            if (!this.args.key) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, this.get("/items/" + this.args.key)];
                    case 1:
                        item = _h.sent();
                        if (!this.args.savefiles) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.get("/items/" + this.args.key + "/children")];
                    case 2:
                        children = _h.sent();
                        return [4 /*yield*/, Promise.all(children.filter(function (item) { return item.data.itemType === 'attachment'; }).map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            console.log("Downloading file " + item.data.filename);
                                            _b = (_a = fs).writeFileSync;
                                            _c = [item.data.filename];
                                            return [4 /*yield*/, this.get("/items/" + item.key + "/file")];
                                        case 1:
                                            _b.apply(_a, _c.concat([_d.sent(), 'binary']));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _h.sent();
                        _h.label = 4;
                    case 4:
                        if (!this.args.addfile) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.get('/items/new?itemType=attachment&linkMode=imported_file', { userOrGroupPrefix: false })];
                    case 5:
                        attachmentTemplate = _h.sent();
                        _i = 0, _a = this.args.addfile;
                        _h.label = 6;
                    case 6:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        filename = _a[_i];
                        if (!fs.existsSync(filename)) {
                            console.log("Ignoring non-existing file: " + filename);
                            return [2 /*return*/];
                        }
                        attach = attachmentTemplate;
                        attach.title = path.basename(filename);
                        attach.filename = path.basename(filename);
                        attach.contentType = "application/" + path.extname(filename).slice(1);
                        attach.parentItem = this.args.key;
                        stat = fs.statSync(filename);
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, this.post('/items', JSON.stringify([attach]))];
                    case 7:
                        uploadItem = _c.apply(_b, [_h.sent()]);
                        _e = (_d = JSON).parse;
                        return [4 /*yield*/, this.post("/items/" + uploadItem.successful[0].key + "/file?md5=" + md5.sync(filename) + "&filename=" + attach.filename + "&filesize=" + fs.statSync(filename)['size'] + "&mtime=" + stat.mtimeMs, '{}', { 'If-None-Match': '*' })];
                    case 8:
                        uploadAuth = _e.apply(_d, [_h.sent()]);
                        if (!(uploadAuth.exists !== 1)) return [3 /*break*/, 11];
                        return [4 /*yield*/, request({
                                method: 'POST',
                                uri: uploadAuth.url,
                                body: Buffer.concat([Buffer.from(uploadAuth.prefix), fs.readFileSync(filename), Buffer.from(uploadAuth.suffix)]),
                                headers: { 'Content-Type': uploadAuth.contentType }
                            })];
                    case 9:
                        uploadResponse = _h.sent();
                        return [4 /*yield*/, this.post("/items/" + uploadItem.successful[0].key + "/file?upload=" + uploadAuth.uploadKey, '{}', { 'Content-Type': 'application/x-www-form-urlencoded', 'If-None-Match': '*' })];
                    case 10:
                        _h.sent();
                        _h.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 6];
                    case 12:
                        if (!this.args.addtocollection) return [3 /*break*/, 14];
                        newCollections_1 = item.data.collections;
                        this.args.addtocollection.forEach(function (itemKey) {
                            if (!newCollections_1.includes(itemKey)) {
                                newCollections_1.push(itemKey);
                            }
                        });
                        return [4 /*yield*/, this.patch("/items/" + this.args.key, JSON.stringify({ collections: newCollections_1 }), item.version)];
                    case 13:
                        _h.sent();
                        _h.label = 14;
                    case 14:
                        if (!this.args.removefromcollection) return [3 /*break*/, 16];
                        newCollections_2 = item.data.collections;
                        this.args.removefromcollection.forEach(function (itemKey) {
                            var index = newCollections_2.indexOf(itemKey);
                            if (index > -1) {
                                newCollections_2.splice(index, 1);
                            }
                        });
                        return [4 /*yield*/, this.patch("/items/" + this.args.key, JSON.stringify({ collections: newCollections_2 }), item.version)];
                    case 15:
                        _h.sent();
                        _h.label = 16;
                    case 16:
                        if (!this.args.addtags) return [3 /*break*/, 18];
                        newTags_1 = item.data.tags;
                        this.args.addtags.forEach(function (tag) {
                            if (!newTags_1.find(function (newTag) { return newTag.tag === tag; })) {
                                newTags_1.push({ tag: tag });
                            }
                        });
                        return [4 /*yield*/, this.patch("/items/" + this.args.key, JSON.stringify({ tags: newTags_1 }), item.version)];
                    case 17:
                        _h.sent();
                        _h.label = 18;
                    case 18:
                        if (!this.args.removetags) return [3 /*break*/, 20];
                        newTags = item.data.tags.filter(function (tag) { return !_this.args.removetags.includes(tag.tag); });
                        return [4 /*yield*/, this.patch("/items/" + this.args.key, JSON.stringify({ tags: newTags }), item.version)];
                    case 19:
                        _h.sent();
                        _h.label = 20;
                    case 20:
                        params = this.args.filter || {};
                        if (!this.args.children) return [3 /*break*/, 22];
                        _f = this.show;
                        return [4 /*yield*/, this.get("/items/" + this.args.key + "/children", { params: params })];
                    case 21:
                        _f.apply(this, [_h.sent()]);
                        return [3 /*break*/, 24];
                    case 22:
                        _g = this.show;
                        return [4 /*yield*/, this.get("/items/" + this.args.key, { params: params })];
                    case 23:
                        _g.apply(this, [_h.sent()]);
                        _h.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.$attachment = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        /**
                      Retrieve/save file attachments for the item specified with --key KEY (API: /items/KEY/file).
                      Also see 'item', which has options for adding/saving file attachments.
                        */
                        if (argparser) {
                            argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--save', { required: true, help: 'Filename to save attachment to.' });
                            return [2 /*return*/];
                        }
                        if (this.args.key) {
                            this.args.key = this.extractKeyAndSetGroup(this.args.key);
                            if (!this.args.key) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        _b = (_a = fs).writeFileSync;
                        _c = [this.args.save];
                        return [4 /*yield*/, this.get("/items/" + this.args.key + "/file")];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent(), 'binary']));
                        return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.$create_item = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, items, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        /**
                      Create a new item or items. (API: /items/new) You can retrieve a template with the --template option.
                     
                      Use this option to create both top-level items, as well as child items (including notes and links).
                        */
                        if (argparser) {
                            argparser.addArgument('--template', { help: "Retrieve a template for the item you wish to create. You can retrieve the template types using the main argument 'types'." });
                            argparser.addArgument('items', { nargs: '*', help: 'Json files for the items to be created.' });
                            return [2 /*return*/];
                        }
                        if (!this.args.template) return [3 /*break*/, 2];
                        _a = this.show;
                        return [4 /*yield*/, this.get('/items/new', { userOrGroupPrefix: false, params: { itemType: this.args.template } })];
                    case 1:
                        _a.apply(this, [_c.sent()]);
                        return [2 /*return*/];
                    case 2:
                        if (!this.args.items.length)
                            this.parser.error('Need at least one item to create');
                        items = this.args.items.map(function (item) { return JSON.parse(fs.readFileSync(item, 'utf-8')); });
                        _b = this.print;
                        return [4 /*yield*/, this.post('/items', JSON.stringify(items))];
                    case 3:
                        _b.apply(this, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.$update_item = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var originalItem, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /** Update/replace an item (--key KEY), either update (API: patch /items/KEY) or replacing (using --replace, API: put /items/KEY). */
                        if (argparser) {
                            argparser.addArgument('--key', { required: true, help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.' });
                            argparser.addArgument('--replace', { action: 'storeTrue', help: 'Replace the item by sumbitting the complete json.' });
                            argparser.addArgument('items', { nargs: 1, help: 'Path of item files in json format.' });
                            return [2 /*return*/];
                        }
                        if (this.args.key) {
                            this.args.key = this.extractKeyAndSetGroup(this.args.key);
                            if (!this.args.key) {
                                this.parser.error('Unable to extract group/key from the string provided.');
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, this.get("/items/" + this.args.key)];
                    case 1:
                        originalItem = _b.sent();
                        _i = 0, _a = this.args.items;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        item = _a[_i];
                        return [4 /*yield*/, this[this.args.replace ? 'put' : 'patch']("/items/" + this.args.key, fs.readFileSync(item), originalItem.version)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // <userOrGroupPrefix>/items/trash	Items in the trash
    Zotero.prototype.$trash = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /** Return a list of items in the trash. */
                        if (argparser)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.get('/items/trash')];
                    case 1:
                        items = _a.sent();
                        this.show(items);
                        return [2 /*return*/];
                }
            });
        });
    };
    // https://www.zotero.org/support/dev/web_api/v3/basics
    // <userOrGroupPrefix>/publications/items	Items in My Publications  
    Zotero.prototype.$publications = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /** Return a list of items in publications (user library only). (API: /publications/items) */
                        if (argparser)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.get('/publications/items')];
                    case 1:
                        items = _a.sent();
                        this.show(items);
                        return [2 /*return*/];
                }
            });
        });
    };
    // itemTypes
    Zotero.prototype.$types = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /** Retrieve a list of items types available in Zotero. (API: /itemTypes) */
                        if (argparser)
                            return [2 /*return*/];
                        _a = this.show;
                        return [4 /*yield*/, this.get('/itemTypes', { userOrGroupPrefix: false })];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.$groups = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /** Retrieve the Zotero groups data to which the current library_id and api_key has access to. (API: /users/<user-id>/groups) */
                        if (argparser)
                            return [2 /*return*/];
                        _a = this.show;
                        return [4 /*yield*/, this.get('/groups')];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Zotero.prototype.$fields = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        /**
                         * Retrieve a template with the fields for --type TYPE (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields (API: /itemFields).
                         * Note that to retrieve a template, use 'create-item --template TYPE' rather than this command.
                         */
                        if (argparser) {
                            argparser.addArgument('--type', { help: 'Display fields types for TYPE.' });
                            return [2 /*return*/];
                        }
                        if (!this.args.type) return [3 /*break*/, 3];
                        _a = this.show;
                        return [4 /*yield*/, this.get('/itemTypeFields', { params: { itemType: this.args.type }, userOrGroupPrefix: false })];
                    case 1:
                        _a.apply(this, [_d.sent()]);
                        _b = this.show;
                        return [4 /*yield*/, this.get('/itemTypeCreatorTypes', { params: { itemType: this.args.type }, userOrGroupPrefix: false })];
                    case 2:
                        _b.apply(this, [_d.sent()]);
                        return [3 /*break*/, 5];
                    case 3:
                        _c = this.show;
                        return [4 /*yield*/, this.get('/itemFields', { userOrGroupPrefix: false })];
                    case 4:
                        _c.apply(this, [_d.sent()]);
                        _d.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Searches
    // https://www.zotero.org/support/dev/web_api/v3/basics
    Zotero.prototype.$searches = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var searchDef, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /** Return a list of the saved searches of the library. Create new saved searches. (API: /searches) */
                        if (argparser) {
                            argparser.addArgument('--create', { nargs: 1, help: 'Path of JSON file containing the definitions of saved searches.' });
                            return [2 /*return*/];
                        }
                        if (!this.args.create) return [3 /*break*/, 2];
                        searchDef = [];
                        try {
                            searchDef = JSON.parse(fs.readFileSync(this.args.create[0], 'utf8'));
                        }
                        catch (ex) {
                            console.log('Invalid search definition: ', ex);
                        }
                        if (!Array.isArray(searchDef)) {
                            searchDef = [searchDef];
                        }
                        return [4 /*yield*/, this.post('/searches', JSON.stringify(searchDef))];
                    case 1:
                        _a.sent();
                        this.print('Saved search(s) created successfully.');
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.get('/searches')];
                    case 3:
                        items = _a.sent();
                        this.show(items);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Tags
    Zotero.prototype.$tags = function (argparser) {
        if (argparser === void 0) { argparser = null; }
        return __awaiter(this, void 0, void 0, function () {
            var rawTags, tags, tag_counts, _i, tags_1, tag, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        /** Return a list of tags in the library. Options to filter and count tags. (API: /tags) */
                        if (argparser) {
                            argparser.addArgument('--filter', { help: 'Tags of all types matching a specific name.' });
                            argparser.addArgument('--count', { action: 'storeTrue', help: 'TODO: document' });
                            return [2 /*return*/];
                        }
                        rawTags = null;
                        if (!this.args.filter) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.all("/tags/" + encodeURIComponent(this.args.filter))];
                    case 1:
                        rawTags = _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.all('/tags')];
                    case 3:
                        rawTags = _c.sent();
                        _c.label = 4;
                    case 4:
                        tags = rawTags.map(function (tag) { return tag.tag; }).sort();
                        if (!this.args.count) return [3 /*break*/, 9];
                        tag_counts = {};
                        _i = 0, tags_1 = tags;
                        _c.label = 5;
                    case 5:
                        if (!(_i < tags_1.length)) return [3 /*break*/, 8];
                        tag = tags_1[_i];
                        _a = tag_counts;
                        _b = tag;
                        return [4 /*yield*/, this.count('/items', { tag: tag })];
                    case 6:
                        _a[_b] = _c.sent();
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        this.print(tag_counts);
                        return [3 /*break*/, 10];
                    case 9:
                        this.show(tags);
                        _c.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return Zotero;
}());
