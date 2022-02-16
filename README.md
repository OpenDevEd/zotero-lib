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

### Item

### Items

### Create

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

### Update

This sub-command can be used to update existing items

```bash
zotero-lib update --key key-here --json '{"title": "zotero item 1 updat", "itemType": "book"}'
zotero-lib update --key key-here --file filepath.txt
```

You can also specify option replace which completely replace existing item and only keep provided information

```bash
zotero-lib update --replace --key key-here --json '{"title": "zotero item 1 updat", "itemType": "book"}'
```

### Collection

### Collections

### Publications

### Tags

### Attachment

### Types

### Groups

### Fields

### Searches

### Key

### Field

### Update-url

### Get-doi

### Update-doi

### Enclose-item

### Attach-link

### Attach-note

### Kciaka

### Bibliography

## Also see

[zotero-api-client](https://github.com/tnajdek/zotero-api-client) (With hindsight we might have built on zotero-api-client - we might still rebuild our code to use zotero-api-client.)
