A small library for JSON parse/stringify based on loops.

## Description

A fairly simple library that implements the classic parse and stringify methods, but unlike the built-in methods, these are based on while loops rather than recursion, which avoids stack overflow errors

## Install

    $ npm install simple-parse

```js
let simpleParse = require("simple-parse");

let string = simpleParse.stringify({ key1: "value1", key2: "value2" }); // '{"key1":"value1","key2":"value2"}'

let json = simpleParse.parse('{"key1":"value1","key2":"value2"}'); // { key1: 'value1', key2: 'value2' }
```
