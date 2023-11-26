A small library for JSON parse/stringify based on loops.

## Description

A fairly simple library that implements the classic parse and stringify methods, but unlike the built-in methods, these are based on while loops rather than recursion, which avoids stack overflow errors

## Install

    $ npm install parse-stringify

```js
let parseStringify = require("parse-stringify");

let string = parseStringify.stringify({ key1: "value1", key2: "value2" }); // '{"key1":"value1","key2":"value2"}'

let json = parseStringify.parse('{"key1":"value1","key2":"value2"}'); // { key1: 'value1', key2: 'value2' }
```
