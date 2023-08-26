/// <reference types="node" />
import { BaseFileSystem, SynchronousFileSystem, BFSOneArgCallback, BFSCallback } from '../core/file_system';
import { default as Stats } from '../core/stats';
import { File } from '../core/file';
import { FileFlag } from '../core/file_flag';
import PreloadFile from '../generic/preload_file';
import Cred from '../core/cred';
import { Buffer } from 'buffer';
/**
 * Represents a *synchronous* key-value store.
 */
export interface SyncKeyValueStore {
    /**
     * The name of the key-value store.
     */
    name(): string;
    /**
     * Empties the key-value store completely.
     */
    clear(): void;
    /**
     * Begins a new read-only transaction.
     */
    beginTransaction(type: 'readonly'): SyncKeyValueROTransaction;
    /**
     * Begins a new read-write transaction.
     */
    beginTransaction(type: 'readwrite'): SyncKeyValueRWTransaction;
    beginTransaction(type: string): SyncKeyValueROTransaction;
}
/**
 * A read-only transaction for a synchronous key value store.
 */
export interface SyncKeyValueROTransaction {
    /**
     * Retrieves the data at the given key. Throws an ApiError if an error occurs
     * or if the key does not exist.
     * @param key The key to look under for data.
     * @return The data stored under the key, or undefined if not present.
     */
    get(key: string): Buffer | undefined;
}
/**
 * A read-write transaction for a synchronous key value store.
 */
export interface SyncKeyValueRWTransaction extends SyncKeyValueROTransaction {
    /**
     * Adds the data to the store under the given key.
     * @param key The key to add the data under.
     * @param data The data to add to the store.
     * @param overwrite If 'true', overwrite any existing data. If 'false',
     *   avoids storing the data if the key exists.
     * @return True if storage succeeded, false otherwise.
     */
    put(key: string, data: Buffer, overwrite: boolean): boolean;
    /**
     * Deletes the data at the given key.
     * @param key The key to delete from the store.
     */
    del(key: string): void;
    /**
     * Commits the transaction.
     */
    commit(): void;
    /**
     * Aborts and rolls back the transaction.
     */
    abort(): void;
}
/**
 * An interface for simple synchronous key-value stores that don't have special
 * support for transactions and such.
 */
export interface SimpleSyncStore {
    get(key: string): Buffer | undefined;
    put(key: string, data: Buffer, overwrite: boolean): boolean;
    del(key: string): void;
}
/**
 * A simple RW transaction for simple synchronous key-value stores.
 */
export declare class SimpleSyncRWTransaction implements SyncKeyValueRWTransaction {
    private store;
    /**
     * Stores data in the keys we modify prior to modifying them.
     * Allows us to roll back commits.
     */
    private originalData;
    /**
     * List of keys modified in this transaction, if any.
     */
    private modifiedKeys;
    constructor(store: SimpleSyncStore);
    get(key: string): Buffer | undefined;
    put(key: string, data: Buffer, overwrite: boolean): boolean;
    del(key: string): void;
    commit(): void;
    abort(): void;
    private _has;
    /**
     * Stashes given key value pair into `originalData` if it doesn't already
     * exist. Allows us to stash values the program is requesting anyway to
     * prevent needless `get` requests if the program modifies the data later
     * on during the transaction.
     */
    private stashOldValue;
    /**
     * Marks the given key as modified, and stashes its value if it has not been
     * stashed already.
     */
    private markModified;
}
export interface SyncKeyValueFileSystemOptions {
    /**
     * The actual key-value store to read from/write to.
     */
    store: SyncKeyValueStore;
    /**
     * Should the file system support properties (mtime/atime/ctime/chmod/etc)?
     * Enabling this slightly increases the storage space per file, and adds
     * atime updates every time a file is accessed, mtime updates every time
     * a file is modified, and permission checks on every operation.
     *
     * Defaults to *false*.
     */
    supportProps?: boolean;
    /**
     * Should the file system support links?
     */
    supportLinks?: boolean;
}
export declare class SyncKeyValueFile extends PreloadFile<SyncKeyValueFileSystem> implements File {
    constructor(_fs: SyncKeyValueFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer);
    syncSync(): void;
    closeSync(): void;
}
/**
 * A "Synchronous key-value file system". Stores data to/retrieves data from an
 * underlying key-value store.
 *
 * We use a unique ID for each node in the file system. The root node has a
 * fixed ID.
 * @todo Introduce Node ID caching.
 * @todo Check modes.
 */
