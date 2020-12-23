# index-of-any

- Like string indexOf with multiple search strings

[![Build Status](https://travis-ci.com/jaspenlind/index-of-any.svg?branch=master)](https://travis-ci.com/jaspenlind/index-of-any)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d53c318f91a54f49822d30d9974c1003)](https://www.codacy.com/manual/jaspenlind/index-of-any?utm_source=github.com&utm_medium=referral&utm_content=jaspenlind/index-of-any&utm_campaign=Badge_Grade)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/jaspenlind/index-of-any/badge.svg?branch=master)](https://coveralls.io/r/jaspenlind/index-of-any?branch=master)
![David](https://img.shields.io/david/jaspenlind/index-of-any)
![GitHub](https://img.shields.io/github/license/jaspenlind/index-of-any)
[![npm](https://img.shields.io/npm/v/index-of-any)](https://www.npmjs.com/package/index-of-any)

## Installation

```shell
npm install index-of-any
```

## Usage

### Search strings

```js
import indexOfAny from "index-of-any";

const searchStrings = ["first", "second", "third"];

const [index, searchString] = indexOfAny("a string containing second search string");

==> [20, "second"]
```

### Search arrays

```js
import indexOfAny from "index-of-any";

const strings = ["first", "second", "third"];

const [index, searchString] = indexOfAny(strings, "second");

==> [2, "second"]
```

## Test

```shell
npm test
```
