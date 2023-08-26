/// <reference types="node" />
import { FileSystem, BFSOneArgCallback, BFSCallback } from '../core/file_system';
import { FileFlag } from '../core/file_flag';
import { default as Stats } from '../core/stats';
import { File } from '../core/file';
import Cred from '../core/cred';
import type { Buffer } from 'buffer';
/**
 * This class serializes access to an underlying async filesystem.
 * For example, on an OverlayFS instance with an async lower
 * directory operations like rename and rmdir may involve multiple
 * requests involving both the upper and lower filesystems -- they
 * are not executed in a single atomic step.  OverlayFS uses this
 * LockedFS to avoid having to reason about the correctness of
 * multiple requests interleaving.
 */
export default class LockedFS<T extends FileSystem> implements FileSystem {
    private _fs;
    private _mu;
    constructor(fs: T);
    getName(): string;
    getFSUnlocked(): T;
    diskSpace(p: string, cb: (total: number, free: number) => any): void;
    isReadOnly(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    stat(p: string, isLstat: boolean, cred: Cred, cb: BFSCallback<Stats>): void;
    statSync(p: string, isLstat: boolean, cred: Cred): Stats;
    access(p: string, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    accessSync(p: string, mode: number, cred: Cred): void;
    open(p: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File>): void;
    openSync(p: string, flag: FileFlag, mode: number, cred: Cred): File;
    unlink(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    unlinkSync(p: string, cred: Cred): void;
    rmdir(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    rmdirSync(p: string, cred: Cred): void;
    mkdir(p: string, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    mkdirSync(p: string, mode: number, cred: Cred): void;
    readdir(p: string, cred: Cred, cb: BFSCallback<string[]>): void;
    readdirSync(p: string, cred: Cred): string[];
    exists(p: string, cred: Cred, cb: (exists: boolean) => void): void;
    existsSync(p: string, cred: Cred): boolean;
    realpath(p: string, cache: {
        [path: string]: string;
    }, cred: Cred, cb: BFSCallback<string>): void;
    realpathSync(p: string, cache: {
        [path: string]: string;
    }, cred: Cred): string;
    truncate(p: string, len: number, cred: Cred, cb: BFSOneArgCallback): void;
    truncateSync(p: string, len: number, cred: Cred): void;
    readFile(fname: string, encoding: string, flag: FileFlag, cred: Cred, cb: BFSCallback<string | Buffer>): void;
    readFileSync(fname: string, encoding: string, flag: FileFlag, cred: Cred): any;
    writeFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    writeFileSync(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred): void;
    appendFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    appendFileSync(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred): void;
    chmod(p: string, isLchmod: boolean, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    chmodSync(p: string, isLchmod: boolean, mode: number, cred: Cred): void;
    chown(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred, cb: BFSOneArgCallback): void;
    chownSync(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred): void;
    utimes(p: string, atime: Date, mtime: Date, cred: Cred, cb: BFSOneArgCallback): void;
    utimesSync(p: string, atime: Date, mtime: Date, cred: Cred): void;
    link(srcpath: string, dstpath: string, cred: Cred, cb: BFSOneArgCallback): void;
    linkSync(srcpath: string, dstpath: string, cred: Cred): void;
    symlink(srcpath: string, dstpath: string, type: string, cred: Cred, cb: BFSOneArgCallback): void;
    symlinkSync(srcpath: string, dstpath: string, type: string, cred: Cred): void;
    readlink(p: string, cred: Cred, cb: BFSCallback<string>): void;
    readlinkSync(p: string, cred: Cred): string;
}
