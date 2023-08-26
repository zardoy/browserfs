import { FileSystem, BaseFileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions } from '../core/file_system';
import { FileFlag } from '../core/file_flag';
import { File } from '../core/file';
import { default as Stats } from '../core/stats';
import PreloadFile from '../generic/preload_file';
import LockedFS from '../generic/locked_fs';
import Cred from '../core/cred';
/**
 * *INTERNAL, DO NOT USE DIRECTLY!*
 *
 * Core OverlayFS class that contains no locking whatsoever. We wrap these objects
 * in a LockedFS to prevent races.
 */
export declare class UnlockedOverlayFS extends BaseFileSystem implements FileSystem {
    static isAvailable(): boolean;
    private _writable;
    private _readable;
    private _isInitialized;
    private _initializeCallbacks;
    private _deletedFiles;
    private _deleteLog;
    private _deleteLogUpdatePending;
    private _deleteLogUpdateNeeded;
    private _deleteLogError;
    constructor(writable: FileSystem, readable: FileSystem);
    getOverlayedFileSystems(): {
        readable: FileSystem;
        writable: FileSystem;
    };
    _syncAsync(file: PreloadFile<UnlockedOverlayFS>, cb: BFSOneArgCallback): void;
    _syncSync(file: PreloadFile<UnlockedOverlayFS>): void;
    getName(): string;
    /**
     * **INTERNAL METHOD**
     *
     * Called once to load up metadata stored on the writable file system.
     */
    _initialize(cb: BFSOneArgCallback): void;
    isReadOnly(): boolean;
    supportsSynch(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    getDeletionLog(): string;
    restoreDeletionLog(log: string, cred: Cred): void;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    stat(p: string, isLstat: boolean, cred: Cred, cb: BFSCallback<Stats>): void;
    statSync(p: string, isLstat: boolean, cred: Cred): Stats;
    open(p: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File>): void;
    openSync(p: string, flag: FileFlag, mode: number, cred: Cred): File;
    unlink(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    unlinkSync(p: string, cred: Cred): void;
    rmdir(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    rmdirSync(p: string, cred: Cred): void;
    mkdir(p: string, mode: number, cred: Cred, cb: BFSCallback<Stats>): void;
    mkdirSync(p: string, mode: number, cred: Cred): void;
    readdir(p: string, cred: Cred, cb: BFSCallback<string[]>): void;
    readdirSync(p: string, cred: Cred): string[];
    exists(p: string, cred: Cred, cb: (exists: boolean) => void): void;
    existsSync(p: string, cred: Cred): boolean;
    chmod(p: string, isLchmod: boolean, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    chmodSync(p: string, isLchmod: boolean, mode: number, cred: Cred): void;
    chown(p: string, isLchmod: boolean, new_uid: number, new_gid: number, cred: Cred, cb: BFSOneArgCallback): void;
    chownSync(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred): void;
    utimes(p: string, atime: Date, mtime: Date, cred: Cred, cb: BFSOneArgCallback): void;
    utimesSync(p: string, atime: Date, mtime: Date, cred: Cred): void;
    private deletePath;
    private updateLog;
    private _reparseDeletionLog;
    private checkInitialized;
    private checkInitAsync;
    private checkPath;
    private checkPathAsync;
    private createParentDirectoriesAsync;
    /**
     * With the given path, create the needed parent directories on the writable storage
     * should they not exist. Use modes from the read-only storage.
     */
    private createParentDirectories;
    /**
     * Helper function:
     * - Ensures p is on writable before proceeding. Throws an error if it doesn't exist.
     * - Calls f to perform operation on writable.
     */
    private operateOnWritable;
    private operateOnWritableAsync;
    /**
     * Copy from readable to writable storage.
     * PRECONDITION: File does not exist on writable storage.
     */
    private copyToWritable;
    private copyToWritableAsync;
}
/**
 * Configuration options for OverlayFS instances.
 */
export interface OverlayFSOptions {
    writable: FileSystem;
    readable: FileSystem;
}
/**
 * OverlayFS makes a read-only filesystem writable by storing writes on a second,
 * writable file system. Deletes are persisted via metadata stored on the writable
 * file system.
 */
export default class OverlayFS extends LockedFS<UnlockedOverlayFS> {
    static readonly Name = "OverlayFS";
    static readonly Options: FileSystemOptions;
    /**
     * Constructs and initializes an OverlayFS instance with the given options.
     */
    static Create(opts: OverlayFSOptions, cb: BFSCallback<OverlayFS>): void;
    static CreateAsync(opts: OverlayFSOptions): Promise<OverlayFS>;
    static isAvailable(): boolean;
    /**
     * @param writable The file system to write modified files to.
     * @param readable The file system that initially populates this file system.
     */
    constructor(writable: FileSystem, readable: FileSystem);
    getOverlayedFileSystems(): {
        readable: FileSystem;
        writable: FileSystem;
    };
    unwrap(): UnlockedOverlayFS;
    private _initialize;
}
