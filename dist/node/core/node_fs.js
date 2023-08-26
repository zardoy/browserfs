"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FS_1 = require("./FS");
// Manually export the individual public functions of fs.
// Required because some code will invoke functions off of the module.
// e.g.:
// let writeFile = fs.writeFile;
// writeFile(...)
/**
 * @hidden
 */
var fs = new FS_1.default();
/**
 * @hidden
 */
var _fsMock = {};
var _loop_1 = function (key) {
    if (typeof fs[key] === 'function') {
        _fsMock[key] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fs[key].apply(fs, args);
        };
    }
    else {
        _fsMock[key] = fs[key];
    }
};
/**
 * @hidden
 */
for (var _i = 0, _a = Object.getOwnPropertyNames(FS_1.default.prototype); _i < _a.length; _i++) {
    var key = _a[_i];
    _loop_1(key);
}
_fsMock.changeFSModule = function (newFs) {
    fs = newFs;
};
_fsMock.getFSModule = function () {
    return fs;
};
_fsMock.FS = FS_1.default;
_fsMock.Stats = FS_1.default.Stats;
exports.default = _fsMock;
//# sourceMappingURL=node_fs.js.map