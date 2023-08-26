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
exports.FileSystemAccessFile = void 0;
var path_1 = require("path");
var api_error_1 = require("../core/api_error");
var cred_1 = require("../core/cred");
var file_flag_1 = require("../core/file_flag");
var file_system_1 = require("../core/file_system");
var stats_1 = require("../core/stats");
var util_1 = require("../core/util");
var preload_file_1 = require("../generic/preload_file");
var buffer_1 = require("buffer");
var handleError = function (cb, path) {
    if (path === void 0) { path = ''; }
    return function (error) {
        if (error.name === 'NotFoundError') {
            return cb(api_error_1.ApiError.ENOENT(path));
        }
        cb(error);
    };
};
var keysToArray = function (directoryKeys, cb, path) {
    var keys = [];
    var iterateKeys = function () {
        directoryKeys
            .next()
            .then(function (_a) {
            var done = _a.done, value = _a.value;
            if (done) {
                return cb(null, keys);
            }
            keys.push(value);
            iterateKeys();
        })
            .catch(handleError(cb, path));
    };
    iterateKeys();
};
var FileSystemAccessFile = /** @class */ (function (_super) {
    __extends(FileSystemAccessFile, _super);
    function FileSystemAccessFile(_fs, _path, _flag, _stat, contents) {
        return _super.call(this, _fs, _path, _flag, _stat, contents) || this;
    }
    FileSystemAccessFile.prototype.sync = function (cb) {
        var _this = this;
        if (this.isDirty()) {
            this._fs._sync(this.getPath(), this.getBuffer(), this.getStats(), cred_1.default.Root, function (e) {
                if (!e) {
                    _this.resetDirty();
                }
                cb(e);
            });
        }
        else {
            cb();
        }
    };
    FileSystemAccessFile.prototype.close = function (cb) {
        this.sync(cb);
    };
    return FileSystemAccessFile;
}(preload_file_1.default));
exports.FileSystemAccessFile = FileSystemAccessFile;
var FileSystemAccessFileSystem = /** @class */ (function (_super) {
    __extends(FileSystemAccessFileSystem, _super);
    function FileSystemAccessFileSystem(handle) {
        var _this = _super.call(this) || this;
        _this._handles = { '/': handle };
        return _this;
    }
    FileSystemAccessFileSystem.Create = function (_a, cb) {
        var handle = _a.handle;
        cb(null, new FileSystemAccessFileSystem(handle));
    };
    FileSystemAccessFileSystem.CreateAsync = function (opts) {
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
    FileSystemAccessFileSystem.isAvailable = function () {
        return typeof FileSystemHandle === 'function';
    };
    FileSystemAccessFileSystem.prototype.getName = function () {
        return FileSystemAccessFileSystem.Name;
    };
    FileSystemAccessFileSystem.prototype.isReadOnly = function () {
        return false;
    };
    FileSystemAccessFileSystem.prototype.supportsSymlinks = function () {
        return false;
    };
    FileSystemAccessFileSystem.prototype.supportsProps = function () {
        return false;
    };
    FileSystemAccessFileSystem.prototype.supportsSynch = function () {
        return false;
    };
    FileSystemAccessFileSystem.prototype._sync = function (p, data, stats, cred, cb) {
        var _this = this;
        this.stat(p, false, cred, function (err, currentStats) {
            if (stats.mtime !== currentStats.mtime) {
                _this.writeFile(p, data, null, file_flag_1.FileFlag.getFileFlag('w'), currentStats.mode, cred, cb);
            }
            else {
                cb(err);
            }
        });
    };
    FileSystemAccessFileSystem.prototype.rename = function (oldPath, newPath, cred, cb) {
        var _this = this;
        this.getHandle(oldPath, function (sourceError, handle) {
            if (sourceError) {
                return cb(sourceError);
            }
            if (handle instanceof FileSystemDirectoryHandle) {
                _this.readdir(oldPath, cred, function (readDirError, files) {
                    if (files === void 0) { files = []; }
                    if (readDirError) {
                        return cb(readDirError);
                    }
                    _this.mkdir(newPath, 'wx', cred, function (mkdirError) {
                        if (mkdirError) {
                            return cb(mkdirError);
                        }
                        if (files.length === 0) {
                            _this.unlink(oldPath, cred, cb);
                        }
                        else {
                            files.forEach(function (file) { return _this.rename((0, path_1.join)(oldPath, file), (0, path_1.join)(newPath, file), cred, function () { return _this.unlink(oldPath, cred, cb); }); });
                        }
                    });
                });
            }
            if (handle instanceof FileSystemFileHandle) {
                handle
                    .getFile()
                    .then(function (oldFile) {
                    return _this.getHandle((0, path_1.dirname)(newPath), function (destError, destFolder) {
                        if (destError) {
                            return cb(destError);
                        }
                        if (destFolder instanceof FileSystemDirectoryHandle) {
                            destFolder
                                .getFileHandle((0, path_1.basename)(newPath), { create: true })
                                .then(function (newFile) {
                                return newFile
                                    .createWritable()
                                    .then(function (writable) {
                                    return oldFile
                                        .arrayBuffer()
                                        .then(function (buffer) {
                                        return writable
                                            .write(buffer)
                                            .then(function () {
                                            writable.close();
                                            _this.unlink(oldPath, cred, cb);
                                        })
                                            .catch(handleError(cb, newPath));
                                    })
                                        .catch(handleError(cb, oldPath));
                                })
                                    .catch(handleError(cb, newPath));
                            })
                                .catch(handleError(cb, newPath));
                        }
                    });
                })
                    .catch(handleError(cb, oldPath));
            }
        });
    };
    FileSystemAccessFileSystem.prototype.writeFile = function (fname, data, encoding, flag, mode, cred, cb, createFile) {
        var _this = this;
        this.getHandle((0, path_1.dirname)(fname), function (error, handle) {
            if (error) {
                return cb(error);
            }
            if (handle instanceof FileSystemDirectoryHandle) {
                handle
                    .getFileHandle((0, path_1.basename)(fname), { create: true })
                    .then(function (file) {
                    return file
                        .createWritable()
                        .then(function (writable) {
                        return writable
                            .write(data)
                            .then(function () {
                            writable.close().catch(handleError(cb, fname));
                            cb(null, createFile ? _this.newFile(fname, flag, data) : undefined);
                        })
                            .catch(handleError(cb, fname));
                    })
                        .catch(handleError(cb, fname));
                })
                    .catch(handleError(cb, fname));
            }
        });
    };
    FileSystemAccessFileSystem.prototype.createFile = function (p, flag, mode, cred, cb) {
        this.writeFile(p, (0, util_1.emptyBuffer)(), null, flag, mode, cred, cb, true);
    };
    FileSystemAccessFileSystem.prototype.stat = function (path, isLstat, cred, cb) {
        this.getHandle(path, function (error, handle) {
            if (error) {
                return cb(error);
            }
            if (!handle) {
                return cb(api_error_1.ApiError.FileError(api_error_1.ErrorCode.EINVAL, path));
            }
            if (handle instanceof FileSystemDirectoryHandle) {
                return cb(null, new stats_1.default(stats_1.FileType.DIRECTORY, 4096));
            }
            if (handle instanceof FileSystemFileHandle) {
                handle
                    .getFile()
                    .then(function (_a) {
                    var lastModified = _a.lastModified, size = _a.size;
                    return cb(null, new stats_1.default(stats_1.FileType.FILE, size, undefined, undefined, lastModified));
                })
                    .catch(handleError(cb, path));
            }
        });
    };
    FileSystemAccessFileSystem.prototype.exists = function (p, cred, cb) {
        this.getHandle(p, function (error) { return cb(error === null); });
    };
    FileSystemAccessFileSystem.prototype.openFile = function (path, flags, cred, cb) {
        var _this = this;
        this.getHandle(path, function (error, handle) {
            if (error) {
                return cb(error);
            }
            if (handle instanceof FileSystemFileHandle) {
                handle
                    .getFile()
                    .then(function (file) {
                    return file
                        .arrayBuffer()
                        .then(function (buffer) { return cb(null, _this.newFile(path, flags, buffer, file.size, file.lastModified)); })
                        .catch(handleError(cb, path));
                })
                    .catch(handleError(cb, path));
            }
        });
    };
    FileSystemAccessFileSystem.prototype.unlink = function (path, cred, cb) {
        this.getHandle((0, path_1.dirname)(path), function (error, handle) {
            if (error) {
                return cb(error);
            }
            if (handle instanceof FileSystemDirectoryHandle) {
                handle
                    .removeEntry((0, path_1.basename)(path), { recursive: true })
                    .then(function () { return cb(null); })
                    .catch(handleError(cb, path));
            }
        });
    };
    FileSystemAccessFileSystem.prototype.rmdir = function (path, cred, cb) {
        this.unlink(path, cred, cb);
    };
    FileSystemAccessFileSystem.prototype.mkdir = function (p, mode, cred, cb) {
        var _this = this;
        var overwrite = mode && mode.flag && mode.flag.includes('w') && !mode.flag.includes('x');
        this.getHandle(p, function (_existingError, existingHandle) {
            if (existingHandle && !overwrite) {
                return cb(api_error_1.ApiError.EEXIST(p));
            }
            _this.getHandle((0, path_1.dirname)(p), function (error, handle) {
                if (error) {
                    return cb(error);
                }
                if (handle instanceof FileSystemDirectoryHandle) {
                    handle
                        .getDirectoryHandle((0, path_1.basename)(p), { create: true })
                        .then(function () { return cb(null); })
                        .catch(handleError(cb, p));
                }
            });
        });
    };
    FileSystemAccessFileSystem.prototype.readdir = function (path, cred, cb) {
        this.getHandle(path, function (readError, handle) {
            if (readError) {
                return cb(readError);
            }
            if (handle instanceof FileSystemDirectoryHandle) {
                keysToArray(handle.keys(), cb, path);
            }
        });
    };
    FileSystemAccessFileSystem.prototype.newFile = function (path, flag, data, size, lastModified) {
        return new FileSystemAccessFile(this, path, flag, new stats_1.default(stats_1.FileType.FILE, size || 0, undefined, undefined, lastModified || new Date().getTime()), buffer_1.Buffer.from(data));
    };
    FileSystemAccessFileSystem.prototype.getHandle = function (path, cb) {
        var _this = this;
        if (path === '/') {
            return cb(null, this._handles['/']);
        }
        var walkedPath = '/';
        var _a = path.split('/'), pathParts = _a.slice(1);
        var getHandleParts = function (_a) {
            var pathPart = _a[0], remainingPathParts = _a.slice(1);
            var walkingPath = (0, path_1.join)(walkedPath, pathPart);
            var continueWalk = function (handle) {
                walkedPath = walkingPath;
                _this._handles[walkedPath] = handle;
                if (remainingPathParts.length === 0) {
                    return cb(null, _this._handles[path]);
                }
                getHandleParts(remainingPathParts);
            };
            var handle = _this._handles[walkedPath];
            handle
                .getDirectoryHandle(pathPart)
                .then(continueWalk)
                .catch(function (error) {
                if (error.name === 'TypeMismatchError') {
                    handle.getFileHandle(pathPart).then(continueWalk).catch(handleError(cb, walkingPath));
                }
                else if (error.message === 'Name is not allowed.') {
                    cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOENT, error.message, walkingPath));
                }
                else {
                    handleError(cb, walkingPath)(error);
                }
            });
        };
        getHandleParts(pathParts);
    };
    FileSystemAccessFileSystem.Name = 'FileSystemAccess';
    FileSystemAccessFileSystem.Options = {};
    return FileSystemAccessFileSystem;
}(file_system_1.BaseFileSystem));
exports.default = FileSystemAccessFileSystem;
//# sourceMappingURL=FileSystemAccess.js.map