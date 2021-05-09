# zotero-lib

## Introduction: Tools for working with the APIs of Zotero and Zenodo (zotzen)

This repository is part of a set of repositories, see here: https://github.com/orgs/OpenDevEd/teams/zotzen-team/repositories. Currently, this set contains a number of libraries

- zenodo-lib https://github.com/opendeved/zenodo-lib, https://www.npmjs.com/package/zenodo-lib
- zotero-lib https://github.com/opendeved/zotero-lib, https://www.npmjs.com/package/zotero-lib
- zotzen-lib https://github.com/opendeved/zotzen-lib, https://www.npmjs.com/package/zotzen-lib

(The above tools can also be installed as command-line tools (CLI) with `npm -g`.)

And a web application

- zotzen-web https://github.com/opendeved/zotzen-web

# zotero-lib

Install this library with

```
npm install zotero-lib
```

or as CLI

```
sudo npm install -g zotero-lib
```

View entry on https://www.npmjs.com/package/zotero-lib

# Used by

This library is currently used by

- https://github.com/OpenDevEd/zotero-lib
- https://github.com/OpenDevEd/zotzen-lib
- https://github.com/OpenDevEd/zotzen-web

This code builds on earlier code for https://github.com/OpenDevEd/zotero-cli, which was developed by [@bjohas](https://github.com/bjohas), [@retorquere](https://github.com/retorquere) and [@a1diablo](https://github.com/a1diablo).

# Use of the library and the CLI

The directory tests/ contains a number of tests that illustrate the
use of the npm library. The file tests/test_cli.sh has examples for
use of the library from the command line.

# Also see:

https://github.com/tnajdek/zotero-api-client (With hindsight we might have built on zotero-api-client - we might still rebuild our code to use zotero-api-client.)

# CLI Documentation:

The zotero-cli allows you to access zoter from cmd line, it allows you to automate redundant taskse easily

## Installation

`npm install -g zotero-lib`

OR

`yarn global add zotero-lib`

## Basic usage

### Help

```
zotero-lib -h

OR

zotero-lib --help
```

This will print help for all commands and options accepted by zotero-lib

### Version

```
zotero-lib -v

OR

zotero-lib --version
```

This will print the version of cli you have installed

### Item

### Items

### Create

This allows you to create item(s). You can create items in two different ways by providing following arguments

- `--files` - this accepts text files containing json
- `--items` - this accepts items as json string

for example

```
zotero-lib create items --files filepath.txt
zotero-lib create items --items '{"title": "zotero item"}'
```

### Update

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
