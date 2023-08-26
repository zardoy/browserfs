"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Credentials used for FS ops.
 * Similar to Linux's cred struct. See https://github.com/torvalds/linux/blob/master/include/linux/cred.h
 */
var Cred = /** @class */ (function () {
    function Cred(uid, gid, suid, sgid, euid, egid) {
        this.uid = uid;
        this.gid = gid;
        this.suid = suid;
        this.sgid = sgid;
        this.euid = euid;
        this.egid = egid;
    }
    Cred.Root = new Cred(0, 0, 0, 0, 0, 0);
    return Cred;
}());
exports.default = Cred;
//# sourceMappingURL=cred.js.map