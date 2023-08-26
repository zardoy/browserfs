"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
// disable no-unused-vars since BaseFileSystem uses them a lot
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
exports.SynchronousFileSystem = exports.BaseFileSystem = void 0;
var api_error_1 = require("./api_error");
var file_flag_1 = require("./file_flag");
var path = require("path");
var util_1 = require("./util");
var buffer_1 = require("buffer");
/**
 * Basic filesystem class. Most filesystems should extend this class, as it
 * provides default implementations for a handful of methods.
 */
var BaseFileSystem = /** @class */ (function () {
    function BaseFileSystem() {
    }
    BaseFileSystem.prototype.supportsLinks = function () {
        return false;
    };
    BaseFileSystem.prototype.diskSpace = function (p, cb) {
        cb(0, 0);
    };
    /**
     * Opens the file at path p with the given flag. The file must exist.
     * @param p The path to open.
     * @param flag The flag to use when opening the file.
     */
    BaseFileSystem.prototype.openFile = function (p, flag, cred, cb) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Create the file at path p with the given mode. Then, open it with the given
     * flag.
     */
    BaseFileSystem.prototype.createFile = function (p, flag, mode, cred, cb) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.open = function (p, flag, mode, cred, cb) {
        var _this = this;
        var mustBeFile = function (e, stats) {
            if (e) {
                // File does not exist.
                switch (flag.pathNotExistsAction()) {
                    case file_flag_1.ActionType.CREATE_FILE:
                        // Ensure parent exists.
                        return _this.stat(path.dirname(p), false, cred, function (e, parentStats) {
                            if (e) {
                                cb(e);
                            }
                            else if (parentStats && !parentStats.isDirectory()) {
                                cb(api_error_1.ApiError.ENOTDIR(path.dirname(p)));
                            }
                            else {
                                _this.createFile(p, flag, mode, cred, cb);
                            }
                        });
                    case file_flag_1.ActionType.THROW_EXCEPTION:
                        return cb(api_error_1.ApiError.ENOENT(p));
                    default:
                        return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.'));
                }
            }
            else {
                // File exists.
                switch (flag.pathExistsAction()) {
                    case file_flag_1.ActionType.THROW_EXCEPTION:
                        return cb(api_error_1.ApiError.EEXIST(p));
                    case file_flag_1.ActionType.TRUNCATE_FILE:
                        // NOTE: In a previous implementation, we deleted the file and
                        // re-created it. However, this created a race condition if another
                        // asynchronous request was trying to read the file, as the file
                        // would not exist for a small period of time.
                        return _this.openFile(p, flag, cred, function (e, fd) {
                            if (e) {
                                cb(e);
                            }
                            else if (fd) {
                                fd.truncate(0, function () {
                                    fd.sync(function () {
                                        cb(null, fd);
                                    });
                                });
                            }
                            else {
                                (0, util_1.fail)();
                            }
                        });
                    case file_flag_1.ActionType.NOP:
                        return _this.openFile(p, flag, cred, cb);
                    default:
                        return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.'));
                }
            }
        };
        this.stat(p, false, cred, mustBeFile);
    };
    BaseFileSystem.prototype.access = function (p, mode, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.accessSync = function (p, mode, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.rename = function (oldPath, newPath, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.renameSync = function (oldPath, newPath, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.stat = function (p, isLstat, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.statSync = function (p, isLstat, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Opens the file at path p with the given flag. The file must exist.
     * @param p The path to open.
     * @param flag The flag to use when opening the file.
     * @return A File object corresponding to the opened file.
     */
    BaseFileSystem.prototype.openFileSync = function (p, flag, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Create the file at path p with the given mode. Then, open it with the given
     * flag.
     */
    BaseFileSystem.prototype.createFileSync = function (p, flag, mode, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.openSync = function (p, flag, mode, cred) {
        // Check if the path exists, and is a file.
        var stats;
        try {
            stats = this.statSync(p, false, cred);
        }
        catch (e) {
            // File does not exist.
            switch (flag.pathNotExistsAction()) {
                case file_flag_1.ActionType.CREATE_FILE:
                    // Ensure parent exists.
                    var parentStats = this.statSync(path.dirname(p), false, cred);
                    if (!parentStats.isDirectory()) {
                        throw api_error_1.ApiError.ENOTDIR(path.dirname(p));
                    }
                    return this.createFileSync(p, flag, mode, cred);
                case file_flag_1.ActionType.THROW_EXCEPTION:
                    throw api_error_1.ApiError.ENOENT(p);
                default:
                    throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.');
            }
        }
        if (!stats.hasAccess(mode, cred)) {
            throw api_error_1.ApiError.EACCES(p);
        }
        // File exists.
        switch (flag.pathExistsAction()) {
            case file_flag_1.ActionType.THROW_EXCEPTION:
                throw api_error_1.ApiError.EEXIST(p);
            case file_flag_1.ActionType.TRUNCATE_FILE:
                // Delete file.
                this.unlinkSync(p, cred);
                // Create file. Use the same mode as the old file.
                // Node itself modifies the ctime when this occurs, so this action
                // will preserve that behavior if the underlying file system
                // supports those properties.
                return this.createFileSync(p, flag, stats.mode, cred);
            case file_flag_1.ActionType.NOP:
                return this.openFileSync(p, flag, cred);
            default:
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.');
        }
    };
    BaseFileSystem.prototype.unlink = function (p, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.unlinkSync = function (p, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.rmdir = function (p, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.rmdirSync = function (p, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.mkdir = function (p, mode, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.mkdirSync = function (p, mode, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.readdir = function (p, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.readdirSync = function (p, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.exists = function (p, cred, cb) {
        this.stat(p, null, cred, function (err) {
            cb(!err);
        });
    };
    BaseFileSystem.prototype.existsSync = function (p, cred) {
        try {
            this.statSync(p, true, cred);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    BaseFileSystem.prototype.realpath = function (p, cache, cred, cb) {
        if (this.supportsLinks()) {
            // The path could contain symlinks. Split up the path,
            // resolve any symlinks, return the resolved string.
            var splitPath = p.split(path.sep);
            // TODO: Simpler to just pass through file, find sep and such.
            for (var i = 0; i < splitPath.length; i++) {
                var addPaths = splitPath.slice(0, i + 1);
                splitPath[i] = path.join.apply(null, addPaths);
            }
        }
        else {
            // No symlinks. We just need to verify that it exists.
            this.exists(p, cred, function (doesExist) {
                if (doesExist) {
                    cb(null, p);
                }
                else {
                    cb(api_error_1.ApiError.ENOENT(p));
                }
            });
        }
    };
    BaseFileSystem.prototype.realpathSync = function (p, cache, cred) {
        if (this.supportsLinks()) {
            // The path could contain symlinks. Split up the path,
            // resolve any symlinks, return the resolved string.
            var splitPath = p.split(path.sep);
            // TODO: Simpler to just pass through file, find sep and such.
            for (var i = 0; i < splitPath.length; i++) {
                var addPaths = splitPath.slice(0, i + 1);
                splitPath[i] = path.join.apply(path, addPaths);
            }
            return splitPath.join(path.sep);
        }
        else {
            // No symlinks. We just need to verify that it exists.
            if (this.existsSync(p, cred)) {
                return p;
            }
            else {
                throw api_error_1.ApiError.ENOENT(p);
            }
        }
    };
    BaseFileSystem.prototype.truncate = function (p, len, cred, cb) {
        this.open(p, file_flag_1.FileFlag.getFileFlag('r+'), 0x1a4, cred, function (er, fd) {
            if (er) {
                return cb(er);
            }
            fd.truncate(len, function (er) {
                fd.close(function (er2) {
                    cb(er || er2);
                });
            });
        });
    };
    BaseFileSystem.prototype.truncateSync = function (p, len, cred) {
        var fd = this.openSync(p, file_flag_1.FileFlag.getFileFlag('r+'), 0x1a4, cred);
        // Need to safely close FD, regardless of whether or not truncate succeeds.
        try {
            fd.truncateSync(len);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.readFile = function (fname, encoding, flag, cred, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        // Get file.
        this.open(fname, flag, 0x1a4, cred, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err, arg) {
                fd.close(function (err2) {
                    if (!err) {
                        err = err2;
                    }
                    return oldCb(err, arg);
                });
            };
            fd.stat(function (err, stat) {
                if (err) {
                    return cb(err);
                }
                // Allocate buffer.
                var buf = buffer_1.Buffer.alloc(stat.size);
                fd.read(buf, 0, stat.size, 0, function (err) {
                    if (err) {
                        return cb(err);
                    }
                    else if (encoding === null) {
                        return cb(err, buf);
                    }
                    try {
                        cb(null, buf.toString(encoding));
                    }
                    catch (e) {
                        cb(e);
                    }
                });
            });
        });
    };
    BaseFileSystem.prototype.readFileSync = function (fname, encoding, flag, cred) {
        // Get file.
        var fd = this.openSync(fname, flag, 0x1a4, cred);
        try {
            var stat = fd.statSync();
            // Allocate buffer.
            var buf = buffer_1.Buffer.alloc(stat.size);
            fd.readSync(buf, 0, stat.size, 0);
            fd.closeSync();
            if (encoding === null) {
                return buf;
            }
            return buf.toString(encoding);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.writeFile = function (fname, data, encoding, flag, mode, cred, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        // Get file.
        this.open(fname, flag, 0x1a4, cred, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err) {
                fd.close(function (err2) {
                    oldCb(err ? err : err2);
                });
            };
            try {
                if (typeof data === 'string') {
                    data = buffer_1.Buffer.from(data, encoding);
                }
            }
            catch (e) {
                return cb(e);
            }
            // Write into file.
            fd.write(data, 0, data.length, 0, cb);
        });
    };
    BaseFileSystem.prototype.writeFileSync = function (fname, data, encoding, flag, mode, cred) {
        // Get file.
        var fd = this.openSync(fname, flag, mode, cred);
        try {
            if (typeof data === 'string') {
                data = buffer_1.Buffer.from(data, encoding);
            }
            // Write into file.
            fd.writeSync(data, 0, data.length, 0);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.appendFile = function (fname, data, encoding, flag, mode, cred, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        this.open(fname, flag, mode, cred, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err) {
                fd.close(function (err2) {
                    oldCb(err ? err : err2);
                });
            };
            if (typeof data === 'string') {
                data = buffer_1.Buffer.from(data, encoding);
            }
            fd.write(data, 0, data.length, null, cb);
        });
    };
    BaseFileSystem.prototype.appendFileSync = function (fname, data, encoding, flag, mode, cred) {
        var fd = this.openSync(fname, flag, mode, cred);
        try {
            if (typeof data === 'string') {
                data = buffer_1.Buffer.from(data, encoding);
            }
            fd.writeSync(data, 0, data.length, null);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.chmod = function (p, isLchmod, mode, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.chmodSync = function (p, isLchmod, mode, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.chown = function (p, isLchown, new_uid, new_gid, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.chownSync = function (p, isLchown, new_uid, new_gid, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.utimes = function (p, atime, mtime, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.utimesSync = function (p, atime, mtime, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.link = function (srcpath, dstpath, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.linkSync = function (srcpath, dstpath, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.symlink = function (srcpath, dstpath, type, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.symlinkSync = function (srcpath, dstpath, type, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.readlink = function (p, cred, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.readlinkSync = function (p, cred) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    return BaseFileSystem;
}());
exports.BaseFileSystem = BaseFileSystem;
/**
 * Implements the asynchronous API in terms of the synchronous API.
 * @class SynchronousFileSystem
 */
var SynchronousFileSystem = /** @class */ (function (_super) {
    __extends(SynchronousFileSystem, _super);
    function SynchronousFileSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SynchronousFileSystem.prototype.supportsSynch = function () {
        return true;
    };
    SynchronousFileSystem.prototype.access = function (p, mode, cred, cb) {
        try {
            this.accessSync(p, mode, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.rename = function (oldPath, newPath, cred, cb) {
        try {
            this.renameSync(oldPath, newPath, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.stat = function (p, isLstat, cred, cb) {
        try {
            cb(null, this.statSync(p, isLstat, cred));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.open = function (p, flags, mode, cred, cb) {
        try {
            cb(null, this.openSync(p, flags, mode, cred));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.unlink = function (p, cred, cb) {
        try {
            this.unlinkSync(p, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.rmdir = function (p, cred, cb) {
        try {
            this.rmdirSync(p, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.mkdir = function (p, mode, cred, cb) {
        try {
            this.mkdirSync(p, mode, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.readdir = function (p, cred, cb) {
        try {
            cb(null, this.readdirSync(p, cred));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.chmod = function (p, isLchmod, mode, cred, cb) {
        try {
            this.chmodSync(p, isLchmod, mode, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.chown = function (p, isLchown, new_uid, new_gid, cred, cb) {
        try {
            this.chownSync(p, isLchown, new_uid, new_gid, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.utimes = function (p, atime, mtime, cred, cb) {
        try {
            this.utimesSync(p, atime, mtime, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.link = function (srcpath, dstpath, cred, cb) {
        try {
            this.linkSync(srcpath, dstpath, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.symlink = function (srcpath, dstpath, type, cred, cb) {
        try {
            this.symlinkSync(srcpath, dstpath, type, cred);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.readlink = function (p, cred, cb) {
        try {
            cb(null, this.readlinkSync(p, cred));
        }
        catch (e) {
            cb(e);
        }
    };
    return SynchronousFileSystem;
}(BaseFileSystem));
exports.SynchronousFileSystem = SynchronousFileSystem;
//# sourceMappingURL=file_system.js.map