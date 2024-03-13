var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    __name(getLens, "getLens");
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    __name(byteLength, "byteLength");
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    __name(_byteLength, "_byteLength");
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    __name(toByteArray, "toByteArray");
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    __name(tripletToBase64, "tripletToBase64");
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    __name(encodeChunk, "encodeChunk");
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
    __name(fromByteArray, "fromByteArray");
  }
});

// node_modules/.pnpm/ieee754@1.2.1/node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/.pnpm/ieee754@1.2.1/node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/.pnpm/buffer@5.1.0/node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/.pnpm/buffer@5.1.0/node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    exports.Buffer = Buffer7;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer7.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer7.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        var arr = new Uint8Array(1);
        arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
          return 42;
        } };
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    __name(typedArraySupport, "typedArraySupport");
    Object.defineProperty(Buffer7.prototype, "parent", {
      get: function() {
        if (!(this instanceof Buffer7)) {
          return void 0;
        }
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer7.prototype, "offset", {
      get: function() {
        if (!(this instanceof Buffer7)) {
          return void 0;
        }
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError("Invalid typed array length");
      }
      var buf = new Uint8Array(length);
      buf.__proto__ = Buffer7.prototype;
      return buf;
    }
    __name(createBuffer, "createBuffer");
    function Buffer7(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new Error(
            "If encoding is specified then the first argument must be a string"
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    __name(Buffer7, "Buffer");
    if (typeof Symbol !== "undefined" && Symbol.species && Buffer7[Symbol.species] === Buffer7) {
      Object.defineProperty(Buffer7, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
      });
    }
    Buffer7.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('"value" argument must not be a number');
      }
      if (isArrayBuffer(value) || value && isArrayBuffer(value.buffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      return fromObject(value);
    }
    __name(from, "from");
    Buffer7.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Buffer7.prototype.__proto__ = Uint8Array.prototype;
    Buffer7.__proto__ = Uint8Array;
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
      }
    }
    __name(assertSize, "assertSize");
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    __name(alloc, "alloc");
    Buffer7.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    __name(allocUnsafe, "allocUnsafe");
    Buffer7.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer7.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer7.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      var length = byteLength(string, encoding) | 0;
      var buf = createBuffer(length);
      var actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    __name(fromString, "fromString");
    function fromArrayLike(array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      var buf = createBuffer(length);
      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    __name(fromArrayLike, "fromArrayLike");
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      var buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      buf.__proto__ = Buffer7.prototype;
      return buf;
    }
    __name(fromArrayBuffer, "fromArrayBuffer");
    function fromObject(obj) {
      if (Buffer7.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj) {
        if (ArrayBuffer.isView(obj) || "length" in obj) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.");
    }
    __name(fromObject, "fromObject");
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    __name(checked, "checked");
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer7.alloc(+length);
    }
    __name(SlowBuffer, "SlowBuffer");
    Buffer7.isBuffer = /* @__PURE__ */ __name(function isBuffer(b) {
      return b != null && b._isBuffer === true;
    }, "isBuffer");
    Buffer7.compare = /* @__PURE__ */ __name(function compare(a, b) {
      if (!Buffer7.isBuffer(a) || !Buffer7.isBuffer(b)) {
        throw new TypeError("Arguments must be Buffers");
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    }, "compare");
    Buffer7.isEncoding = /* @__PURE__ */ __name(function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, "isEncoding");
    Buffer7.concat = /* @__PURE__ */ __name(function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer7.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer7.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (ArrayBuffer.isView(buf)) {
          buf = Buffer7.from(buf);
        }
        if (!Buffer7.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer;
    }, "concat");
    function byteLength(string, encoding) {
      if (Buffer7.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        string = "" + string;
      }
      var len = string.length;
      if (len === 0)
        return 0;
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
          case void 0:
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase)
              return utf8ToBytes(string).length;
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    __name(byteLength, "byteLength");
    Buffer7.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      var loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    __name(slowToString, "slowToString");
    Buffer7.prototype._isBuffer = true;
    function swap(b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    __name(swap, "swap");
    Buffer7.prototype.swap16 = /* @__PURE__ */ __name(function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    }, "swap16");
    Buffer7.prototype.swap32 = /* @__PURE__ */ __name(function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    }, "swap32");
    Buffer7.prototype.swap64 = /* @__PURE__ */ __name(function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    }, "swap64");
    Buffer7.prototype.toString = /* @__PURE__ */ __name(function toString() {
      var length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    }, "toString");
    Buffer7.prototype.toLocaleString = Buffer7.prototype.toString;
    Buffer7.prototype.equals = /* @__PURE__ */ __name(function equals(b) {
      if (!Buffer7.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer7.compare(this, b) === 0;
    }, "equals");
    Buffer7.prototype.inspect = /* @__PURE__ */ __name(function inspect() {
      var str = "";
      var max = exports.INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
        if (this.length > max)
          str += " ... ";
      }
      return "<Buffer " + str + ">";
    }, "inspect");
    Buffer7.prototype.compare = /* @__PURE__ */ __name(function compare(target, start, end, thisStart, thisEnd) {
      if (!Buffer7.isBuffer(target)) {
        throw new TypeError("Argument must be a Buffer");
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);
      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    }, "compare");
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer7.from(val, encoding);
      }
      if (Buffer7.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    __name(bidirectionalIndexOf, "bidirectionalIndexOf");
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      __name(read, "read");
      var i;
      if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i;
            if (i - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          var found = true;
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found)
            return i;
        }
      }
      return -1;
    }
    __name(arrayIndexOf, "arrayIndexOf");
    Buffer7.prototype.includes = /* @__PURE__ */ __name(function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    }, "includes");
    Buffer7.prototype.indexOf = /* @__PURE__ */ __name(function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    }, "indexOf");
    Buffer7.prototype.lastIndexOf = /* @__PURE__ */ __name(function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    }, "lastIndexOf");
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      var strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    __name(hexWrite, "hexWrite");
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    __name(utf8Write, "utf8Write");
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    __name(asciiWrite, "asciiWrite");
    function latin1Write(buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length);
    }
    __name(latin1Write, "latin1Write");
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    __name(base64Write, "base64Write");
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    __name(ucs2Write, "ucs2Write");
    Buffer7.prototype.write = /* @__PURE__ */ __name(function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }, "write");
    Buffer7.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    }, "toJSON");
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    __name(base64Slice, "base64Slice");
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    __name(utf8Slice, "utf8Slice");
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      var res = "";
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    __name(decodeCodePointsArray, "decodeCodePointsArray");
    function asciiSlice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    __name(asciiSlice, "asciiSlice");
    function latin1Slice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    __name(latin1Slice, "latin1Slice");
    function hexSlice(buf, start, end) {
      var len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      var out = "";
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
      }
      return out;
    }
    __name(hexSlice, "hexSlice");
    function utf16leSlice(buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = "";
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    __name(utf16leSlice, "utf16leSlice");
    Buffer7.prototype.slice = /* @__PURE__ */ __name(function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      var newBuf = this.subarray(start, end);
      newBuf.__proto__ = Buffer7.prototype;
      return newBuf;
    }, "slice");
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    __name(checkOffset, "checkOffset");
    Buffer7.prototype.readUIntLE = /* @__PURE__ */ __name(function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    }, "readUIntLE");
    Buffer7.prototype.readUIntBE = /* @__PURE__ */ __name(function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    }, "readUIntBE");
    Buffer7.prototype.readUInt8 = /* @__PURE__ */ __name(function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    }, "readUInt8");
    Buffer7.prototype.readUInt16LE = /* @__PURE__ */ __name(function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    }, "readUInt16LE");
    Buffer7.prototype.readUInt16BE = /* @__PURE__ */ __name(function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    }, "readUInt16BE");
    Buffer7.prototype.readUInt32LE = /* @__PURE__ */ __name(function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    }, "readUInt32LE");
    Buffer7.prototype.readUInt32BE = /* @__PURE__ */ __name(function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    }, "readUInt32BE");
    Buffer7.prototype.readIntLE = /* @__PURE__ */ __name(function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    }, "readIntLE");
    Buffer7.prototype.readIntBE = /* @__PURE__ */ __name(function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    }, "readIntBE");
    Buffer7.prototype.readInt8 = /* @__PURE__ */ __name(function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    }, "readInt8");
    Buffer7.prototype.readInt16LE = /* @__PURE__ */ __name(function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    }, "readInt16LE");
    Buffer7.prototype.readInt16BE = /* @__PURE__ */ __name(function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    }, "readInt16BE");
    Buffer7.prototype.readInt32LE = /* @__PURE__ */ __name(function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    }, "readInt32LE");
    Buffer7.prototype.readInt32BE = /* @__PURE__ */ __name(function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    }, "readInt32BE");
    Buffer7.prototype.readFloatLE = /* @__PURE__ */ __name(function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    }, "readFloatLE");
    Buffer7.prototype.readFloatBE = /* @__PURE__ */ __name(function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    }, "readFloatBE");
    Buffer7.prototype.readDoubleLE = /* @__PURE__ */ __name(function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    }, "readDoubleLE");
    Buffer7.prototype.readDoubleBE = /* @__PURE__ */ __name(function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    }, "readDoubleBE");
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer7.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    __name(checkInt, "checkInt");
    Buffer7.prototype.writeUIntLE = /* @__PURE__ */ __name(function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    }, "writeUIntLE");
    Buffer7.prototype.writeUIntBE = /* @__PURE__ */ __name(function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    }, "writeUIntBE");
    Buffer7.prototype.writeUInt8 = /* @__PURE__ */ __name(function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    }, "writeUInt8");
    Buffer7.prototype.writeUInt16LE = /* @__PURE__ */ __name(function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    }, "writeUInt16LE");
    Buffer7.prototype.writeUInt16BE = /* @__PURE__ */ __name(function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    }, "writeUInt16BE");
    Buffer7.prototype.writeUInt32LE = /* @__PURE__ */ __name(function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    }, "writeUInt32LE");
    Buffer7.prototype.writeUInt32BE = /* @__PURE__ */ __name(function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    }, "writeUInt32BE");
    Buffer7.prototype.writeIntLE = /* @__PURE__ */ __name(function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    }, "writeIntLE");
    Buffer7.prototype.writeIntBE = /* @__PURE__ */ __name(function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    }, "writeIntBE");
    Buffer7.prototype.writeInt8 = /* @__PURE__ */ __name(function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    }, "writeInt8");
    Buffer7.prototype.writeInt16LE = /* @__PURE__ */ __name(function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    }, "writeInt16LE");
    Buffer7.prototype.writeInt16BE = /* @__PURE__ */ __name(function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    }, "writeInt16BE");
    Buffer7.prototype.writeInt32LE = /* @__PURE__ */ __name(function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    }, "writeInt32LE");
    Buffer7.prototype.writeInt32BE = /* @__PURE__ */ __name(function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    }, "writeInt32BE");
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    __name(checkIEEE754, "checkIEEE754");
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    __name(writeFloat, "writeFloat");
    Buffer7.prototype.writeFloatLE = /* @__PURE__ */ __name(function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    }, "writeFloatLE");
    Buffer7.prototype.writeFloatBE = /* @__PURE__ */ __name(function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    }, "writeFloatBE");
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    __name(writeDouble, "writeDouble");
    Buffer7.prototype.writeDoubleLE = /* @__PURE__ */ __name(function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    }, "writeDoubleLE");
    Buffer7.prototype.writeDoubleBE = /* @__PURE__ */ __name(function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    }, "writeDoubleBE");
    Buffer7.prototype.copy = /* @__PURE__ */ __name(function copy(target, targetStart, start, end) {
      if (!Buffer7.isBuffer(target))
        throw new TypeError("argument should be a Buffer");
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("Index out of range");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      var len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else if (this === target && start < targetStart && targetStart < end) {
        for (var i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    }, "copy");
    Buffer7.prototype.fill = /* @__PURE__ */ __name(function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer7.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = Buffer7.isBuffer(val) ? val : new Buffer7(val, encoding);
        var len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    }, "fill");
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    __name(base64clean, "base64clean");
    function toHex(n) {
      if (n < 16)
        return "0" + n.toString(16);
      return n.toString(16);
    }
    __name(toHex, "toHex");
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    __name(utf8ToBytes, "utf8ToBytes");
    function asciiToBytes(str) {
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    __name(asciiToBytes, "asciiToBytes");
    function utf16leToBytes(str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    __name(utf16leToBytes, "utf16leToBytes");
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    __name(base64ToBytes, "base64ToBytes");
    function blitBuffer(src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length)
          break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    __name(blitBuffer, "blitBuffer");
    function isArrayBuffer(obj) {
      return obj instanceof ArrayBuffer || obj != null && obj.constructor != null && obj.constructor.name === "ArrayBuffer" && typeof obj.byteLength === "number";
    }
    __name(isArrayBuffer, "isArrayBuffer");
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    __name(numberIsNaN, "numberIsNaN");
  }
});

