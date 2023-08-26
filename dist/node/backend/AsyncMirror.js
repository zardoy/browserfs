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
var file_system_1 = require("../core/file_system");
var api_error_1 = require("../core/api_error");
var file_flag_1 = require("../core/file_flag");
var preload_file_1 = require("../generic/preload_file");
var path = require("path");
var cred_1 = require("../core/cred");
/**
 * We define our own file to interpose on syncSync() for mirroring purposes.
 */
var MirrorFile = /** @class */ (function (_super) {
    __extends(MirrorFile, _super);
    function MirrorFile(fs, path, flag, stat, data) {
        return _super.call(this, fs, path, flag, stat, data) || this;
    }
    MirrorFile.prototype.syncSync = function () {
        if (this.isDirty()) {
            this._fs._syncSync(this);
            this.resetDirty();
        }
    };
    MirrorFile.prototype.closeSync = function () {
        this.syncSync();
    };
    return MirrorFile;
}(preload_file_1.default));
/**
 * AsyncMirrorFS mirrors a synchronous filesystem into an asynchronous filesystem
 * by:
 *
 * * Performing operations over the in-memory copy, while asynchronously pipelining them
 *   to the backing store.
 * * During application loading, the contents of the async file system can be reloaded into
 *   the synchronous store, if desired.
 *
 * The two stores will be kept in sync. The most common use-case is to pair a synchronous
 * in-memory filesystem with an asynchronous backing store.
 *
 * Example: Mirroring an IndexedDB file system to an in memory file system. Now, you can use
 * IndexedDB synchronously.
 *
 * ```javascript
 * BrowserFS.configure({
 *   fs: "AsyncMirror",
 *   options: {
 *     sync: { fs: "InMemory" },
 *     async: { fs: "IndexedDB" }
 *   }
 * }, function(e) {
 *   // BrowserFS is initialized and ready-to-use!
 * });
 * ```
 *
 * Or, alternatively:
 *
 * ```javascript
 * BrowserFS.FileSystem.IndexedDB.Create(function(e, idbfs) {
 *   BrowserFS.FileSystem.InMemory.Create(function(e, inMemory) {
 *     BrowserFS.FileSystem.AsyncMirror({
 *       sync: inMemory, async: idbfs
 *     }, function(e, mirrored) {
 *       BrowserFS.initialize(mirrored);
 *     });
 *   });
 * });
 * ```
 */
