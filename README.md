A small library for JSON parse/stringify methods based on loops and encode, decode query strings.

## Description

A fairly simple library that implements the classic parse and stringify methods, but unlike the built-in methods, these are based on while loops rather than recursion, which avoids stack overflow errors and it can work at any level of nesting.
It is also has query strings parser, so you can decode query strings to objects and back with a pretty simple way.

## Install

    $ npm install simple-parse


### simpleParse.stringify() and  simpleParse.parse()

```js
const simpleParse = require("simple-parse");

const string = simpleParse.stringify({ key1: "value1", key2: "value2" }); // '{"key1":"value1","key2":"value2"}'

const json = simpleParse.parse('{"key1":"value1","key2":"value2"}'); // { key1: 'value1', key2: 'value2' }
```

### simpleParse.queryStringify() and  simpleParse.queryParse()

queryParse take a query string and convert it to object.
Query string can have any prefix, it just cut off.
Key without values set to empty string.

queryStringify take a object and convert it in query string, it is also can
take any prefix, but by default we return the query string without a prefix.

```js
const simpleParse = require("simple-parse");

const json = simpleParse.queryParse('key=value&value1=key1'); // { key: 'value', value1: 'key1' }
const json = simpleParse.queryParse('?key=value'); // { key: 'value' }
const json = simpleParse.queryParse('key&value=key1'); // { key: '', value: 'key1' }

const string = simpleParse.queryStringify({ key: 'value' }); // 'key=value'
const string = simpleParse.queryStringify({ key: 'value' }, '#'); // '#key=value'
const string = simpleParse.queryStringify({ key: '' }, '&'); // '&key=value'
```