// node_modules/.pnpm/util@0.10.4/node_modules/util/support/isBufferBrowser.js
var require_isBufferBrowser = __commonJS({
  "node_modules/.pnpm/util@0.10.4/node_modules/util/support/isBufferBrowser.js"(exports, module) {
    module.exports = /* @__PURE__ */ __name(function isBuffer(arg) {
      return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
    }, "isBuffer");
  }
});

// node_modules/.pnpm/inherits@2.0.3/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/.pnpm/inherits@2.0.3/node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }, "inherits");
    } else {
      module.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = /* @__PURE__ */ __name(function() {
        }, "TempCtor");
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }, "inherits");
    }
  }
});

// node_modules/.pnpm/util@0.10.4/node_modules/util/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/util@0.10.4/node_modules/util/util.js"(exports) {
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
      }
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x2) {
        if (x2 === "%%")
          return "%";
        if (i >= len)
          return x2;
        switch (x2) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x2;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    };
    exports.deprecate = function(fn, msg) {
      if (isUndefined(global.process)) {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
      if (process.noDeprecation === true) {
        return fn;
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      __name(deprecated, "deprecated");
      return deprecated;
    };
    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || "";
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function() {
          };
        }
      }
      return debugs[set];
    };
    function inspect(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      if (arguments.length >= 3)
        ctx.depth = arguments[2];
      if (arguments.length >= 4)
        ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined(ctx.showHidden))
        ctx.showHidden = false;
      if (isUndefined(ctx.depth))
        ctx.depth = 2;
      if (isUndefined(ctx.colors))
        ctx.colors = false;
      if (isUndefined(ctx.customInspect))
        ctx.customInspect = true;
      if (ctx.colors)
        ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    __name(inspect, "inspect");
    exports.inspect = inspect;
    inspect.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      // "name": intentionally not styling
      "regexp": "red"
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
      if (style) {
        return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
      } else {
        return str;
      }
    }
    __name(stylizeWithColor, "stylizeWithColor");
    function stylizeNoColor(str, styleType) {
      return str;
    }
    __name(stylizeNoColor, "stylizeNoColor");
    function arrayToHash(array) {
      var hash = {};
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
      return hash;
    }
    __name(arrayToHash, "arrayToHash");
    function formatValue(ctx, value, recurseTimes) {
      if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction(value)) {
        var n = value.name ? ": " + value.name : "";
        base = " [Function" + n + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    __name(formatValue, "formatValue");
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value))
        return ctx.stylize("" + value, "number");
      if (isBoolean(value))
        return ctx.stylize("" + value, "boolean");
      if (isNull(value))
        return ctx.stylize("null", "null");
    }
    __name(formatPrimitive, "formatPrimitive");
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    __name(formatError, "formatError");
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            String(i),
            true
          ));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            true
          ));
        }
      });
      return output;
    }
    __name(formatArray, "formatArray");
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").substr(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    __name(formatProperty, "formatProperty");
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf("\n") >= 0)
          numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    __name(reduceToSingleString, "reduceToSingleString");
    function isArray(ar) {
      return Array.isArray(ar);
    }
    __name(isArray, "isArray");
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    __name(isBoolean, "isBoolean");
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    __name(isNull, "isNull");
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    __name(isNullOrUndefined, "isNullOrUndefined");
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    __name(isNumber, "isNumber");
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    __name(isString, "isString");
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    __name(isSymbol, "isSymbol");
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    __name(isUndefined, "isUndefined");
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === "[object RegExp]";
    }
    __name(isRegExp, "isRegExp");
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    __name(isObject, "isObject");
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === "[object Date]";
    }
    __name(isDate, "isDate");
    exports.isDate = isDate;
    function isError(e) {
      return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
    }
    __name(isError, "isError");
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    __name(isFunction, "isFunction");
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    __name(isPrimitive, "isPrimitive");
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require_isBufferBrowser();
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    __name(objectToString, "objectToString");
    function pad(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    }
    __name(pad, "pad");
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function timestamp() {
      var d = /* @__PURE__ */ new Date();
      var time = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())
      ].join(":");
      return [d.getDate(), months[d.getMonth()], time].join(" ");
    }
    __name(timestamp, "timestamp");
    exports.log = function() {
      console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
    };
    exports.inherits = require_inherits_browser();
    exports._extend = function(origin, add) {
      if (!add || !isObject(add))
        return origin;
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    __name(hasOwnProperty, "hasOwnProperty");
  }
});

