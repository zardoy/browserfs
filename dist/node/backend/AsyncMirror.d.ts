import { FileSystem, SynchronousFileSystem, BFSCallback, FileSystemOptions } from '../core/file_system';
import { FileFlag } from '../core/file_flag';
import { File } from '../core/file';
import Stats from '../core/stats';
import PreloadFile from '../generic/preload_file';
import Cred from '../core/cred';
/**
 * Configuration options for the AsyncMirror file system.
 */
export interface AsyncMirrorOptions {
    sync: FileSystem;
    async: FileSystem;
}
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
export default class AsyncMirror extends SynchronousFileSystem implements FileSystem {
    static readonly Name = "AsyncMirror";
    static readonly Options: FileSystemOptions;
    /**
     * Constructs and initializes an AsyncMirror file system with the given options.
     */
    static Create(opts: AsyncMirrorOptions, cb: BFSCallback<AsyncMirror>): void;
    /**
     * Asynchronously constructs and initializes an AsyncMirror file system with the given options.
     */
    static CreateAsync(opts: AsyncMirrorOptions): Promise<AsyncMirror>;
    static isAvailable(): boolean;
    /**
     * Queue of pending asynchronous operations.
     */
    private _queue;
    private _queueRunning;
    private _sync;
    private _async;
    private _isInitialized;
    private _initializeCallbacks;
    /**
     * **Deprecated; use AsyncMirror.Create() method instead.**
     *
     * Mirrors the synchronous file system into the asynchronous file system.
     *
     * **IMPORTANT**: You must call `initialize` on the file system before it can be used.
     * @param sync The synchronous file system to mirror the asynchronous file system to.
     * @param async The asynchronous file system to mirror.
     */
    constructor(sync: FileSystem, async: FileSystem);
    getName(): string;
    _syncSync(fd: PreloadFile<any>): void;
    isReadOnly(): boolean;
    supportsSynch(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    statSync(p: string, isLstat: boolean, cred: Cred): Stats;
    openSync(p: string, flag: FileFlag, mode: number, cred: Cred): File;
    unlinkSync(p: string, cred: Cred): void;
    rmdirSync(p: string, cred: Cred): void;
    mkdirSync(p: string, mode: number, cred: Cred): void;
    readdirSync(p: string, cred: Cred): string[];
    existsSync(p: string, cred: Cred): boolean;
    chmodSync(p: string, isLchmod: boolean, mode: number, cred: Cred): void;
    chownSync(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred): void;
    utimesSync(p: string, atime: Date, mtime: Date, cred: Cred): void;
    /**
     * Called once to load up files from async storage into sync storage.
     */
    private _initialize;
    private enqueueOp;
}
