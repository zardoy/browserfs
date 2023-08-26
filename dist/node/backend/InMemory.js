"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
var key_value_filesystem_1 = require("../generic/key_value_filesystem");
/**
 * A simple in-memory key-value store backed by a JavaScript object.
 */
var InMemoryStore = /** @class */ (function () {
    function InMemoryStore() {
        this.store = new Map();
    }
    InMemoryStore.prototype.name = function () {
        return InMemoryFileSystem.Name;
    };
    InMemoryStore.prototype.clear = function () {
        this.store.clear();
    };
    InMemoryStore.prototype.beginTransaction = function (type) {
        return new key_value_filesystem_1.SimpleSyncRWTransaction(this);
    };
    InMemoryStore.prototype.get = function (key) {
        return this.store.get(key);
    };
    InMemoryStore.prototype.put = function (key, data, overwrite) {
        if (!overwrite && this.store.has(key)) {
            return false;
        }
        this.store.set(key, data);
        return true;
    };
    InMemoryStore.prototype.del = function (key) {
        this.store.delete(key);
    };
    return InMemoryStore;
}());
exports.InMemoryStore = InMemoryStore;
/**
 * A simple in-memory file system backed by an InMemoryStore.
 * Files are not persisted across page loads.
 */
var InMemoryFileSystem = /** @class */ (function (_super) {
    __extends(InMemoryFileSystem, _super);
    function InMemoryFileSystem() {
        return _super.call(this, { store: new InMemoryStore() }) || this;
    }
    /**
     * Creates an InMemoryFileSystem instance.
     */
    InMemoryFileSystem.Create = function (options, cb) {
        cb(null, new InMemoryFileSystem());
    };
    InMemoryFileSystem.CreateAsync = function (opts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Create(opts, function (error, fs) {
                if (error || !fs) {
                    reject(error);
                }
                else {
                    resolve(fs);
                }
            });
        });
    };
    InMemoryFileSystem.Name = 'InMemory';
    InMemoryFileSystem.Options = {};
    return InMemoryFileSystem;
}(key_value_filesystem_1.SyncKeyValueFileSystem));
exports.default = InMemoryFileSystem;
//# sourceMappingURL=InMemory.js.map