// node_modules/.pnpm/path@0.12.7/node_modules/path/path.js
var require_path = __commonJS({
  "node_modules/.pnpm/path@0.12.7/node_modules/path/path.js"(exports, module) {
    "use strict";
    var isWindows = process.platform === "win32";
    var util = require_util();
    function normalizeArray(parts, allowAboveRoot) {
      var res = [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!p || p === ".")
          continue;
        if (p === "..") {
          if (res.length && res[res.length - 1] !== "..") {
            res.pop();
          } else if (allowAboveRoot) {
            res.push("..");
          }
        } else {
          res.push(p);
        }
      }
      return res;
    }
    __name(normalizeArray, "normalizeArray");
    function trimArray(arr) {
      var lastIndex = arr.length - 1;
      var start = 0;
      for (; start <= lastIndex; start++) {
        if (arr[start])
          break;
      }
      var end = lastIndex;
      for (; end >= 0; end--) {
        if (arr[end])
          break;
      }
      if (start === 0 && end === lastIndex)
        return arr;
      if (start > end)
        return [];
      return arr.slice(start, end + 1);
    }
    __name(trimArray, "trimArray");
    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    var splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;
    var win32 = {};
    function win32SplitPath(filename) {
      var result = splitDeviceRe.exec(filename), device = (result[1] || "") + (result[2] || ""), tail = result[3] || "";
      var result2 = splitTailRe.exec(tail), dir = result2[1], basename = result2[2], ext = result2[3];
      return [device, dir, basename, ext];
    }
    __name(win32SplitPath, "win32SplitPath");
    function win32StatPath(path3) {
      var result = splitDeviceRe.exec(path3), device = result[1] || "", isUnc = !!device && device[1] !== ":";
      return {
        device,
        isUnc,
        isAbsolute: isUnc || !!result[2],
        // UNC paths are always absolute
        tail: result[3]
      };
    }
    __name(win32StatPath, "win32StatPath");
    function normalizeUNCRoot(device) {
      return "\\\\" + device.replace(/^[\\\/]+/, "").replace(/[\\\/]+/g, "\\");
    }
    __name(normalizeUNCRoot, "normalizeUNCRoot");
    win32.resolve = function() {
      var resolvedDevice = "", resolvedTail = "", resolvedAbsolute = false;
      for (var i = arguments.length - 1; i >= -1; i--) {
        var path3;
        if (i >= 0) {
          path3 = arguments[i];
        } else if (!resolvedDevice) {
          path3 = process.cwd();
        } else {
          path3 = process.env["=" + resolvedDevice];
          if (!path3 || path3.substr(0, 3).toLowerCase() !== resolvedDevice.toLowerCase() + "\\") {
            path3 = resolvedDevice + "\\";
          }
        }
        if (!util.isString(path3)) {
          throw new TypeError("Arguments to path.resolve must be strings");
        } else if (!path3) {
          continue;
        }
        var result = win32StatPath(path3), device = result.device, isUnc = result.isUnc, isAbsolute = result.isAbsolute, tail = result.tail;
        if (device && resolvedDevice && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
          continue;
        }
        if (!resolvedDevice) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = tail + "\\" + resolvedTail;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedDevice && resolvedAbsolute) {
          break;
        }
      }
      if (isUnc) {
        resolvedDevice = normalizeUNCRoot(resolvedDevice);
      }
      resolvedTail = normalizeArray(
        resolvedTail.split(/[\\\/]+/),
        !resolvedAbsolute
      ).join("\\");
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    };
    win32.normalize = function(path3) {
      var result = win32StatPath(path3), device = result.device, isUnc = result.isUnc, isAbsolute = result.isAbsolute, tail = result.tail, trailingSlash = /[\\\/]$/.test(tail);
      tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join("\\");
      if (!tail && !isAbsolute) {
        tail = ".";
      }
      if (tail && trailingSlash) {
        tail += "\\";
      }
      if (isUnc) {
        device = normalizeUNCRoot(device);
      }
      return device + (isAbsolute ? "\\" : "") + tail;
    };
    win32.isAbsolute = function(path3) {
      return win32StatPath(path3).isAbsolute;
    };
    win32.join = function() {
      var paths = [];
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!util.isString(arg)) {
          throw new TypeError("Arguments to path.join must be strings");
        }
        if (arg) {
          paths.push(arg);
        }
      }
      var joined = paths.join("\\");
      if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
        joined = joined.replace(/^[\\\/]{2,}/, "\\");
      }
      return win32.normalize(joined);
    };
    win32.relative = function(from, to) {
      from = win32.resolve(from);
      to = win32.resolve(to);
      var lowerFrom = from.toLowerCase();
      var lowerTo = to.toLowerCase();
      var toParts = trimArray(to.split("\\"));
      var lowerFromParts = trimArray(lowerFrom.split("\\"));
      var lowerToParts = trimArray(lowerTo.split("\\"));
      var length = Math.min(lowerFromParts.length, lowerToParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (lowerFromParts[i] !== lowerToParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      if (samePartsLength == 0) {
        return to;
      }
      var outputParts = [];
      for (var i = samePartsLength; i < lowerFromParts.length; i++) {
        outputParts.push("..");
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join("\\");
    };
    win32._makeLong = function(path3) {
      if (!util.isString(path3))
        return path3;
      if (!path3) {
        return "";
      }
      var resolvedPath = win32.resolve(path3);
      if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
        return "\\\\?\\" + resolvedPath;
      } else if (/^\\\\[^?.]/.test(resolvedPath)) {
        return "\\\\?\\UNC\\" + resolvedPath.substring(2);
      }
      return path3;
    };
    win32.dirname = function(path3) {
      var result = win32SplitPath(path3), root = result[0], dir = result[1];
      if (!root && !dir) {
        return ".";
      }
      if (dir) {
        dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
    };
    win32.basename = function(path3, ext) {
      var f = win32SplitPath(path3)[2];
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };
    win32.extname = function(path3) {
      return win32SplitPath(path3)[3];
    };
    win32.format = function(pathObject) {
      if (!util.isObject(pathObject)) {
        throw new TypeError(
          "Parameter 'pathObject' must be an object, not " + typeof pathObject
        );
      }
      var root = pathObject.root || "";
      if (!util.isString(root)) {
        throw new TypeError(
          "'pathObject.root' must be a string or undefined, not " + typeof pathObject.root
        );
      }
      var dir = pathObject.dir;
      var base = pathObject.base || "";
      if (!dir) {
        return base;
      }
      if (dir[dir.length - 1] === win32.sep) {
        return dir + base;
      }
      return dir + win32.sep + base;
    };
    win32.parse = function(pathString) {
      if (!util.isString(pathString)) {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };
    win32.sep = "\\";
    win32.delimiter = ";";
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var posix = {};
    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }
    __name(posixSplitPath, "posixSplitPath");
    posix.resolve = function() {
      var resolvedPath = "", resolvedAbsolute = false;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path3 = i >= 0 ? arguments[i] : process.cwd();
        if (!util.isString(path3)) {
          throw new TypeError("Arguments to path.resolve must be strings");
        } else if (!path3) {
          continue;
        }
        resolvedPath = path3 + "/" + resolvedPath;
        resolvedAbsolute = path3[0] === "/";
      }
      resolvedPath = normalizeArray(
        resolvedPath.split("/"),
        !resolvedAbsolute
      ).join("/");
      return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
    };
    posix.normalize = function(path3) {
      var isAbsolute = posix.isAbsolute(path3), trailingSlash = path3 && path3[path3.length - 1] === "/";
      path3 = normalizeArray(path3.split("/"), !isAbsolute).join("/");
      if (!path3 && !isAbsolute) {
        path3 = ".";
      }
      if (path3 && trailingSlash) {
        path3 += "/";
      }
      return (isAbsolute ? "/" : "") + path3;
    };
    posix.isAbsolute = function(path3) {
      return path3.charAt(0) === "/";
    };
    posix.join = function() {
      var path3 = "";
      for (var i = 0; i < arguments.length; i++) {
        var segment = arguments[i];
        if (!util.isString(segment)) {
          throw new TypeError("Arguments to path.join must be strings");
        }
        if (segment) {
          if (!path3) {
            path3 += segment;
          } else {
            path3 += "/" + segment;
          }
        }
      }
      return posix.normalize(path3);
    };
    posix.relative = function(from, to) {
      from = posix.resolve(from).substr(1);
      to = posix.resolve(to).substr(1);
      var fromParts = trimArray(from.split("/"));
      var toParts = trimArray(to.split("/"));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push("..");
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join("/");
    };
    posix._makeLong = function(path3) {
      return path3;
    };
    posix.dirname = function(path3) {
      var result = posixSplitPath(path3), root = result[0], dir = result[1];
      if (!root && !dir) {
        return ".";
      }
      if (dir) {
        dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
    };
    posix.basename = function(path3, ext) {
      var f = posixSplitPath(path3)[2];
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };
    posix.extname = function(path3) {
      return posixSplitPath(path3)[3];
    };
    posix.format = function(pathObject) {
      if (!util.isObject(pathObject)) {
        throw new TypeError(
          "Parameter 'pathObject' must be an object, not " + typeof pathObject
        );
      }
      var root = pathObject.root || "";
      if (!util.isString(root)) {
        throw new TypeError(
          "'pathObject.root' must be a string or undefined, not " + typeof pathObject.root
        );
      }
      var dir = pathObject.dir ? pathObject.dir + posix.sep : "";
      var base = pathObject.base || "";
      return dir + base;
    };
    posix.parse = function(pathString) {
      if (!util.isString(pathString)) {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      allParts[1] = allParts[1] || "";
      allParts[2] = allParts[2] || "";
      allParts[3] = allParts[3] || "";
      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };
    posix.sep = "/";
    posix.delimiter = ":";
    if (isWindows)
      module.exports = win32;
    else
      module.exports = posix;
    module.exports.posix = posix;
    module.exports.win32 = win32;
  }
});

// src/ApiError.ts
var import_buffer = __toESM(require_buffer(), 1);
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["EPERM"] = 1] = "EPERM";
  ErrorCode2[ErrorCode2["ENOENT"] = 2] = "ENOENT";
  ErrorCode2[ErrorCode2["EIO"] = 5] = "EIO";
  ErrorCode2[ErrorCode2["EBADF"] = 9] = "EBADF";
  ErrorCode2[ErrorCode2["EACCES"] = 13] = "EACCES";
  ErrorCode2[ErrorCode2["EBUSY"] = 16] = "EBUSY";
  ErrorCode2[ErrorCode2["EEXIST"] = 17] = "EEXIST";
  ErrorCode2[ErrorCode2["ENOTDIR"] = 20] = "ENOTDIR";
  ErrorCode2[ErrorCode2["EISDIR"] = 21] = "EISDIR";
  ErrorCode2[ErrorCode2["EINVAL"] = 22] = "EINVAL";
  ErrorCode2[ErrorCode2["EFBIG"] = 27] = "EFBIG";
  ErrorCode2[ErrorCode2["ENOSPC"] = 28] = "ENOSPC";
  ErrorCode2[ErrorCode2["EROFS"] = 30] = "EROFS";
  ErrorCode2[ErrorCode2["ENOTEMPTY"] = 39] = "ENOTEMPTY";
  ErrorCode2[ErrorCode2["ENOTSUP"] = 95] = "ENOTSUP";
  return ErrorCode2;
})(ErrorCode || {});
var ErrorStrings = {};
ErrorStrings[1 /* EPERM */] = "Operation not permitted.";
ErrorStrings[2 /* ENOENT */] = "No such file or directory.";
ErrorStrings[5 /* EIO */] = "Input/output error.";
ErrorStrings[9 /* EBADF */] = "Bad file descriptor.";
ErrorStrings[13 /* EACCES */] = "Permission denied.";
ErrorStrings[16 /* EBUSY */] = "Resource busy or locked.";
ErrorStrings[17 /* EEXIST */] = "File exists.";
ErrorStrings[20 /* ENOTDIR */] = "File is not a directory.";
ErrorStrings[21 /* EISDIR */] = "File is a directory.";
ErrorStrings[22 /* EINVAL */] = "Invalid argument.";
ErrorStrings[27 /* EFBIG */] = "File is too big.";
ErrorStrings[28 /* ENOSPC */] = "No space left on disk.";
ErrorStrings[30 /* EROFS */] = "Cannot modify a read-only file system.";
ErrorStrings[39 /* ENOTEMPTY */] = "Directory is not empty.";
ErrorStrings[95 /* ENOTSUP */] = "Operation is not supported.";
var ApiError = class extends Error {
  static fromJSON(json) {
    const err = new ApiError(json.errno, json.message, json.path);
    err.code = json.code;
    err.stack = json.stack;
    return err;
  }
  /**
   * Creates an ApiError object from a buffer.
   */
  static fromBuffer(buffer, i = 0) {
    return ApiError.fromJSON(JSON.parse(buffer.toString("utf8", i + 4, i + 4 + buffer.readUInt32LE(i))));
  }
  static FileError(code, p) {
    return new ApiError(code, ErrorStrings[code], p);
  }
  static EACCES(path3) {
    return this.FileError(13 /* EACCES */, path3);
  }
  static ENOENT(path3) {
    return this.FileError(2 /* ENOENT */, path3);
  }
  static EEXIST(path3) {
    return this.FileError(17 /* EEXIST */, path3);
  }
  static EISDIR(path3) {
    return this.FileError(21 /* EISDIR */, path3);
  }
  static ENOTDIR(path3) {
    return this.FileError(20 /* ENOTDIR */, path3);
  }
  static EPERM(path3) {
    return this.FileError(1 /* EPERM */, path3);
  }
  static ENOTEMPTY(path3) {
    return this.FileError(39 /* ENOTEMPTY */, path3);
  }
  errno;
  code;
  path;
  // Unsupported.
  syscall = "";
  stack;
  /**
   * Represents a BrowserFS error. Passed back to applications after a failed
   * call to the BrowserFS API.
   *
   * Error codes mirror those returned by regular Unix file operations, which is
   * what Node returns.
   * @constructor ApiError
   * @param type The type of the error.
   * @param [message] A descriptive error message.
   */
  constructor(type, message = ErrorStrings[type], path3) {
    super(message);
    this.errno = type;
    this.code = ErrorCode[type];
    this.path = path3;
    this.message = `Error: ${this.code}: ${message}${this.path ? `, '${this.path}'` : ""}`;
  }
  /**
   * @return A friendly error message.
   */
  toString() {
    return this.message;
  }
  toJSON() {
    return {
      errno: this.errno,
      code: this.code,
      path: this.path,
      stack: this.stack,
      message: this.message
    };
  }
  /**
   * Writes the API error into a buffer.
   */
  writeToBuffer(buffer = import_buffer.Buffer.alloc(this.bufferSize()), i = 0) {
    const bytesWritten = buffer.write(JSON.stringify(this.toJSON()), i + 4);
    buffer.writeUInt32LE(bytesWritten, i);
    return buffer;
  }
  /**
   * The size of the API error in buffer-form in bytes.
   */
  bufferSize() {
    return 4 + import_buffer.Buffer.byteLength(JSON.stringify(this.toJSON()));
  }
};
__name(ApiError, "ApiError");

