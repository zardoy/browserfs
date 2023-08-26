"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePerm = exports.FileType = void 0;
var cred_1 = require("./cred");
var buffer_1 = require("buffer");
/**
 * Indicates the type of the given file. Applied to 'mode'.
 */
var FileType;
(function (FileType) {
    FileType[FileType["FILE"] = 32768] = "FILE";
    FileType[FileType["DIRECTORY"] = 16384] = "DIRECTORY";
    FileType[FileType["SYMLINK"] = 40960] = "SYMLINK";
})(FileType = exports.FileType || (exports.FileType = {}));
/**
 * Indicates the different permssions on the file.
 */
var FilePerm;
(function (FilePerm) {
    FilePerm[FilePerm["READ"] = 4] = "READ";
    FilePerm[FilePerm["WRITE"] = 2] = "WRITE";
    FilePerm[FilePerm["EXECUTE"] = 1] = "EXECUTE";
})(FilePerm = exports.FilePerm || (exports.FilePerm = {}));
/**
 * Emulation of Node's `fs.Stats` object.
 *
 * Attribute descriptions are from `man 2 stat'
 * @see http://nodejs.org/api/fs.html#fs_class_fs_stats
 * @see http://man7.org/linux/man-pages/man2/stat.2.html
 */
var Stats = /** @class */ (function () {
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
    function Stats(itemType, size, mode, atimeMs, mtimeMs, ctimeMs, uid, gid, birthtimeMs) {
        /**
         * UNSUPPORTED ATTRIBUTES
         * I assume no one is going to need these details, although we could fake
         * appropriate values if need be.
         */
        // ID of device containing file
        this.dev = 0;
        // inode number
        this.ino = 0;
        // device ID (if special file)
        this.rdev = 0;
        // number of hard links
        this.nlink = 1;
        // blocksize for file system I/O
        this.blksize = 4096;
        // user ID of owner
        this.uid = 0;
        // group ID of owner
        this.gid = 0;
        // XXX: Some file systems stash data on stats objects.
        this.fileData = null;
        this.size = size;
        var currentTime = 0;
        if (typeof atimeMs !== 'number') {
            currentTime = Date.now();
            atimeMs = currentTime;
        }
        if (typeof mtimeMs !== 'number') {
            if (!currentTime) {
                currentTime = Date.now();
            }
            mtimeMs = currentTime;
        }
        if (typeof ctimeMs !== 'number') {
            if (!currentTime) {
                currentTime = Date.now();
            }
            ctimeMs = currentTime;
        }
        if (typeof birthtimeMs !== 'number') {
            if (!currentTime) {
                currentTime = Date.now();
            }
            birthtimeMs = currentTime;
        }
        if (typeof uid !== 'number') {
            uid = 0;
        }
        if (typeof gid !== 'number') {
            gid = 0;
        }
        this.atimeMs = atimeMs;
        this.ctimeMs = ctimeMs;
        this.mtimeMs = mtimeMs;
        this.birthtimeMs = birthtimeMs;
        if (!mode) {
            switch (itemType) {
                case FileType.FILE:
                    this.mode = 0x1a4;
                    break;
                case FileType.DIRECTORY:
                default:
                    this.mode = 0x1ff;
            }
        }
        else {
            this.mode = mode;
        }
        // number of 512B blocks allocated
        this.blocks = Math.ceil(size / 512);
        // Check if mode also includes top-most bits, which indicate the file's
        // type.
        if (this.mode < 0x1000) {
            this.mode |= itemType;
        }
    }
    Stats.fromBuffer = function (buffer) {
        var size = buffer.readUInt32LE(0), mode = buffer.readUInt32LE(4), atime = buffer.readDoubleLE(8), mtime = buffer.readDoubleLE(16), ctime = buffer.readDoubleLE(24), uid = buffer.readUInt32LE(32), gid = buffer.readUInt32LE(36);
        return new Stats(mode & 0xf000, size, mode & 0xfff, atime, mtime, ctime, uid, gid);
    };
    /**
     * Clones the stats object.
     */
    Stats.clone = function (s) {
        return new Stats(s.mode & 0xf000, s.size, s.mode & 0xfff, s.atimeMs, s.mtimeMs, s.ctimeMs, s.uid, s.gid, s.birthtimeMs);
    };
    Object.defineProperty(Stats.prototype, "atime", {
        get: function () {
            return new Date(this.atimeMs);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stats.prototype, "mtime", {
        get: function () {
            return new Date(this.mtimeMs);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stats.prototype, "ctime", {
        get: function () {
            return new Date(this.ctimeMs);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stats.prototype, "birthtime", {
        get: function () {
            return new Date(this.birthtimeMs);
        },
        enumerable: false,
        configurable: true
    });
    Stats.prototype.toBuffer = function () {
        var buffer = buffer_1.Buffer.alloc(32);
        buffer.writeUInt32LE(this.size, 0);
        buffer.writeUInt32LE(this.mode, 4);
        buffer.writeDoubleLE(this.atime.getTime(), 8);
        buffer.writeDoubleLE(this.mtime.getTime(), 16);
        buffer.writeDoubleLE(this.ctime.getTime(), 24);
        buffer.writeUInt32LE(this.uid, 32);
        buffer.writeUInt32LE(this.gid, 36);
        return buffer;
    };
    /**
     * @return [Boolean] True if this item is a file.
     */
    Stats.prototype.isFile = function () {
        return (this.mode & 0xf000) === FileType.FILE;
    };
    /**
     * @return [Boolean] True if this item is a directory.
     */
    Stats.prototype.isDirectory = function () {
        return (this.mode & 0xf000) === FileType.DIRECTORY;
    };
    /**
     * @return [Boolean] True if this item is a symbolic link (only valid through lstat)
     */
    Stats.prototype.isSymbolicLink = function () {
        return (this.mode & 0xf000) === FileType.SYMLINK;
    };
    /**
     * Checks if a given user/group has access to this item
     * @param mode The request access as 4 bits (unused, read, write, execute)
     * @param uid The requesting UID
     * @param gid The requesting GID
     * @returns [Boolean] True if the request has access, false if the request does not
     */
    Stats.prototype.hasAccess = function (mode, cred) {
        if (cred.euid === 0 || cred.egid === 0) {
            //Running as root
            return true;
        }
        var perms = this.mode & 0xfff;
        var uMode = 0xf, gMode = 0xf, wMode = 0xf;
        if (cred.euid == this.uid) {
            var uPerms = (0xf00 & perms) >> 8;
            uMode = (mode ^ uPerms) & mode;
        }
        if (cred.egid == this.gid) {
            var gPerms = (0xf0 & perms) >> 4;
            gMode = (mode ^ gPerms) & mode;
        }
        var wPerms = 0xf & perms;
        wMode = (mode ^ wPerms) & mode;
        /*
        Result = 0b0xxx (read, write, execute)
        If any bits are set that means the request does not have that permission.
    */
        var result = uMode & gMode & wMode;
        return !result;
    };
    /**
     * Convert the current stats object into a cred object
     */
    Stats.prototype.getCred = function (uid, gid) {
        if (uid === void 0) { uid = this.uid; }
        if (gid === void 0) { gid = this.gid; }
        return new cred_1.default(uid, gid, this.uid, this.gid, uid, gid);
    };
    /**
     * Change the mode of the file. We use this helper function to prevent messing
     * up the type of the file, which is encoded in mode.
     */
    Stats.prototype.chmod = function (mode) {
        this.mode = (this.mode & 0xf000) | mode;
    };
    /**
     * Change the owner user/group of the file.
     * This function makes sure it is a valid UID/GID (that is, a 32 unsigned int)
     */
    Stats.prototype.chown = function (uid, gid) {
        if (!isNaN(+uid) && 0 <= +uid && +uid < Math.pow(2, 32)) {
            this.uid = uid;
        }
        if (!isNaN(+gid) && 0 <= +gid && +gid < Math.pow(2, 32)) {
            this.gid = gid;
        }
    };
    // We don't support the following types of files.
    Stats.prototype.isSocket = function () {
        return false;
    };
    Stats.prototype.isBlockDevice = function () {
        return false;
    };
    Stats.prototype.isCharacterDevice = function () {
        return false;
    };
    Stats.prototype.isFIFO = function () {
        return false;
    };
    return Stats;
}());
exports.default = Stats;
//# sourceMappingURL=stats.js.map