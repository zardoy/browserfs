/// <reference types="node" />
import Cred from '../core/cred';
import { File } from '../core/file';
import { FileFlag } from '../core/file_flag';
import { BaseFileSystem, BFSCallback, BFSOneArgCallback, FileSystem, FileSystemOptions } from '../core/file_system';
import { default as Stats } from '../core/stats';
import PreloadFile from '../generic/preload_file';
import { Buffer } from 'buffer';
interface FileSystemAccessFileSystemOptions {
    handle: FileSystemDirectoryHandle;
}
export declare class FileSystemAccessFile extends PreloadFile<FileSystemAccessFileSystem> implements File {
    constructor(_fs: FileSystemAccessFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer);
    sync(cb: BFSOneArgCallback): void;
    close(cb: BFSOneArgCallback): void;
}
export default class FileSystemAccessFileSystem extends BaseFileSystem implements FileSystem {
    static readonly Name = "FileSystemAccess";
    static readonly Options: FileSystemOptions;
    static Create({ handle }: FileSystemAccessFileSystemOptions, cb: BFSCallback<FileSystemAccessFileSystem>): void;
    static CreateAsync(opts: FileSystemAccessFileSystemOptions): Promise<FileSystemAccessFileSystem>;
    static isAvailable(): boolean;
    private _handles;
    private constructor();
    getName(): string;
    isReadOnly(): boolean;
    supportsSymlinks(): boolean;
    supportsProps(): boolean;
    supportsSynch(): boolean;
    _sync(p: string, data: Buffer, stats: Stats, cred: Cred, cb: BFSOneArgCallback): void;
    rename(oldPath: string, newPath: string, cred: Cred, cb: BFSOneArgCallback): void;
    writeFile(fname: string, data: any, encoding: string | null, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File | undefined>, createFile?: boolean): void;
    createFile(p: string, flag: FileFlag, mode: number, cred: Cred, cb: BFSCallback<File>): void;
    stat(path: string, isLstat: boolean, cred: Cred, cb: BFSCallback<Stats>): void;
    exists(p: string, cred: Cred, cb: (exists: boolean) => void): void;
    openFile(path: string, flags: FileFlag, cred: Cred, cb: BFSCallback<File>): void;
    unlink(path: string, cred: Cred, cb: BFSOneArgCallback): void;
    rmdir(path: string, cred: Cred, cb: BFSOneArgCallback): void;
    mkdir(p: string, mode: any, cred: Cred, cb: BFSOneArgCallback): void;
    readdir(path: string, cred: Cred, cb: BFSCallback<string[]>): void;
    private newFile;
    private getHandle;
}
export {};