// src/file.ts
var _FileFlag = class {
  /**
   * Get an object representing the given file flag.
   * @param modeStr The string representing the flag
   * @return The FileFlag object representing the flag
   * @throw when the flag string is invalid
   */
  static getFileFlag(flagStr) {
    if (!_FileFlag.flagCache.has(flagStr)) {
      _FileFlag.flagCache.set(flagStr, new _FileFlag(flagStr));
    }
    return _FileFlag.flagCache.get(flagStr);
  }
  flagStr;
  /**
   * This should never be called directly.
   * @param modeStr The string representing the mode
   * @throw when the mode string is invalid
   */
  constructor(flagStr) {
    this.flagStr = flagStr;
    if (_FileFlag.validFlagStrs.indexOf(flagStr) < 0) {
      throw new ApiError(22 /* EINVAL */, "Invalid flag: " + flagStr);
    }
  }
  /**
   * Get the underlying flag string for this flag.
   */
  getFlagString() {
    return this.flagStr;
  }
  /**
   * Get the equivalent mode (0b0xxx: read, write, execute)
   * Note: Execute will always be 0
   */
  getMode() {
    let mode = 0;
    mode <<= 1;
    mode += +this.isReadable();
    mode <<= 1;
    mode += +this.isWriteable();
    mode <<= 1;
    return mode;
  }
  /**
   * Returns true if the file is readable.
   */
  isReadable() {
    return this.flagStr.indexOf("r") !== -1 || this.flagStr.indexOf("+") !== -1;
  }
  /**
   * Returns true if the file is writeable.
   */
  isWriteable() {
    return this.flagStr.indexOf("w") !== -1 || this.flagStr.indexOf("a") !== -1 || this.flagStr.indexOf("+") !== -1;
  }
  /**
   * Returns true if the file mode should truncate.
   */
  isTruncating() {
    return this.flagStr.indexOf("w") !== -1;
  }
  /**
   * Returns true if the file is appendable.
   */
  isAppendable() {
    return this.flagStr.indexOf("a") !== -1;
  }
  /**
   * Returns true if the file is open in synchronous mode.
   */
  isSynchronous() {
    return this.flagStr.indexOf("s") !== -1;
  }
  /**
   * Returns true if the file is open in exclusive mode.
   */
  isExclusive() {
    return this.flagStr.indexOf("x") !== -1;
  }
  /**
   * Returns one of the static fields on this object that indicates the
   * appropriate response to the path existing.
   */
  pathExistsAction() {
    if (this.isExclusive()) {
      return 1 /* THROW_EXCEPTION */;
    } else if (this.isTruncating()) {
      return 2 /* TRUNCATE_FILE */;
    } else {
      return 0 /* NOP */;
    }
  }
  /**
   * Returns one of the static fields on this object that indicates the
   * appropriate response to the path not existing.
   */
  pathNotExistsAction() {
    if ((this.isWriteable() || this.isAppendable()) && this.flagStr !== "r+") {
      return 3 /* CREATE_FILE */;
    } else {
      return 1 /* THROW_EXCEPTION */;
    }
  }
};
var FileFlag = _FileFlag;
__name(FileFlag, "FileFlag");
// Contains cached FileMode instances.
__publicField(FileFlag, "flagCache", /* @__PURE__ */ new Map());
// Array of valid mode strings.
__publicField(FileFlag, "validFlagStrs", ["r", "r+", "rs", "rs+", "w", "wx", "w+", "wx+", "a", "ax", "a+", "ax+"]);
var BaseFile = class {
  async sync() {
    throw new ApiError(95 /* ENOTSUP */);
  }
  syncSync() {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async datasync() {
    return this.sync();
  }
  datasyncSync() {
    return this.syncSync();
  }
  async chown(uid, gid) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  chownSync(uid, gid) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async chmod(mode) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  chmodSync(mode) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async utimes(atime, mtime) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  utimesSync(atime, mtime) {
    throw new ApiError(95 /* ENOTSUP */);
  }
};
__name(BaseFile, "BaseFile");

// src/filesystem.ts
var path = __toESM(require_path(), 1);
var import_buffer2 = __toESM(require_buffer(), 1);
var FileSystem = class {
  constructor(options) {
  }
};
__name(FileSystem, "FileSystem");
__publicField(FileSystem, "Name");
var _BaseFileSystem = class extends FileSystem {
  _ready = Promise.resolve(this);
  constructor(options) {
    super();
  }
  get metadata() {
    return {
      name: this.constructor.name,
      readonly: false,
      synchronous: false,
      supportsProperties: false,
      supportsLinks: false,
      totalSpace: 0,
      freeSpace: 0
    };
  }
  whenReady() {
    return this._ready;
  }
  /**
   * Opens the file at path p with the given flag. The file must exist.
   * @param p The path to open.
   * @param flag The flag to use when opening the file.
   */
  async openFile(p, flag, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  /**
   * Create the file at path p with the given mode. Then, open it with the given
   * flag.
   */
  async createFile(p, flag, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async open(p, flag, mode, cred, callback) {
    try {
      const stats = await this.stat(p, cred);
      switch (flag.pathExistsAction()) {
        case 1 /* THROW_EXCEPTION */:
          throw ApiError.EEXIST(p);
        case 2 /* TRUNCATE_FILE */:
          const fd = await this.openFile(p, flag, cred);
          if (!fd)
            throw new Error("BFS has reached an impossible code path; please file a bug.");
          await fd.truncate(0);
          await fd.sync();
          callback?.(null, fd);
          return fd;
        case 0 /* NOP */:
          const r = this.openFile(p, flag, cred);
          r.then((r2) => {
            callback?.(null, r2);
          });
          return r;
        default:
          throw new ApiError(22 /* EINVAL */, "Invalid FileFlag object.");
      }
    } catch (e) {
      switch (flag.pathNotExistsAction()) {
        case 3 /* CREATE_FILE */:
          const parentStats = await this.stat(path.dirname(p), cred);
          if (parentStats && !parentStats.isDirectory()) {
            throw ApiError.ENOTDIR(path.dirname(p));
          }
          const file = this.createFile(p, flag, mode, cred);
          file.then((file2) => {
            callback?.(null, file2);
          });
          return file;
        case 1 /* THROW_EXCEPTION */:
          throw ApiError.ENOENT(p);
        default:
          throw new ApiError(22 /* EINVAL */, "Invalid FileFlag object.");
      }
    }
  }
  async access(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  accessSync(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async rename(oldPath, newPath, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  renameSync(oldPath, newPath, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async stat(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  statSync(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  /**
   * Opens the file at path p with the given flag. The file must exist.
   * @param p The path to open.
   * @param flag The flag to use when opening the file.
   * @return A File object corresponding to the opened file.
   */
  openFileSync(p, flag, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  /**
   * Create the file at path p with the given mode. Then, open it with the given
   * flag.
   */
  createFileSync(p, flag, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  openSync(p, flag, mode, cred) {
    let stats;
    try {
      stats = this.statSync(p, cred);
    } catch (e) {
      switch (flag.pathNotExistsAction()) {
        case 3 /* CREATE_FILE */:
          const parentStats = this.statSync(path.dirname(p), cred);
          if (!parentStats.isDirectory()) {
            throw ApiError.ENOTDIR(path.dirname(p));
          }
          return this.createFileSync(p, flag, mode, cred);
        case 1 /* THROW_EXCEPTION */:
          throw ApiError.ENOENT(p);
        default:
          throw new ApiError(22 /* EINVAL */, "Invalid FileFlag object.");
      }
    }
    if (!stats.hasAccess(mode, cred)) {
      throw ApiError.EACCES(p);
    }
    switch (flag.pathExistsAction()) {
      case 1 /* THROW_EXCEPTION */:
        throw ApiError.EEXIST(p);
      case 2 /* TRUNCATE_FILE */:
        this.unlinkSync(p, cred);
        return this.createFileSync(p, flag, stats.mode, cred);
      case 0 /* NOP */:
        return this.openFileSync(p, flag, cred);
      default:
        throw new ApiError(22 /* EINVAL */, "Invalid FileFlag object.");
    }
  }
  async unlink(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  unlinkSync(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async rmdir(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  rmdirSync(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async mkdir(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  mkdirSync(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async readdir(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  readdirSync(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async exists(p, cred, callback) {
    try {
      await this.stat(p, cred);
      callback?.(null, true);
      return true;
    } catch (e) {
      return false;
    }
  }
  existsSync(p, cred) {
    try {
      this.statSync(p, cred);
      return true;
    } catch (e) {
      return false;
    }
  }
  async realpath(p, cred, callback) {
    if (this.metadata.supportsLinks) {
      const splitPath = p.split(path.sep);
      for (let i = 0; i < splitPath.length; i++) {
        const addPaths = splitPath.slice(0, i + 1);
        splitPath[i] = path.join(...addPaths);
      }
      return splitPath.join(path.sep);
    } else {
      if (!await this.exists(p, cred)) {
        throw ApiError.ENOENT(p);
      }
      callback?.(null, p);
      return p;
    }
  }
  realpathSync(p, cred) {
    if (this.metadata.supportsLinks) {
      const splitPath = p.split(path.sep);
      for (let i = 0; i < splitPath.length; i++) {
        const addPaths = splitPath.slice(0, i + 1);
        splitPath[i] = path.join(...addPaths);
      }
      return splitPath.join(path.sep);
    } else {
      if (this.existsSync(p, cred)) {
        return p;
      } else {
        throw ApiError.ENOENT(p);
      }
    }
  }
  async truncate(p, len, cred, callback) {
    const fd = await this.open(p, FileFlag.getFileFlag("r+"), 420, cred);
    try {
      await fd.truncate(len);
      callback?.(null);
    } finally {
      await fd.close();
    }
  }
  truncateSync(p, len, cred) {
    const fd = this.openSync(p, FileFlag.getFileFlag("r+"), 420, cred);
    try {
      fd.truncateSync(len);
    } finally {
      fd.closeSync();
    }
  }
  async readFile(fname, encoding, flag, cred, callback) {
    const fd = await this.open(fname, flag, 420, cred);
    try {
      const stat = await fd.stat();
      const buf = import_buffer2.Buffer.alloc(stat.size);
      await fd.read(buf, 0, stat.size, 0);
      await fd.close();
      callback?.(null, encoding === null ? buf : buf.toString(encoding));
      if (encoding === null) {
        return buf;
      }
      return buf.toString(encoding);
    } finally {
      await fd.close();
    }
  }
  readFileSync(fname, encoding, flag, cred) {
    const fd = this.openSync(fname, flag, 420, cred);
    try {
      const stat = fd.statSync();
      const buf = import_buffer2.Buffer.alloc(stat.size);
      fd.readSync(buf, 0, stat.size, 0);
      fd.closeSync();
      if (encoding === null) {
        return buf;
      }
      return buf.toString(encoding);
    } finally {
      fd.closeSync();
    }
  }
  async writeFile(fname, data, encoding, flag, mode, cred, callback) {
    const fd = await this.open(fname, flag, mode, cred);
    try {
      if (typeof data === "string") {
        data = import_buffer2.Buffer.from(data, encoding);
      }
      await fd.write(data, 0, data.length, 0);
      callback?.(null);
    } finally {
      await fd.close();
    }
  }
  writeFileSync(fname, data, encoding, flag, mode, cred) {
    const fd = this.openSync(fname, flag, mode, cred);
    try {
      if (typeof data === "string") {
        data = import_buffer2.Buffer.from(data, encoding);
      }
      fd.writeSync(data, 0, data.length, 0);
    } finally {
      fd.closeSync();
    }
  }
  async appendFile(fname, data, encoding, flag, mode, cred, callback) {
    const fd = await this.open(fname, flag, mode, cred);
    try {
      if (typeof data === "string") {
        data = import_buffer2.Buffer.from(data, encoding);
      }
      await fd.write(data, 0, data.length, null);
      callback?.(null);
    } finally {
      await fd.close();
    }
  }
  appendFileSync(fname, data, encoding, flag, mode, cred) {
    const fd = this.openSync(fname, flag, mode, cred);
    try {
      if (typeof data === "string") {
        data = import_buffer2.Buffer.from(data, encoding);
      }
      fd.writeSync(data, 0, data.length, null);
    } finally {
      fd.closeSync();
    }
  }
  async chmod(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  chmodSync(p, mode, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async chown(p, new_uid, new_gid, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  chownSync(p, new_uid, new_gid, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async utimes(p, atime, mtime, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  utimesSync(p, atime, mtime, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async link(srcpath, dstpath, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  linkSync(srcpath, dstpath, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async symlink(srcpath, dstpath, type, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  symlinkSync(srcpath, dstpath, type, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  async readlink(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
  readlinkSync(p, cred) {
    throw new ApiError(95 /* ENOTSUP */);
  }
};
var BaseFileSystem = _BaseFileSystem;
__name(BaseFileSystem, "BaseFileSystem");
__publicField(BaseFileSystem, "Name", _BaseFileSystem.name);

// src/cred.ts
var _Cred = class {
  constructor(uid, gid, suid, sgid, euid, egid) {
    this.uid = uid;
    this.gid = gid;
    this.suid = suid;
    this.sgid = sgid;
    this.euid = euid;
    this.egid = egid;
  }
};
var Cred = _Cred;
__name(Cred, "Cred");
__publicField(Cred, "Root", new _Cred(0, 0, 0, 0, 0, 0));

// src/stats.ts
var import_buffer3 = __toESM(require_buffer(), 1);

// src/emulation/constants.ts
var S_IFMT = 61440;
var S_IFREG = 32768;
var S_IFDIR = 16384;
var S_IFLNK = 40960;

// src/stats.ts
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2[FileType2["FILE"] = S_IFREG] = "FILE";
  FileType2[FileType2["DIRECTORY"] = S_IFDIR] = "DIRECTORY";
  FileType2[FileType2["SYMLINK"] = S_IFLNK] = "SYMLINK";
  return FileType2;
})(FileType || {});
var Stats = class {
  static fromBuffer(buffer) {
    const size = buffer.readUInt32LE(0), mode = buffer.readUInt32LE(4), atime = buffer.readDoubleLE(8), mtime = buffer.readDoubleLE(16), ctime = buffer.readDoubleLE(24), uid = buffer.readUInt32LE(32), gid = buffer.readUInt32LE(36);
    return new Stats(mode & S_IFMT, size, mode & ~S_IFMT, atime, mtime, ctime, uid, gid);
  }
  /**
   * Clones the stats object.
   */
  static clone(s) {
    return new Stats(s.mode & S_IFMT, s.size, s.mode & ~S_IFMT, s.atimeMs, s.mtimeMs, s.ctimeMs, s.uid, s.gid, s.birthtimeMs);
  }
  blocks;
  mode;
  // ID of device containing file
  dev = 0;
  // inode number
  ino = 0;
  // device ID (if special file)
  rdev = 0;
  // number of hard links
  nlink = 1;
  // blocksize for file system I/O
  blksize = 4096;
  // user ID of owner
  uid = 0;
  // group ID of owner
  gid = 0;
  // Some file systems stash data on stats objects.
  fileData = null;
  atimeMs;
  mtimeMs;
  ctimeMs;
  birthtimeMs;
  size;
  get atime() {
    return new Date(this.atimeMs);
  }
  get mtime() {
    return new Date(this.mtimeMs);
  }
  get ctime() {
    return new Date(this.ctimeMs);
  }
  get birthtime() {
    return new Date(this.birthtimeMs);
  }
  /**
   * Provides information about a particular entry in the file system.
   * @param itemType Type of the item (FILE, DIRECTORY, SYMLINK, or SOCKET)
   * @param size Size of the item in bytes. For directories/symlinks,
   *   this is normally the size of the struct that represents the item.
   * @param mode Unix-style file mode (e.g. 0o644)
   * @param atimeMs time of last access, in milliseconds since epoch
   * @param mtimeMs time of last modification, in milliseconds since epoch
   * @param ctimeMs time of last time file status was changed, in milliseconds since epoch
   * @param uid the id of the user that owns the file
   * @param gid the id of the group that owns the file
   * @param birthtimeMs time of file creation, in milliseconds since epoch
   */
  constructor(itemType, size, mode, atimeMs, mtimeMs, ctimeMs, uid, gid, birthtimeMs) {
    this.size = size;
    let currentTime = 0;
    if (typeof atimeMs !== "number") {
      currentTime = Date.now();
      atimeMs = currentTime;
    }
    if (typeof mtimeMs !== "number") {
      if (!currentTime) {
        currentTime = Date.now();
      }
      mtimeMs = currentTime;
    }
    if (typeof ctimeMs !== "number") {
      if (!currentTime) {
        currentTime = Date.now();
      }
      ctimeMs = currentTime;
    }
    if (typeof birthtimeMs !== "number") {
      if (!currentTime) {
        currentTime = Date.now();
      }
      birthtimeMs = currentTime;
    }
    if (typeof uid !== "number") {
      uid = 0;
    }
    if (typeof gid !== "number") {
      gid = 0;
    }
    this.atimeMs = atimeMs;
    this.ctimeMs = ctimeMs;
    this.mtimeMs = mtimeMs;
    this.birthtimeMs = birthtimeMs;
    if (!mode) {
      switch (itemType) {
        case FileType.FILE:
          this.mode = 420;
          break;
        case FileType.DIRECTORY:
        default:
          this.mode = 511;
      }
    } else {
      this.mode = mode;
    }
    this.blocks = Math.ceil(size / 512);
    if ((this.mode & S_IFMT) == 0) {
      this.mode |= itemType;
    }
  }
  toBuffer() {
    const buffer = import_buffer3.Buffer.alloc(32);
    buffer.writeUInt32LE(this.size, 0);
    buffer.writeUInt32LE(this.mode, 4);
    buffer.writeDoubleLE(this.atime.getTime(), 8);
    buffer.writeDoubleLE(this.mtime.getTime(), 16);
    buffer.writeDoubleLE(this.ctime.getTime(), 24);
    buffer.writeUInt32LE(this.uid, 32);
    buffer.writeUInt32LE(this.gid, 36);
    return buffer;
  }
  /**
   * @return [Boolean] True if this item is a file.
   */
  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }
  /**
   * @return [Boolean] True if this item is a directory.
   */
  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }
  /**
   * @return [Boolean] True if this item is a symbolic link (only valid through lstat)
   */
  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }
  /**
   * Checks if a given user/group has access to this item
   * @param mode The request access as 4 bits (unused, read, write, execute)
   * @param uid The requesting UID
   * @param gid The requesting GID
   * @returns [Boolean] True if the request has access, false if the request does not
   */
  hasAccess(mode, cred) {
    if (cred.euid === 0 || cred.egid === 0) {
      return true;
    }
    const perms = this.mode & ~S_IFMT;
    let uMode = 15, gMode = 15, wMode = 15;
    if (cred.euid == this.uid) {
      const uPerms = (3840 & perms) >> 8;
      uMode = (mode ^ uPerms) & mode;
    }
    if (cred.egid == this.gid) {
      const gPerms = (240 & perms) >> 4;
      gMode = (mode ^ gPerms) & mode;
    }
    const wPerms = 15 & perms;
    wMode = (mode ^ wPerms) & mode;
    const result = uMode & gMode & wMode;
    return !result;
  }
  /**
   * Convert the current stats object into a cred object
   */
  getCred(uid = this.uid, gid = this.gid) {
    return new Cred(uid, gid, this.uid, this.gid, uid, gid);
  }
  /**
   * Change the mode of the file. We use this helper function to prevent messing
   * up the type of the file, which is encoded in mode.
   */
  chmod(mode) {
    this.mode = this.mode & S_IFMT | mode;
  }
  /**
   * Change the owner user/group of the file.
   * This function makes sure it is a valid UID/GID (that is, a 32 unsigned int)
   */
  chown(uid, gid) {
    if (!isNaN(+uid) && 0 <= +uid && +uid < 2 ** 32) {
      this.uid = uid;
    }
    if (!isNaN(+gid) && 0 <= +gid && +gid < 2 ** 32) {
      this.gid = gid;
    }
  }
  // We don't support the following types of files.
  isSocket() {
    return false;
  }
  isBlockDevice() {
    return false;
  }
  isCharacterDevice() {
    return false;
  }
  isFIFO() {
    return false;
  }
};
__name(Stats, "Stats");

// src/generic/preload_file.ts
var import_buffer4 = __toESM(require_buffer(), 1);
var PreloadFile = class extends BaseFile {
  _fs;
  _pos = 0;
  _path;
  _stat;
  _flag;
  _buffer;
  _dirty = false;
  /**
   * Creates a file with the given path and, optionally, the given contents. Note
   * that, if contents is specified, it will be mutated by the file!
   * @param _fs The file system that created the file.
   * @param _path
   * @param _mode The mode that the file was opened using.
   *   Dictates permissions and where the file pointer starts.
   * @param _stat The stats object for the given file.
   *   PreloadFile will mutate this object. Note that this object must contain
   *   the appropriate mode that the file was opened as.
   * @param contents A buffer containing the entire
   *   contents of the file. PreloadFile will mutate this buffer. If not
   *   specified, we assume it is a new file.
   */
  constructor(_fs, _path, _flag, _stat, contents) {
    super();
    this._fs = _fs;
    this._path = _path;
    this._flag = _flag;
    this._stat = _stat;
    this._buffer = contents ? contents : import_buffer4.Buffer.alloc(0);
    if (this._stat.size !== this._buffer.length && this._flag.isReadable()) {
      throw new Error(`Invalid buffer: Buffer is ${this._buffer.length} long, yet Stats object specifies that file is ${this._stat.size} long.`);
    }
  }
  /**
   * NONSTANDARD: Get the underlying buffer for this file. !!DO NOT MUTATE!! Will mess up dirty tracking.
   */
  getBuffer() {
    return this._buffer;
  }
  /**
   * NONSTANDARD: Get underlying stats for this file. !!DO NOT MUTATE!!
   */
  getStats() {
    return this._stat;
  }
  getFlag() {
    return this._flag;
  }
  /**
   * Get the path to this file.
   * @return [String] The path to the file.
   */
  getPath() {
    return this._path;
  }
  /**
   * Get the current file position.
   *
   * We emulate the following bug mentioned in the Node documentation:
   * > On Linux, positional writes don't work when the file is opened in append
   *   mode. The kernel ignores the position argument and always appends the data
   *   to the end of the file.
   * @return [Number] The current file position.
   */
  getPos() {
    if (this._flag.isAppendable()) {
      return this._stat.size;
    }
    return this._pos;
  }
  /**
   * Advance the current file position by the indicated number of positions.
   * @param [Number] delta
   */
  advancePos(delta) {
    return this._pos += delta;
  }
  /**
   * Set the file position.
   * @param [Number] newPos
   */
  setPos(newPos) {
    return this._pos = newPos;
  }
  /**
   * **Core**: Asynchronous sync. Must be implemented by subclasses of this
   * class.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  async sync() {
    this.syncSync();
  }
  /**
   * **Core**: Synchronous sync.
   */
  syncSync() {
    throw new ApiError(95 /* ENOTSUP */);
  }
  /**
   * **Core**: Asynchronous close. Must be implemented by subclasses of this
   * class.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  async close() {
    this.closeSync();
  }
  /**
   * **Core**: Synchronous close.
   */
  closeSync() {
    throw new ApiError(95 /* ENOTSUP */);
  }
  /**
   * Asynchronous `stat`.
   * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] cb
   */
  async stat() {
    return Stats.clone(this._stat);
  }
  /**
   * Synchronous `stat`.
   */
  statSync() {
    return Stats.clone(this._stat);
  }
  /**
   * Asynchronous truncate.
   * @param [Number] len
   * @param [Function(BrowserFS.ApiError)] cb
   */
  truncate(len) {
    this.truncateSync(len);
    if (this._flag.isSynchronous() && !getMount("/").metadata.synchronous) {
      return this.sync();
    }
  }
  /**
   * Synchronous truncate.
   * @param [Number] len
   */
  truncateSync(len) {
    this._dirty = true;
    if (!this._flag.isWriteable()) {
      throw new ApiError(1 /* EPERM */, "File not opened with a writeable mode.");
    }
    this._stat.mtimeMs = Date.now();
    if (len > this._buffer.length) {
      const buf = import_buffer4.Buffer.alloc(len - this._buffer.length, 0);
      this.writeSync(buf, 0, buf.length, this._buffer.length);
      if (this._flag.isSynchronous() && getMount("/").metadata.synchronous) {
        this.syncSync();
      }
      return;
    }
    this._stat.size = len;
    const newBuff = import_buffer4.Buffer.alloc(len);
    this._buffer.copy(newBuff, 0, 0, len);
    this._buffer = newBuff;
    if (this._flag.isSynchronous() && getMount("/").metadata.synchronous) {
      this.syncSync();
    }
  }
  /**
   * Write buffer to the file.
   * Note that it is unsafe to use fs.write multiple times on the same file
   * without waiting for the callback.
   * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
   *  the file.
   * @param [Number] offset Offset in the buffer to start reading data from.
   * @param [Number] length The amount of bytes to write to the file.
   * @param [Number] position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)]
   *   cb The number specifies the number of bytes written into the file.
   */
  async write(buffer, offset, length, position, callback) {
    const r = this.writeSync(buffer, offset, length, position);
    callback?.(null, r, buffer);
    return r;
  }
  /**
   * Write buffer to the file.
   * Note that it is unsafe to use fs.writeSync multiple times on the same file
   * without waiting for the callback.
   * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
   *  the file.
   * @param [Number] offset Offset in the buffer to start reading data from.
   * @param [Number] length The amount of bytes to write to the file.
   * @param [Number] position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   * @return [Number]
   */
  writeSync(buffer, offset, length, position) {
    this._dirty = true;
    if (position === void 0 || position === null) {
      position = this.getPos();
    }
    if (!this._flag.isWriteable()) {
      throw new ApiError(1 /* EPERM */, "File not opened with a writeable mode.");
    }
    const endFp = position + length;
    if (endFp > this._stat.size) {
      this._stat.size = endFp;
      if (endFp > this._buffer.length) {
        const newBuff = import_buffer4.Buffer.alloc(endFp);
        this._buffer.copy(newBuff);
        this._buffer = newBuff;
      }
    }
    const len = buffer.copy(this._buffer, position, offset, offset + length);
    this._stat.mtimeMs = Date.now();
    if (this._flag.isSynchronous()) {
      this.syncSync();
      return len;
    }
    this.setPos(position + len);
    return len;
  }
  /**
   * Read data from the file.
   * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
   *   written to.
   * @param [Number] offset The offset within the buffer where writing will
   *   start.
   * @param [Number] length An integer specifying the number of bytes to read.
   * @param [Number] position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)] cb The
   *   number is the number of bytes read
   */
  async read(buffer, offset, length, position, callback) {
    const result = { bytesRead: this.readSync(buffer, offset, length, position), buffer };
    callback?.(null, result.bytesRead, result.buffer);
    return result;
  }
  /**
   * Read data from the file.
   * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
   *   written to.
   * @param [Number] offset The offset within the buffer where writing will
   *   start.
   * @param [Number] length An integer specifying the number of bytes to read.
   * @param [Number] position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @return [Number]
   */
  readSync(buffer, offset, length, position) {
    if (!this._flag.isReadable()) {
      throw new ApiError(1 /* EPERM */, "File not opened with a readable mode.");
    }
    if (position === void 0 || position === null) {
      position = this.getPos();
    }
    const endRead = position + length;
    if (endRead > this._stat.size) {
      length = this._stat.size - position;
    }
    const rv = this._buffer.copy(buffer, offset, position, position + length);
    this._stat.atimeMs = Date.now();
    this._pos = position + length;
    return rv;
  }
  /**
   * Asynchronous `fchmod`.
   * @param [Number|String] mode
   */
  async chmod(mode) {
    this.chmodSync(mode);
  }
  /**
   * Synchronous `fchmod`.
   * @param [Number] mode
   */
  chmodSync(mode) {
    if (!this._fs.metadata.supportsProperties) {
      throw new ApiError(95 /* ENOTSUP */);
    }
    this._dirty = true;
    this._stat.chmod(mode);
    this.syncSync();
  }
  /**
   * Asynchronous `fchown`.
   * @param [Number] uid
   * @param [Number] gid
   */
  async chown(uid, gid) {
    this.chownSync(uid, gid);
  }
  /**
   * Synchronous `fchown`.
   * @param [Number] uid
   * @param [Number] gid
   */
  chownSync(uid, gid) {
    if (!this._fs.metadata.supportsProperties) {
      throw new ApiError(95 /* ENOTSUP */);
    }
    this._dirty = true;
    this._stat.chown(uid, gid);
    this.syncSync();
  }
  isDirty() {
    return this._dirty;
  }
  /**
   * Resets the dirty bit. Should only be called after a sync has completed successfully.
   */
  resetDirty() {
    this._dirty = false;
  }
};
__name(PreloadFile, "PreloadFile");

// src/utils.ts
var path2 = __toESM(require_path(), 1);
var import_buffer5 = __toESM(require_buffer(), 1);
function _min(d0, d1, d2, bx, ay) {
  return Math.min(d0 + 1, d1 + 1, d2 + 1, bx === ay ? d1 : d1 + 1);
}
__name(_min, "_min");
function levenshtein(a, b) {
  if (a === b) {
    return 0;
  }
  if (a.length > b.length) {
    [a, b] = [b, a];
  }
  let la = a.length;
  let lb = b.length;
  while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
    la--;
    lb--;
  }
  let offset = 0;
  while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
    offset++;
  }
  la -= offset;
  lb -= offset;
  if (la === 0 || lb === 1) {
    return lb;
  }
  const vector = new Array(la << 1);
  for (let y = 0; y < la; ) {
    vector[la + y] = a.charCodeAt(offset + y);
    vector[y] = ++y;
  }
  let x;
  let d0;
  let d1;
  let d2;
  let d3;
  for (x = 0; x + 3 < lb; ) {
    const bx0 = b.charCodeAt(offset + (d0 = x));
    const bx1 = b.charCodeAt(offset + (d1 = x + 1));
    const bx2 = b.charCodeAt(offset + (d2 = x + 2));
    const bx3 = b.charCodeAt(offset + (d3 = x + 3));
    let dd2 = x += 4;
    for (let y = 0; y < la; ) {
      const ay = vector[la + y];
      const dy = vector[y];
      d0 = _min(dy, d0, d1, bx0, ay);
      d1 = _min(d0, d1, d2, bx1, ay);
      d2 = _min(d1, d2, d3, bx2, ay);
      dd2 = _min(d2, d3, dd2, bx3, ay);
      vector[y++] = dd2;
      d3 = d2;
      d2 = d1;
      d1 = d0;
      d0 = dy;
    }
  }
  let dd = 0;
  for (; x < lb; ) {
    const bx0 = b.charCodeAt(offset + (d0 = x));
    dd = ++x;
    for (let y = 0; y < la; y++) {
      const dy = vector[y];
      vector[y] = dd = dy < d0 || dd < d0 ? dy > dd ? dd + 1 : dy + 1 : bx0 === vector[la + y] ? d0 : d0 + 1;
      d0 = dy;
    }
  }
  return dd;
}
__name(levenshtein, "levenshtein");
async function checkOptions(backend, opts) {
  const optsInfo = backend.Options;
  const fsName = backend.Name;
  let pendingValidators = 0;
  let callbackCalled = false;
  let loopEnded = false;
  for (const optName in optsInfo) {
    if (Object.prototype.hasOwnProperty.call(optsInfo, optName)) {
      const opt = optsInfo[optName];
      const providedValue = opts && opts[optName];
      if (providedValue === void 0 || providedValue === null) {
        if (!opt.optional) {
          const incorrectOptions = Object.keys(opts).filter((o) => !(o in optsInfo)).map((a) => {
            return { str: a, distance: levenshtein(optName, a) };
          }).filter((o) => o.distance < 5).sort((a, b) => a.distance - b.distance);
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          throw new ApiError(
            22 /* EINVAL */,
            `[${fsName}] Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` You provided unrecognized option '${incorrectOptions[0].str}'; perhaps you meant to type '${optName}'.` : ""}
Option description: ${opt.description}`
          );
        }
      } else {
        let typeMatches = false;
        if (Array.isArray(opt.type)) {
          typeMatches = opt.type.indexOf(typeof providedValue) !== -1;
        } else {
          typeMatches = typeof providedValue === opt.type;
        }
        if (!typeMatches) {
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          throw new ApiError(
            22 /* EINVAL */,
            `[${fsName}] Value provided for option ${optName} is not the proper type. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(", ")}}` : opt.type}, but received ${typeof providedValue}
Option description: ${opt.description}`
          );
        } else if (opt.validator) {
          pendingValidators++;
          try {
            await opt.validator(providedValue);
          } catch (e) {
            if (!callbackCalled) {
              if (e) {
                callbackCalled = true;
                throw e;
              }
              pendingValidators--;
              if (pendingValidators === 0 && loopEnded) {
                return;
              }
            }
          }
        }
      }
    }
  }
  loopEnded = true;
  if (pendingValidators === 0 && !callbackCalled) {
    return;
  }
}
__name(checkOptions, "checkOptions");
var setImmediate = typeof globalThis.setImmediate == "function" ? globalThis.setImmediate : (cb) => setTimeout(cb, 0);

// src/backends/backend.ts
function CreateBackend(options, cb) {
  cb = typeof options === "function" ? options : cb;
  checkOptions(this, options);
  const fs = new this(typeof options === "function" ? {} : options);
  if (typeof cb != "function") {
    return fs.whenReady();
  }
  fs.whenReady().then((fs2) => cb(null, fs2)).catch((err) => cb(err));
}
__name(CreateBackend, "CreateBackend");

// src/backends/GoogleDrive.ts
var _GoogleDriveFileSystem = class extends BaseFileSystem {
  static isAvailable() {
    return typeof globalThis.gapi?.client?.drive !== "undefined";
  }
  _client;
  constructor(client) {
    super();
    this._client = client;
  }
  get metadata() {
    return { ...super.metadata, name: _GoogleDriveFileSystem.Name };
  }
  READDIR_MAX_FILES_LIMIT = 1e3;
  READDIR_FIELDS = ["id", "name", "mimeType", "modifiedTime", "createdTime", "size"];
  READDIR_OPERATIONS_LIMIT = 30;
  // map: path -> { files: { name -> File } }
  dirFilesMap = {};
  _readdirTimes = 0;
  isReadonly = false;
  _getExistingFileId(path3) {
    if (path3 === "/" || path3 === "") {
      return "root";
    }
    const parentPath = this._getParentPath(path3);
    const parent = this.dirFilesMap[parentPath];
    if (!parent) {
      return null;
    }
    return parent.files[path3.split("/").pop()]?.id;
  }
  async _getFileId(path3, throwIfNotFound = true) {
    const id = this._getExistingFileId(path3);
    if (id === null) {
      const parentPath = this._getParentPath(path3);
      await this.readdir(parentPath, null, { withFileTypes: true }, true);
      return this._getExistingFileId(path3);
    }
    if (id === void 0 && throwIfNotFound) {
      throw ApiError.ENOENT(path3);
    }
    return id;
  }
  async readdir(path3, cred, optionsOrCallback = {}, internalCall = false) {
    if (!internalCall) {
      this._readdirTimes = 0;
    }
    if (this._readdirTimes++ > this.READDIR_OPERATIONS_LIMIT) {
      throw new Error("Too many readdir operations");
    }
    try {
      const fileId = await this._getFileId(path3);
      if (!fileId) {
        throw new Error(`Path not found: ${path3}`);
      }
      let files;
      if (this.dirFilesMap[path3]) {
        files = Object.values(this.dirFilesMap[path3].files);
      } else {
        const res = await gapi.client.drive.files.list({
          q: `'${fileId}' in parents and trashed=false`,
          // also include
          fields: `files(${this.READDIR_FIELDS.join(",")})`,
          pageSize: this.READDIR_MAX_FILES_LIMIT
        });
        files = res.result.files;
      }
      if (files.length >= this.READDIR_MAX_FILES_LIMIT) {
        console.warn(`Too many files in directory: ${path3}`);
      }
      const mapped = (
        /* options.withFileTypes;
        ? files.map(file => ({
        			name: file.name,
        			isDirectory: file.mimeType === 'application/vnd.google-apps.folder',
        	  }))
        	:  */
        files.map((file) => file.name)
      );
      this.dirFilesMap[path3] = {
        files: Object.fromEntries(files.map((file) => [file.name, file]))
        // nextPageToken: res.result.nextPageToken,
      };
      if (typeof optionsOrCallback === "function") {
        optionsOrCallback(null, mapped);
      }
      return mapped;
    } catch (err) {
      throw this._processError(err);
    }
  }
  _getParentPath(path3) {
    const parts = path3.split("/");
    parts.pop();
    return parts.join("/");
  }
  async _syncFile(path3, data, callback) {
    if (this.isReadonly) {
      console.log("[google drive] Skipping saving file because in read only mode", path3);
      return;
    } else {
      console.log("[google drive] Saving file", path3);
    }
    try {
      const name = path3.split("/").pop();
      let fileId = await this._getFileId(path3, false);
      if (!fileId) {
        const parentId = await this._getFileId(this._getParentPath(path3));
        const mimeType = "application/octet-stream";
        const res2 = await gapi.client.drive.files.create({
          // resource: fileMetadata,
          // media: {
          // 	mimeType: mimeType,
          // 	// body: blob,
          // }
          mimeType,
          name,
          parents: [parentId]
          // fields: "id",
        });
        fileId = res2.result.id;
      }
      const blob = new Blob([data], { type: "application/octet-stream" });
      const file = new File([blob], name, { type: "application/octet-stream" });
      const res = await fetch(`https://content.googleapis.com/upload/drive/v3/files/${fileId}?access_token=${gapi.auth.getToken().access_token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/octet-stream"
        },
        body: file
      });
      if (!res.ok)
        throw new Error("Failed to upload file");
    } catch (err) {
      throw this._processError(err);
    }
  }
  async mkdir(path3) {
    throw new Error("Not implemented");
  }
  async rmdir(path3) {
    throw new Error("Not implemented");
  }
  async unlink(path3) {
    throw new Error("Not implemented");
  }
  async createFile(p, _flags, mode, _cred) {
    const fileData = Buffer.alloc(0);
    try {
      await this._syncFile(p, fileData);
      return new GoogleDriveFile(this, p, _flags, new Stats(FileType.FILE, 0, 420, Date.now(), Date.now()), fileData);
    } catch (err) {
      throw this._processError(err);
    }
  }
  async openFile(path3, _flags, _cred, callback) {
    try {
      const fileId = await this._getFileId(path3);
      const res = await gapi.client.drive.files.get({
        fileId,
        alt: "media"
      });
      const body = res.body;
      const arrayBuffer = new ArrayBuffer(body.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < body.length; i++) {
        view[i] = body.charCodeAt(i);
      }
      const buffer = Buffer.from(arrayBuffer);
      const file = new GoogleDriveFile(this, path3, _flags, new Stats(FileType.FILE, buffer.length), buffer);
      callback?.(null, file);
      return file;
    } catch (err) {
      throw this._processError(err);
    }
  }
  async stat(path3, falseVar, cred, callback) {
    try {
      const fileId = await this._getFileId(path3);
      const parentPath = this._getParentPath(path3);
      const file = this.dirFilesMap[parentPath].files[path3.split("/").pop()];
      const isDir = file.mimeType === "application/vnd.google-apps.folder";
      const fileType = isDir ? FileType.DIRECTORY : FileType.FILE;
      const stats = new Stats(
        fileType,
        file.size ? +file.size : 4096,
        file.modifiedTime && new Date(file.modifiedTime).valueOf(),
        file.createdTime && new Date(file.createdTime).valueOf()
      );
      callback?.(null, stats);
      return stats;
    } catch (err) {
      throw this._processError(err);
    }
  }
  async rename(oldPath, newPath, callback) {
    try {
      const fileId = await this._getFileId(oldPath);
      const oldName = oldPath.split("/").pop();
      const newName = newPath.split("/").pop();
      const res = await gapi.client.drive.files.update({
        fileId,
        name: newName,
        fields: "id"
      });
      const newFileId = res.result.id;
      const map = this.dirFilesMap[this._getParentPath(newPath)];
      const file = map.files[oldName];
      delete map.files[oldName];
      map.files[newName] = file;
      file.name = newName;
      callback?.(null);
    } catch (err) {
      throw this._processError(err);
    }
  }
  _processError(err) {
    return err;
  }
};
var GoogleDriveFileSystem = _GoogleDriveFileSystem;
__name(GoogleDriveFileSystem, "GoogleDriveFileSystem");
__publicField(GoogleDriveFileSystem, "Name", "GoogleDriveV3");
__publicField(GoogleDriveFileSystem, "Create", CreateBackend.bind(_GoogleDriveFileSystem));
__publicField(GoogleDriveFileSystem, "Options", {});
var GoogleDriveFile = class extends PreloadFile {
  constructor(_fs, _path, _flag, _stat, contents) {
    super(_fs, _path, _flag, _stat, contents);
  }
  id;
  name;
  mimeType;
  modifiedTime;
  createdTime;
  size;
  async sync() {
    await this._fs._syncFile(this.getPath(), this.getBuffer());
  }
  async close() {
    await this.sync();
  }
};
__name(GoogleDriveFile, "GoogleDriveFile");
export {
  GoogleDriveFile,
  GoogleDriveFileSystem
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
