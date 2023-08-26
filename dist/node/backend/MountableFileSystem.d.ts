import { FileSystem, BaseFileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions } from '../core/file_system';
import { ApiError } from '../core/api_error';
import Cred from '../core/cred';
/**
 * Configuration options for the MountableFileSystem backend.
 */
export interface MountableFileSystemOptions {
    [mountPoint: string]: FileSystem;
}
/**
 * The MountableFileSystem allows you to mount multiple backend types or
 * multiple instantiations of the same backend into a single file system tree.
 * The file systems do not need to know about each other; all interactions are
 * automatically facilitated through this interface.
 *
 * For example, if a file system is mounted at /mnt/blah, and a request came in
 * for /mnt/blah/foo.txt, the file system would see a request for /foo.txt.
 *
 * You can mount file systems when you configure the file system:
 * ```javascript
 * BrowserFS.configure({
 *   fs: "MountableFileSystem",
 *   options: {
 *     '/data': { fs: 'HTTPRequest', options: { index: "http://mysite.com/files/index.json" } },
 *     '/home': { fs: 'LocalStorage' }
 *   }
 * }, function(e) {
 *
 * });
 * ```
 *
 * For advanced users, you can also mount file systems *after* MFS is constructed:
 * ```javascript
 * BrowserFS.FileSystem.HTTPRequest.Create({
 *   index: "http://mysite.com/files/index.json"
 * }, function(e, xhrfs) {
 *   BrowserFS.FileSystem.MountableFileSystem.Create({
 *     '/data': xhrfs
 *   }, function(e, mfs) {
 *     BrowserFS.initialize(mfs);
 *
 *     // Added after-the-fact...
 *     BrowserFS.FileSystem.LocalStorage.Create(function(e, lsfs) {
 *       mfs.mount('/home', lsfs);
 *     });
 *   });
 * });
 * ```
 *
 * Since MountableFileSystem simply proxies requests to mounted file systems, it supports all of the operations that the mounted file systems support.
 *
 * With no mounted file systems, `MountableFileSystem` acts as a simple `InMemory` filesystem.
 */
export default class MountableFileSystem extends BaseFileSystem implements FileSystem {
    static readonly Name = "MountableFileSystem";
    static readonly Options: FileSystemOptions;
    /**
     * Creates a MountableFileSystem instance with the given options.
     */
    static Create(opts: MountableFileSystemOptions, cb: BFSCallback<MountableFileSystem>): void;
    static CreateAsync(opts: MountableFileSystemOptions): Promise<MountableFileSystem>;
    static isAvailable(): boolean;
    private mntMap;
    private mountList;
    private rootFs;
    /**
     * Creates a new, empty MountableFileSystem.
     */
    private constructor();
    /**
     * Mounts the file system at the given mount point.
     */
    mount(mountPoint: string, fs: FileSystem, cred: Cred): void;
    umount(mountPoint: string, cred: Cred): void;
    /**
     * Returns the file system that the path points to.
     */
    _getFs(path: string): {
        fs: FileSystem;
        path: string;
        mountPoint: string;
    };
    getName(): string;
    diskSpace(path: string, cb: (total: number, free: number) => void): void;
    isReadOnly(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    /**
     * Fixes up error messages so they mention the mounted file location relative
     * to the MFS root, not to the particular FS's root.
     * Mutates the input error, and returns it.
     */
    standardizeError(err: ApiError, path: string, realPath: string): ApiError;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    readdirSync(p: string, cred: Cred): string[];
    readdir(p: string, cred: Cred, cb: BFSCallback<string[]>): void;
    realpathSync(p: string, cache: {
        [path: string]: string;
    }, cred: Cred): string;
    realpath(p: string, cache: {
        [path: string]: string;
    }, cred: Cred, cb: BFSCallback<string>): void;
    rmdirSync(p: string, cred: Cred): void;
    rmdir(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    /**
     * Returns true if the given path contains a mount point.
     */
    private _containsMountPt;
}
