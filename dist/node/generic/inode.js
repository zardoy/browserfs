"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stats_1 = require("../core/stats");
var buffer_1 = require("buffer");
/**
 * Generic inode definition that can easily be serialized.
 */
var Inode = /** @class */ (function () {
    function Inode(id, size, mode, atime, mtime, ctime, uid, gid) {
        this.id = id;
        this.size = size;
        this.mode = mode;
        this.atime = atime;
        this.mtime = mtime;
        this.ctime = ctime;
        this.uid = uid;
        this.gid = gid;
    }
    /**
     * Converts the buffer into an Inode.
     */
    Inode.fromBuffer = function (buffer) {
        if (buffer === undefined) {
            throw new Error('NO');
        }
        return new Inode(buffer.toString('ascii', 38), buffer.readUInt32LE(0), buffer.readUInt16LE(4), buffer.readDoubleLE(6), buffer.readDoubleLE(14), buffer.readDoubleLE(22), buffer.readUInt32LE(30), buffer.readUInt32LE(34));
    };
    /**
     * Handy function that converts the Inode to a Node Stats object.
     */
    Inode.prototype.toStats = function () {
        return new stats_1.default((this.mode & 0xf000) === stats_1.FileType.DIRECTORY ? stats_1.FileType.DIRECTORY : stats_1.FileType.FILE, this.size, this.mode, this.atime, this.mtime, this.ctime, this.uid, this.gid);
    };
    /**
     * Get the size of this Inode, in bytes.
     */
    Inode.prototype.getSize = function () {
        // ASSUMPTION: ID is ASCII (1 byte per char).
        return 38 + this.id.length;
    };
    /**
     * Writes the inode into the start of the buffer.
     */
    Inode.prototype.toBuffer = function (buff) {
        if (buff === void 0) { buff = buffer_1.Buffer.alloc(this.getSize()); }
        buff.writeUInt32LE(this.size, 0);
        buff.writeUInt16LE(this.mode, 4);
        buff.writeDoubleLE(this.atime, 6);
        buff.writeDoubleLE(this.mtime, 14);
        buff.writeDoubleLE(this.ctime, 22);
        buff.writeUInt32LE(this.uid, 30);
        buff.writeUInt32LE(this.gid, 34);
        buff.write(this.id, 38, this.id.length, 'ascii');
        return buff;
    };
    /**
     * Updates the Inode using information from the stats object. Used by file
     * systems at sync time, e.g.:
     * - Program opens file and gets a File object.
     * - Program mutates file. File object is responsible for maintaining
     *   metadata changes locally -- typically in a Stats object.
     * - Program closes file. File object's metadata changes are synced with the
     *   file system.
     * @return True if any changes have occurred.
     */
    Inode.prototype.update = function (stats) {
        var hasChanged = false;
        if (this.size !== stats.size) {
            this.size = stats.size;
            hasChanged = true;
        }
        if (this.mode !== stats.mode) {
            this.mode = stats.mode;
            hasChanged = true;
        }
        var atimeMs = stats.atime.getTime();
        if (this.atime !== atimeMs) {
            this.atime = atimeMs;
            hasChanged = true;
        }
        var mtimeMs = stats.mtime.getTime();
        if (this.mtime !== mtimeMs) {
            this.mtime = mtimeMs;
            hasChanged = true;
        }
        var ctimeMs = stats.ctime.getTime();
        if (this.ctime !== ctimeMs) {
            this.ctime = ctimeMs;
            hasChanged = true;
        }
        if (this.uid !== stats.uid) {
            this.uid = stats.uid;
            hasChanged = true;
        }
        if (this.uid !== stats.uid) {
            this.uid = stats.uid;
            hasChanged = true;
        }
        return hasChanged;
    };
    // XXX: Copied from Stats. Should reconcile these two into something more
    //      compact.
    /**
     * @return [Boolean] True if this item is a file.
     */
    Inode.prototype.isFile = function () {
        return (this.mode & 0xf000) === stats_1.FileType.FILE;
    };
    /**
     * @return [Boolean] True if this item is a directory.
     */
    Inode.prototype.isDirectory = function () {
        return (this.mode & 0xf000) === stats_1.FileType.DIRECTORY;
    };
    return Inode;
}());
exports.default = Inode;
//# sourceMappingURL=inode.js.map