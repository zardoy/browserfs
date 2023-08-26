import { BaseFileSystem, FileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions } from '../core/file_system';
import { FileFlag } from '../core/file_flag';
import { File } from '../core/file';
import { default as Stats } from '../core/stats';
import Cred from '../core/cred';
export interface WorkerFSOptions {
    worker: Worker;
}
/**
 * WorkerFS lets you access a BrowserFS instance that is running in a different
 * JavaScript context (e.g. access BrowserFS in one of your WebWorkers, or
 * access BrowserFS running on the main page from a WebWorker).
 *
 * For example, to have a WebWorker access files in the main browser thread,
 * do the following:
 *
 * MAIN BROWSER THREAD:
 *
 * ```javascript
 *   // Listen for remote file system requests.
 *   BrowserFS.FileSystem.WorkerFS.attachRemoteListener(webWorkerObject);
 * ```
 *
 * WEBWORKER THREAD:
 *
 * ```javascript
 *   // Set the remote file system as the root file system.
 *   BrowserFS.configure({ fs: "WorkerFS", options: { worker: self }}, function(e) {
 *     // Ready!
 *   });
 * ```
 *
 * Note that synchronous operations are not permitted on the WorkerFS, regardless
 * of the configuration option of the remote FS.
 */
export default class WorkerFS extends BaseFileSystem implements FileSystem {
    static readonly Name = "WorkerFS";
    static readonly Options: FileSystemOptions;
    static Create(opts: WorkerFSOptions, cb: BFSCallback<WorkerFS>): void;
    static CreateAsync(opts: WorkerFSOptions): Promise<WorkerFS>;
    static isAvailable(): boolean;
    /**
     * Attaches a listener to the remote worker for file system requests.
     */
    static attachRemoteListener(worker: Worker): void;
    private _worker;
    private _callbackConverter;
    private _isInitialized;
    private _isReadOnly;
    private _supportLinks;
    private _supportProps;
    /**
     * Constructs a new WorkerFS instance that connects with BrowserFS running on
     * the specified worker.
     */
    private constructor();
    getName(): string;
    isReadOnly(): boolean;
    supportsSynch(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    stat(p: string, isLstat: boolean, cred: Cred, cb: BFSCallback<Stats>): void;
    open(p: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File>): void;
    unlink(p: string, cred: Cred, cb: Function): void;
    rmdir(p: string, cred: Cred, cb: Function): void;
    mkdir(p: string, mode: number, cred: Cred, cb: Function): void;
    readdir(p: string, cred: Cred, cb: BFSCallback<string[]>): void;
    exists(p: string, cred: Cred, cb: (exists: boolean) => void): void;
    realpath(p: string, cache: {
        [path: string]: string;
    }, cred: Cred, cb: BFSCallback<string>): void;
    truncate(p: string, len: number, cred: Cred, cb: Function): void;
    readFile(fname: string, encoding: string, flag: FileFlag, cred: Cred, cb: BFSCallback<any>): void;
    writeFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    appendFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    chmod(p: string, isLchmod: boolean, mode: number, cred: Cred, cb: Function): void;
    chown(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred, cb: Function): void;
    utimes(p: string, atime: Date, mtime: Date, cred: Cred, cb: Function): void;
    link(srcpath: string, dstpath: string, cred: Cred, cb: Function): void;
    symlink(srcpath: string, dstpath: string, type: string, cred: Cred, cb: Function): void;
    readlink(p: string, cred: Cred, cb: Function): void;
    syncClose(method: string, fd: File, cb: BFSOneArgCallback): void;
    /**
     * Called once both local and remote sides are set up.
     */
    private _initialize;
    private _argRemote2Local;
    private _rpc;
    /**
     * Converts a local argument into a remote argument. Public so WorkerFile objects can call it.
     */
    private _argLocal2Remote;
}
