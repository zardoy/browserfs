"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mutex_1 = require("./mutex");
/**
 * This class serializes access to an underlying async filesystem.
 * For example, on an OverlayFS instance with an async lower
 * directory operations like rename and rmdir may involve multiple
 * requests involving both the upper and lower filesystems -- they
 * are not executed in a single atomic step.  OverlayFS uses this
 * LockedFS to avoid having to reason about the correctness of
 * multiple requests interleaving.
 */
var LockedFS = /** @class */ (function () {
    function LockedFS(fs) {
        this._fs = fs;
        this._mu = new mutex_1.default();
    }
    LockedFS.prototype.getName = function () {
        return 'LockedFS<' + this._fs.getName() + '>';
    };
    LockedFS.prototype.getFSUnlocked = function () {
        return this._fs;
    };
    LockedFS.prototype.diskSpace = function (p, cb) {
        // FIXME: should this lock?
        this._fs.diskSpace(p, cb);
    };
    LockedFS.prototype.isReadOnly = function () {
        return this._fs.isReadOnly();
    };
    LockedFS.prototype.supportsLinks = function () {
        return this._fs.supportsLinks();
    };
    LockedFS.prototype.supportsProps = function () {
        return this._fs.supportsProps();
    };
    LockedFS.prototype.supportsSynch = function () {
        return this._fs.supportsSynch();
    };
    LockedFS.prototype.rename = function (oldPath, newPath, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.rename(oldPath, newPath, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.renameSync = function (oldPath, newPath, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.renameSync(oldPath, newPath, cred);
    };
    LockedFS.prototype.stat = function (p, isLstat, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.stat(p, isLstat, cred, function (err, stat) {
                _this._mu.unlock();
                cb(err, stat);
            });
        });
    };
    LockedFS.prototype.statSync = function (p, isLstat, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.statSync(p, isLstat, cred);
    };
    LockedFS.prototype.access = function (p, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.access(p, mode, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.accessSync = function (p, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.accessSync(p, mode, cred);
    };
    LockedFS.prototype.open = function (p, flag, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.open(p, flag, mode, cred, function (err, fd) {
                _this._mu.unlock();
                cb(err, fd);
            });
        });
    };
    LockedFS.prototype.openSync = function (p, flag, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.openSync(p, flag, mode, cred);
    };
    LockedFS.prototype.unlink = function (p, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.unlink(p, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.unlinkSync = function (p, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.unlinkSync(p, cred);
    };
    LockedFS.prototype.rmdir = function (p, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.rmdir(p, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.rmdirSync = function (p, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.rmdirSync(p, cred);
    };
    LockedFS.prototype.mkdir = function (p, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.mkdir(p, mode, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.mkdirSync = function (p, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.mkdirSync(p, mode, cred);
    };
    LockedFS.prototype.readdir = function (p, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.readdir(p, cred, function (err, files) {
                _this._mu.unlock();
                cb(err, files);
            });
        });
    };
    LockedFS.prototype.readdirSync = function (p, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.readdirSync(p, cred);
    };
    LockedFS.prototype.exists = function (p, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.exists(p, cred, function (exists) {
                _this._mu.unlock();
                cb(exists);
            });
        });
    };
    LockedFS.prototype.existsSync = function (p, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.existsSync(p, cred);
    };
    LockedFS.prototype.realpath = function (p, cache, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.realpath(p, cache, cred, function (err, resolvedPath) {
                _this._mu.unlock();
                cb(err, resolvedPath);
            });
        });
    };
    LockedFS.prototype.realpathSync = function (p, cache, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.realpathSync(p, cache, cred);
    };
    LockedFS.prototype.truncate = function (p, len, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.truncate(p, len, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.truncateSync = function (p, len, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.truncateSync(p, len, cred);
    };
    LockedFS.prototype.readFile = function (fname, encoding, flag, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.readFile(fname, encoding, flag, cred, function (err, data) {
                _this._mu.unlock();
                cb(err, data);
            });
        });
    };
    LockedFS.prototype.readFileSync = function (fname, encoding, flag, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.readFileSync(fname, encoding, flag, cred);
    };
    LockedFS.prototype.writeFile = function (fname, data, encoding, flag, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.writeFile(fname, data, encoding, flag, mode, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.writeFileSync = function (fname, data, encoding, flag, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.writeFileSync(fname, data, encoding, flag, mode, cred);
    };
    LockedFS.prototype.appendFile = function (fname, data, encoding, flag, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.appendFile(fname, data, encoding, flag, mode, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.appendFileSync = function (fname, data, encoding, flag, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.appendFileSync(fname, data, encoding, flag, mode, cred);
    };
    LockedFS.prototype.chmod = function (p, isLchmod, mode, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.chmod(p, isLchmod, mode, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.chmodSync = function (p, isLchmod, mode, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.chmodSync(p, isLchmod, mode, cred);
    };
    LockedFS.prototype.chown = function (p, isLchown, new_uid, new_gid, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.chown(p, isLchown, new_uid, new_gid, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.chownSync = function (p, isLchown, new_uid, new_gid, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.chownSync(p, isLchown, new_uid, new_gid, cred);
    };
    LockedFS.prototype.utimes = function (p, atime, mtime, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.utimes(p, atime, mtime, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.utimesSync = function (p, atime, mtime, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.utimesSync(p, atime, mtime, cred);
    };
    LockedFS.prototype.link = function (srcpath, dstpath, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.link(srcpath, dstpath, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.linkSync = function (srcpath, dstpath, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.linkSync(srcpath, dstpath, cred);
    };
    LockedFS.prototype.symlink = function (srcpath, dstpath, type, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.symlink(srcpath, dstpath, type, cred, function (err) {
                _this._mu.unlock();
                cb(err);
            });
        });
    };
    LockedFS.prototype.symlinkSync = function (srcpath, dstpath, type, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.symlinkSync(srcpath, dstpath, type, cred);
    };
    LockedFS.prototype.readlink = function (p, cred, cb) {
        var _this = this;
        this._mu.lock(function () {
            _this._fs.readlink(p, cred, function (err, linkString) {
                _this._mu.unlock();
                cb(err, linkString);
            });
        });
    };
    LockedFS.prototype.readlinkSync = function (p, cred) {
        if (this._mu.isLocked()) {
            throw new Error('invalid sync call');
        }
        return this._fs.readlinkSync(p, cred);
    };
    return LockedFS;
}());
exports.default = LockedFS;
//# sourceMappingURL=locked_fs.js.map