export declare class SyncKeyValueFileSystem extends SynchronousFileSystem {
    static isAvailable(): boolean;
    private store;
    constructor(options: SyncKeyValueFileSystemOptions);
    getName(): string;
    isReadOnly(): boolean;
    supportsSymlinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    /**
     * Delete all contents stored in the file system.
     */
    empty(): void;
    accessSync(p: string, mode: number, cred: Cred): void;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    statSync(p: string, isLstat: boolean, cred: Cred): Stats;
    createFileSync(p: string, flag: FileFlag, mode: number, cred: Cred): File;
    openFileSync(p: string, flag: FileFlag, cred: Cred): File;
    unlinkSync(p: string, cred: Cred): void;
    rmdirSync(p: string, cred: Cred): void;
    mkdirSync(p: string, mode: number, cred: Cred): void;
    readdirSync(p: string, cred: Cred): string[];
    chmodSync(p: string, isLchmod: boolean, mode: number, cred: Cred): void;
    chownSync(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred): void;
    _syncSync(p: string, data: Buffer, stats: Stats): void;
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    private makeRootDirectory;
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @return string The ID of the file's inode in the file system.
     */
    private _findINode;
    /**
     * Finds the Inode of the given path.
     * @param p The path to look up.
     * @return The Inode of the path p.
     * @todo memoize/cache
     */
    private findINode;
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param p The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    private getINode;
    /**
     * Given the Inode of a directory, retrieves the corresponding directory
     * listing.
     */
    private getDirListing;
    /**
     * Creates a new node under a random ID. Retries 5 times before giving up in
     * the exceedingly unlikely chance that we try to reuse a random GUID.
     * @return The GUID that the data was stored under.
     */
    private addNewNode;
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
     * the given mode.
     * Note: This will commit the transaction.
     * @param p The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     * @return The Inode for the new file.
     */
    private commitNewFile;
    /**
     * Remove all traces of the given path from the file system.
     * @param p The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    private removeEntry;
}
/**
 * Represents an *asynchronous* key-value store.
 */
export interface AsyncKeyValueStore {
    /**
     * The name of the key-value store.
     */
    name(): string;
    /**
     * Empties the key-value store completely.
     */
    clear(cb: BFSOneArgCallback): void;
    /**
     * Begins a read-write transaction.
     */
    beginTransaction(type: 'readwrite'): AsyncKeyValueRWTransaction;
    /**
     * Begins a read-only transaction.
     */
    beginTransaction(type: 'readonly'): AsyncKeyValueROTransaction;
    beginTransaction(type: string): AsyncKeyValueROTransaction;
}
/**
 * Represents an asynchronous read-only transaction.
 */
export interface AsyncKeyValueROTransaction {
    /**
     * Retrieves the data at the given key.
     * @param key The key to look under for data.
     */
    get(key: string, cb: BFSCallback<Buffer>): void;
}
/**
 * Represents an asynchronous read-write transaction.
 */
export interface AsyncKeyValueRWTransaction extends AsyncKeyValueROTransaction {
    /**
     * Adds the data to the store under the given key. Overwrites any existing
     * data.
     * @param key The key to add the data under.
     * @param data The data to add to the store.
     * @param overwrite If 'true', overwrite any existing data. If 'false',
     *   avoids writing the data if the key exists.
     * @param cb Triggered with an error and whether or not the value was
     *   committed.
     */
    put(key: string, data: Buffer, overwrite: boolean, cb: BFSCallback<boolean>): void;
    /**
     * Deletes the data at the given key.
     * @param key The key to delete from the store.
     */
    del(key: string, cb: BFSOneArgCallback): void;
    /**
     * Commits the transaction.
     */
    commit(cb: BFSOneArgCallback): void;
    /**
     * Aborts and rolls back the transaction.
     */
    abort(cb: BFSOneArgCallback): void;
}
export declare class AsyncKeyValueFile extends PreloadFile<AsyncKeyValueFileSystem> implements File {
    constructor(_fs: AsyncKeyValueFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer);
    sync(cb: BFSOneArgCallback): void;
    close(cb: BFSOneArgCallback): void;
}
/**
 * An "Asynchronous key-value file system". Stores data to/retrieves data from
 * an underlying asynchronous key-value store.
 */
export declare class AsyncKeyValueFileSystem extends BaseFileSystem {
    static isAvailable(): boolean;
    protected store: AsyncKeyValueStore;
    private _cache;
    constructor(cacheSize: number);
    /**
     * Initializes the file system. Typically called by subclasses' async
     * constructors.
     */
    init(store: AsyncKeyValueStore, cb: BFSOneArgCallback): void;
    getName(): string;
    isReadOnly(): boolean;
    supportsSymlinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    /**
     * Delete all contents stored in the file system.
     */
    empty(cb: BFSOneArgCallback): void;
    access(p: string, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    stat(p: string, isLstat: boolean, cred: Cred, cb: BFSCallback<Stats>): void;
    createFile(p: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File>): void;
    openFile(p: string, flag: FileFlag, cred: Cred, cb: BFSCallback<File>): void;
    unlink(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    rmdir(p: string, cred: Cred, cb: BFSOneArgCallback): void;
    mkdir(p: string, mode: number, cred: Cred, cb: BFSOneArgCallback): void;
    readdir(p: string, cred: Cred, cb: BFSCallback<string[]>): void;
    _sync(p: string, data: Buffer, stats: Stats, cb: BFSOneArgCallback): void;
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    private makeRootDirectory;
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @param cb Passed an error or the ID of the file's inode in the file system.
     */
    private _findINode;
    /**
     * Finds the Inode of the given path.
     * @param p The path to look up.
     * @param cb Passed an error or the Inode of the path p.
     * @todo memoize/cache
     */
    private findINode;
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param p The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     * @param cb Passed an error or the inode under the given id.
     */
    private getINode;
    /**
     * Given the Inode of a directory, retrieves the corresponding directory
     * listing.
     */
    private getDirListing;
    /**
     * Given a path to a directory, retrieves the corresponding INode and
     * directory listing.
     */
    private findINodeAndDirListing;
    /**
     * Adds a new node under a random ID. Retries 5 times before giving up in
     * the exceedingly unlikely chance that we try to reuse a random GUID.
     * @param cb Passed an error or the GUID that the data was stored under.
     */
    private addNewNode;
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
     * the given mode.
     * Note: This will commit the transaction.
     * @param p The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param uid The UID to create the file with
     * @param gid The GID to create the file with
     * @param data The data to store at the file's data node.
     * @param cb Passed an error or the Inode for the new file.
     */
    private commitNewFile;
    /**
     * Remove all traces of the given path from the file system.
     * @param p The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    private removeEntry;
}
