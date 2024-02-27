# zotero-lib

## Introduction

Tools for working with the APIs of Zotero and Zenodo (zotzen)

This repository is part of a set of repositories, [see here](https://github.com/orgs/OpenDevEd/teams/zotzen-team/repositories). Currently, this set contains a number of libraries

- zenodo-lib [GitHub](https://github.com/opendeved/zenodo-lib), [npm](https://www.npmjs.com/package/zenodo-lib)
- zotero-lib [GitHub](https://github.com/opendeved/zotero-lib), [npm](https://www.npmjs.com/package/zotero-lib)
- zotzen-lib [GitHub](https://github.com/opendeved/zotzen-lib), [npm](https://www.npmjs.com/package/zotzen-lib)

(The above tools can also be installed as command-line tools (CLI) with `npm -g`.)

And a web application

- [zotzen-web](https://github.com/opendeved/zotzen-web)

This code builds on earlier code for [zotero-cli](https://github.com/OpenDevEd/zotero-cli), which was developed by [@bjohas](https://github.com/bjohas), [@retorquere](https://github.com/retorquere) and [@a1diablo](https://github.com/a1diablo).

## Installation

Install this library in a module with

```bash
npm install zotero-lib
yarn add zotero-lib
```

or as global CLI

```bash
npm install -g zotero-lib
yarn global add zotero-lib
```

View entry on [npm](https://www.npmjs.com/package/zotero-lib)

## Use of the library and the CLI

The directory tests/ contains a number of tests that illustrate the
use of the npm library. The file tests/test_cli.sh has examples for
use of the library from the command line.

## CLI Documentation

The zotero-cli allows you to access zoter from cmd line, it allows you to automate redundant taskse easily

## Basic usage

### Help

```bash
zotero-lib -h
zotero-lib --help
```

This will print help for all commands and options accepted by zotero-lib

### Version

```bash
zotero-lib -v
zotero-lib --version
```

This will print the version of cli you have installed

### create

This allows you to create item(s). You can create items in two different ways either by providing file containg json or json items as string

Both of these options can be used by providing following arguments

- `--files` - this accepts text files containing json
- `--items` - this accepts items as json string

**Note**: You must use only one of these at a time

Examples

```bash
zotero-lib create --files filepath.txt
zotero-lib create --items '{"title": "zotero item 1", "itemType": "book"}' '{"title": "zotero item 2", "itemType": "book"}'
```

### update

This sub-command can be used to update existing items

```bash
zotero-lib update --key key-here --json '{"title": "zotero item 1 updat", "itemType": "book"}'
zotero-lib update --key key-here --file filepath.txt
```

You can also specify option replace which completely replace existing item and only keep provided information

```bash
zotero-lib update --replace --key key-here --json '{"title": "zotero item 1 updat", "itemType": "book"}'
```

### item

This sub-command has various use cases

To fetch item

```bash
zotero-lib item --key key-here
```

To add files

```bash
zotero-lib item --key key-here --addfiles test.json
```

### items

This sub-command can be used to fetch items with various filters

```bash
zotero-lib items --filter '{"limit": 10}'
```

### search

The `zotero-lib search` command allows for detailed querying of items in a Zotero library via the command line, offering extensive filtering options to accurately target search results.

##### Basic Search by Item Type

Search for items of a specific type, like book sections, with the `--itemtype` option:

```bash
zotero-lib search --itemtype bookSection
```

##### Adding a Second Item Type to Your Search

To search for items that are either one type or another (e.g., book sections or reports), add a second item type with `--snditemtype`:

```bash
zotero-lib search --itemtype bookSection --snditemtype report
```

##### Including Tags in Your Search

Refine your search to include items tagged with specific keywords using the `--tags` option:

```bash
zotero-lib search --tags tag1 tag2
```

##### Excluding an Item Type from Your Search

Exclude a certain item type from your search results with the `--itemtype_exclude` option:

```bash
zotero-lib search --itemtype_exclude bookSection
```

##### Excluding Tags from Your Search

To exclude items tagged with certain keywords, use the `--tag_exclude` option:

```bash
zotero-lib search --tag_exclude tag1
```

##### Specifying the Output File Name

The default output file is `search.json`. To specify a different file name, use the `--json

```bash
zotero-lib search --json search_results.json
```

### collection

### collections

### publications

### tags

### attachment

### types

### groups

### fields

### searches

### key

### field

### update-url

### get-doi

### update-doi

### enclose-item

### attach-link

### attach-note

### kciaka

### bibliography

### Local Database Syncing

You can use this cli to locally backup your online zotero library. The `db` cmd allows you to sync online library in local sqlite database. On first run all online records are synced into local database. On subsequent runs only those records are fetched, which were modifed since last sync.

The underlying database is SQLite. You dont need to install any server or anything it will work out of box as SQLite comes bundled with this cli. 

To use this cmd you need to provide your db name along with one or more options. The options which you can specify are detailed below.

`--sync` make local db synced with online library  
`--lookup` allow you to lookup specific items in the local db  
`--keys` this must be used with `--lookup` to specify specfic keys you want to locate  
`--lockfile` name of lock file to be used, default is "sync.lock" 
`--lock-timeout` if a lock file already exist, how much older it should be to classify it as outdated, if its outdated it will be removed and a new one will be generated
`--export-json=<file-name.json>` export localdb as json with given `file-name.json`  
`--demon=<valid-cron-pattern` this will make the sync process run in demon mode, where it will peridically sync by itself, see [https://crontab.guru](https://crontab.guru) to learn about crontab pattern  
`--errors` this will list all inconsistent items which have non zero children and non zero references 

These options are optional and can be combined as required. If all options are specified then they will be read/applied in above order.

#### Examples

To sync given db file `backup.db` with online version

````bash
zotero-cli db backup.db --sync
````

To export give db file `backup.db` as json file `./backup.json`

````bash
zotero-cli db backup.db --export-json="./backup.json"
````

You can combine previous two steps in one cmd

````bash
zotero-cli db backup.db --sync --export-json="./backup.json"
````


## Also see

[zotero-api-client](https://github.com/tnajdek/zotero-api-client) (With hindsight we might have built on zotero-api-client - we might still rebuild our code to use zotero-api-client.)
