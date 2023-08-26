/// <reference types="node" />
import { SynchronousFileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback, FileSystemOptions } from '../core/file_system';
import { default as Stats } from '../core/stats';
import { FileFlag } from '../core/file_flag';
import { BaseFile, File } from '../core/file';
import Cred from '../core/cred';
import { Buffer } from 'buffer';
export declare class EmscriptenFile extends BaseFile implements File {
    private _fs;
    private _FS;
    private _path;
    private _stream;
    constructor(_fs: EmscriptenFileSystem, _FS: any, _path: string, _stream: any);
    getPos(): number | undefined;
    close(cb: BFSOneArgCallback): void;
    closeSync(): void;
    stat(cb: BFSCallback<Stats>): void;
    statSync(): Stats;
    truncate(len: number, cb: BFSOneArgCallback): void;
    truncateSync(len: number): void;
    write(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void;
    writeSync(buffer: Buffer, offset: number, length: number, position: number | null): number;
    read(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void;
    readSync(buffer: Buffer, offset: number, length: number, position: number | null): number;
    sync(cb: BFSOneArgCallback): void;
    syncSync(): void;
    chown(uid: number, gid: number, cb: BFSOneArgCallback): void;
    chownSync(uid: number, gid: number): void;
    chmod(mode: number, cb: BFSOneArgCallback): void;
    chmodSync(mode: number): void;
    utimes(atime: Date, mtime: Date, cb: BFSOneArgCallback): void;
    utimesSync(atime: Date, mtime: Date): void;
}
/**
 * Configuration options for Emscripten file systems.
 */
export interface EmscriptenFileSystemOptions {
    FS: any;
}
/**
 * Mounts an Emscripten file system into the BrowserFS file system.
 */
export default class EmscriptenFileSystem extends SynchronousFileSystem {
    static readonly Name = "EmscriptenFileSystem";
    static readonly Options: FileSystemOptions;
    /**
     * Create an EmscriptenFileSystem instance with the given options.
     */
    static Create(opts: EmscriptenFileSystemOptions, cb: BFSCallback<EmscriptenFileSystem>): void;
    static CreateAsync(opts: EmscriptenFileSystemOptions): Promise<EmscriptenFileSystem>;
    static isAvailable(): boolean;
    private _FS;
    private constructor();
    getName(): string;
    isReadOnly(): boolean;
    supportsLinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    renameSync(oldPath: string, newPath: string, cred: Cred): void;
    statSync(p: string, isLstat: boolean, cred: Cred): Stats;
    openSync(p: string, flag: FileFlag, mode: number, cred: Cred): EmscriptenFile;
    unlinkSync(p: string, cred: Cred): void;
    rmdirSync(p: string, cred: Cred): void;
    mkdirSync(p: string, mode: number, cred: Cred): void;
    readdirSync(p: string, cred: Cred): string[];
    truncateSync(p: string, len: number, cred: Cred): void;
    readFileSync(p: string, encoding: BufferEncoding, flag: FileFlag, cred: Cred): any;
    writeFileSync(p: string, data: any, encoding: BufferEncoding, flag: FileFlag, mode: number, cred: Cred): void;
    chmodSync(p: string, isLchmod: boolean, mode: number, cred: Cred): void;
    chownSync(p: string, isLchown: boolean, new_uid: number, new_gid: number, cred: Cred): void;
    symlinkSync(srcpath: string, dstpath: string, type: string, cred: Cred): void;
    readlinkSync(p: string, cred: Cred): string;
    utimesSync(p: string, atime: Date, mtime: Date, cred: Cred): void;
    private modeToFileType;
}