var AsyncMirror = /** @class */ (function (_super) {
    __extends(AsyncMirror, _super);
    /**
     * **Deprecated; use AsyncMirror.Create() method instead.**
     *
     * Mirrors the synchronous file system into the asynchronous file system.
     *
     * **IMPORTANT**: You must call `initialize` on the file system before it can be used.
     * @param sync The synchronous file system to mirror the asynchronous file system to.
     * @param async The asynchronous file system to mirror.
     */
    function AsyncMirror(sync, async) {
        var _this = _super.call(this) || this;
        /**
         * Queue of pending asynchronous operations.
         */
        _this._queue = [];
        _this._queueRunning = false;
        _this._isInitialized = false;
        _this._initializeCallbacks = [];
        _this._sync = sync;
        _this._async = async;
        return _this;
    }
    /**
     * Constructs and initializes an AsyncMirror file system with the given options.
     */
    AsyncMirror.Create = function (opts, cb) {
        try {
            var fs_1 = new AsyncMirror(opts.sync, opts.async);
            fs_1._initialize(function (e) {
                if (e) {
                    cb(e);
                }
                else {
                    cb(null, fs_1);
                }
            });
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * Asynchronously constructs and initializes an AsyncMirror file system with the given options.
     */
    AsyncMirror.CreateAsync = function (opts) {
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
    AsyncMirror.isAvailable = function () {
        return true;
    };
    AsyncMirror.prototype.getName = function () {
        return AsyncMirror.Name;
    };
    AsyncMirror.prototype._syncSync = function (fd) {
        var stats = fd.getStats();
        this._sync.writeFileSync(fd.getPath(), fd.getBuffer(), null, file_flag_1.FileFlag.getFileFlag('w'), stats.mode, stats.getCred(0, 0));
        this.enqueueOp({
            apiMethod: 'writeFile',
            arguments: [fd.getPath(), fd.getBuffer(), null, fd.getFlag(), stats.mode, stats.getCred(0, 0)],
        });
    };
    AsyncMirror.prototype.isReadOnly = function () {
        return false;
    };
    AsyncMirror.prototype.supportsSynch = function () {
        return true;
    };
    AsyncMirror.prototype.supportsLinks = function () {
        return false;
    };
    AsyncMirror.prototype.supportsProps = function () {
        return this._sync.supportsProps() && this._async.supportsProps();
    };
    AsyncMirror.prototype.renameSync = function (oldPath, newPath, cred) {
        this._sync.renameSync(oldPath, newPath, cred);
        this.enqueueOp({
            apiMethod: 'rename',
            arguments: [oldPath, newPath, cred],
        });
    };
    AsyncMirror.prototype.statSync = function (p, isLstat, cred) {
        return this._sync.statSync(p, isLstat, cred);
    };
    AsyncMirror.prototype.openSync = function (p, flag, mode, cred) {
        // Sanity check: Is this open/close permitted?
        var fd = this._sync.openSync(p, flag, mode, cred);
        fd.closeSync();
        return new MirrorFile(this, p, flag, this._sync.statSync(p, false, cred), this._sync.readFileSync(p, null, file_flag_1.FileFlag.getFileFlag('r'), cred));
    };
    AsyncMirror.prototype.unlinkSync = function (p, cred) {
        this._sync.unlinkSync(p, cred);
        this.enqueueOp({
            apiMethod: 'unlink',
            arguments: [p, cred],
        });
    };
    AsyncMirror.prototype.rmdirSync = function (p, cred) {
        this._sync.rmdirSync(p, cred);
        this.enqueueOp({
            apiMethod: 'rmdir',
            arguments: [p, cred],
        });
    };
    AsyncMirror.prototype.mkdirSync = function (p, mode, cred) {
        this._sync.mkdirSync(p, mode, cred);
        this.enqueueOp({
            apiMethod: 'mkdir',
            arguments: [p, mode, cred],
        });
    };
    AsyncMirror.prototype.readdirSync = function (p, cred) {
        return this._sync.readdirSync(p, cred);
    };
    AsyncMirror.prototype.existsSync = function (p, cred) {
        return this._sync.existsSync(p, cred);
    };
    AsyncMirror.prototype.chmodSync = function (p, isLchmod, mode, cred) {
        this._sync.chmodSync(p, isLchmod, mode, cred);
        this.enqueueOp({
            apiMethod: 'chmod',
            arguments: [p, isLchmod, mode, cred],
        });
    };
    AsyncMirror.prototype.chownSync = function (p, isLchown, new_uid, new_gid, cred) {
        this._sync.chownSync(p, isLchown, new_uid, new_gid, cred);
        this.enqueueOp({
            apiMethod: 'chown',
            arguments: [p, isLchown, new_uid, new_gid, cred],
        });
    };
    AsyncMirror.prototype.utimesSync = function (p, atime, mtime, cred) {
        this._sync.utimesSync(p, atime, mtime, cred);
        this.enqueueOp({
            apiMethod: 'utimes',
            arguments: [p, atime, mtime, cred],
        });
    };
    /**
     * Called once to load up files from async storage into sync storage.
     */
    AsyncMirror.prototype._initialize = function (userCb) {
        var _this = this;
        var callbacks = this._initializeCallbacks;
        var end = function (e) {
            _this._isInitialized = !e;
            _this._initializeCallbacks = [];
            callbacks.forEach(function (cb) { return cb(e); });
        };
        if (!this._isInitialized) {
            // First call triggers initialization, the rest wait.
            if (callbacks.push(userCb) === 1) {
                var copyDirectory_1 = function (p, mode, cb) {
                    if (p !== '/') {
                        _this._async.stat(p, true, cred_1.default.Root, function (err, stats) {
                            if (err) {
                                cb(err);
                            }
                            _this._sync.mkdirSync(p, stats.mode, stats.getCred());
                        });
                    }
                    _this._async.readdir(p, cred_1.default.Root, function (err, files) {
                        var i = 0;
                        // NOTE: This function must not be in a lexically nested statement,
                        // such as an if or while statement. Safari refuses to run the
                        // script since it is undefined behavior.
                        function copyNextFile(err) {
                            if (err) {
                                cb(err);
                            }
                            else if (i < files.length) {
                                copyItem_1(path.join(p, files[i]), copyNextFile);
                                i++;
                            }
                            else {
                                cb();
                            }
                        }
                        if (err) {
                            cb(err);
                        }
                        else {
                            copyNextFile();
                        }
                    });
                }, copyFile_1 = function (p, mode, cb) {
                    _this._async.readFile(p, null, file_flag_1.FileFlag.getFileFlag('r'), cred_1.default.Root, function (err, data) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            try {
                                _this._sync.writeFileSync(p, data, null, file_flag_1.FileFlag.getFileFlag('w'), mode, cred_1.default.Root);
                            }
                            catch (e) {
                                err = e;
                            }
                            finally {
                                cb(err);
                            }
                        }
                    });
                }, copyItem_1 = function (p, cb) {
                    _this._async.stat(p, false, cred_1.default.Root, function (err, stats) {
                        if (err) {
                            cb(err);
                        }
                        else if (stats.isDirectory()) {
                            copyDirectory_1(p, stats.mode, cb);
                        }
                        else {
                            copyFile_1(p, stats.mode, cb);
                        }
                    });
                };
                copyDirectory_1('/', 0, end);
            }
        }
        else {
            userCb();
        }
    };
    AsyncMirror.prototype.enqueueOp = function (op) {
        var _this = this;
        this._queue.push(op);
        if (!this._queueRunning) {
            this._queueRunning = true;
            var doNextOp_1 = function (err) {
                if (err) {
                    throw new Error("WARNING: File system has desynchronized. Received following error: ".concat(err, "\n$"));
                }
                if (_this._queue.length > 0) {
                    var op_1 = _this._queue.shift(), args = op_1.arguments;
                    args.push(doNextOp_1);
                    _this._async[op_1.apiMethod].apply(_this._async, args);
                }
                else {
                    _this._queueRunning = false;
                }
            };
            doNextOp_1();
        }
    };
    AsyncMirror.Name = 'AsyncMirror';
    AsyncMirror.Options = {
        sync: {
            type: 'object',
            description: 'The synchronous file system to mirror the asynchronous file system to.',
            validator: function (v, cb) {
                if (v && typeof v['supportsSynch'] === 'function' && v.supportsSynch()) {
                    cb();
                }
                else {
                    cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "'sync' option must be a file system that supports synchronous operations"));
                }
            },
        },
        async: {
            type: 'object',
            description: 'The asynchronous file system to mirror.',
        },
    };
    return AsyncMirror;
}(file_system_1.SynchronousFileSystem));
exports.default = AsyncMirror;
//# sourceMappingURL=AsyncMirror.js.map