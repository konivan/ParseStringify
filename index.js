"use strict";

/**
 * Works like a classic stringify method.
 */
exports.stringify = function stringify(input) {
  let queue = [];
  queue.push({ obj: input });

  let res = "";
  let next, obj, prefix, val, i, arrayPrefix, keys, k, key, value, objPrefix;
  while ((next = queue.pop())) {
    obj = next.obj;
    prefix = next.prefix || "";
    val = next.val || "";
    res += prefix;
    if (val) {
      res += val;
    } else if (typeof obj !== "object") {
      res += typeof obj === "undefined" ? null : JSON.stringify(obj);
    } else if (obj === null) {
      res += "null";
    } else if (Array.isArray(obj)) {
      queue.push({ val: "]" });
      for (i = obj.length - 1; i >= 0; i--) {
        arrayPrefix = i === 0 ? "" : ",";
        queue.push({ obj: obj[i], prefix: arrayPrefix });
      }
      queue.push({ val: "[" });
    } else {
      keys = [];
      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      queue.push({ val: "}" });
      for (i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        value = obj[key];
        objPrefix = i > 0 ? "," : "";
        objPrefix += JSON.stringify(key) + ":";
        queue.push({ obj: value, prefix: objPrefix });
      }
      queue.push({ val: "{" });
    }
  }
  return res;
};

/**
 * Works like a classic parse method.
 */
exports.parse = function (str) {
  const stack = [];
  const metaStack = [];
  let i = 0;

  while (true) {
    let collationIndex = str[i++];

    if (
      collationIndex === "}" ||
      collationIndex === "]" ||
      typeof collationIndex === "undefined"
    ) {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack.pop(), stack, metaStack);
        continue;
      }
    }

    switch (collationIndex) {
      case " ":
      case "\t":
      case "\n":
      case ":":
      case ",":
        break;

      case "n":
        i += 3;
        pop(null, stack, metaStack);
        break;

      case "t":
        i += 3;
        pop(true, stack, metaStack);
        break;

      case "f":
        i += 4;
        pop(false, stack, metaStack);
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "-":
        let parsedNum = "";
        i--;
        while (true) {
          const numChar = str[i++];
          if (/[\d\.\-e\+]/.test(numChar)) {
            parsedNum += numChar;
          } else {
            i--;
            break;
          }
        }
        pop(parseFloat(parsedNum), stack, metaStack);
        break;

      case '"':
        let parsedString = "";
        let lastCh;
        let numConsecutiveSlashes = 0;
        while (true) {
          const ch = str[i++];
          if (
            ch !== '"' ||
            (lastCh === "\\" && numConsecutiveSlashes % 2 === 1)
          ) {
            parsedString += ch;
            lastCh = ch;
            if (lastCh === "\\") {
              numConsecutiveSlashes++;
            } else {
              numConsecutiveSlashes = 0;
            }
          } else {
            break;
          }
        }
        pop(JSON.parse(`"${parsedString}"`), stack, metaStack);
        break;

      case "[":
        const arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;

      case "{":
        const objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;

      default:
        throw new Error(`unexpectedly reached end of input: ${collationIndex}`);
    }
  }
};

/**
 * Accept a query string and return object
 */
exports.queryParse = function queryParse(query) {
  let parser = /([^=?#&]+)=?([^&]*)/g;
  let part;
  const result = {};

  while (part = parser.exec(query)) {

    let key = decodeURIComponent(part[1].replace(/\+/g, ' ')) || null;
    let value = decodeURIComponent(part[2].replace(/\+/g, ' ')) || null;

    if (key === null || value === null || key in result) {
      continue;
    }
    result[key] = value;
  }

  return result;
}

/**
 * Accept a object with an optional prefix and return query string
 */
exports.queryStringify = function queryStringify(obj, prefix) {
    prefix = prefix || '';
  
    const pairs = [];
    let value;
    let key;
  
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        value = obj[key];
  
        if (!value && (value === null || value === 'undefined' || isNaN(value))) {
          value = '';
        }
        key = encodeURIComponent(key) || null;
        value = encodeURIComponent(value) || null;
  
        if (key === null || value === null) {
            continue
        };
        pairs.push(`${key}=${value}`);
      }
    }
  
    return pairs.length ? prefix + pairs.join('&') : '';
}

// a pop function for the parse function.
function pop(obj, stack, metaStack) {
  const lastMetaElement = metaStack.pop();

  if (obj !== lastMetaElement.element) {
    metaStack.push(lastMetaElement);
  }

  const { element, index } = metaStack[metaStack.length - 1];

  if (Array.isArray(element)) {
    element.push(obj);
  } else if (index === stack.length - 2) {
    const key = stack.pop();
    element[key] = obj;
  } else {
    stack.push(obj);
  }
}
