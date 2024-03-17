/// <reference types="gapi" />
/// <reference types="gapi.client.drive-v3" />
import { ApiError } from '../ApiError';
import { Cred } from '../cred';
import { FileFlag } from '../file';
import { BaseFileSystem, FileSystemMetadata } from '../filesystem';
import PreloadFile from '../generic/preload_file';
import { FileType, Stats } from '../stats';
import { BackendOptions, CreateBackend } from './backend';

/**
 * A read/write file system backed by Google Drive cloud storage.
 * Uses the Google Drive V3 API.
 *
 * Prepare:
 * loadScript('https://apis.google.com/js/api.js').then(async () => {
 *   gapi.load('client', () => {
 *     gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
 * });
 */

type File = {
	id: string;
	name: string;
	mimeType: string;
	modifiedTime: string;
	createdTime: string;
	size: number;
};

export class GoogleDriveFileSystem extends BaseFileSystem {
	public static readonly Name = 'GoogleDriveV3';

	public static Create = CreateBackend.bind(this);

	public static readonly Options: BackendOptions = {};

	public static isAvailable(): boolean {
		// Checks if the Google Drive API is loaded.
		return typeof globalThis.gapi?.client?.drive !== 'undefined';
	}

	public constructor() {
		super();
	}

	public get metadata(): FileSystemMetadata {
		return { ...super.metadata, name: GoogleDriveFileSystem.Name };
	}

	READDIR_MAX_FILES_LIMIT = 1000;
	READDIR_FIELDS = ['id', 'name', 'mimeType', 'modifiedTime', 'createdTime', 'size'];
	READDIR_OPERATIONS_LIMIT = 30;
	// map: path -> { files: { name -> File } }
	dirFilesMap: Record<string, { files: Record<string, File> /* nextPageToken: string | null */ }> = {};

	_readdirTimes = 0;
	isReadonly = false;

	savingFiles = [] as string[];

	_isRoot(path: string) {
		return path === '/' || path === '';
	}
	_getExistingFileId(path: string) {
		if (this._isRoot(path)) {
			return 'root';
		}
		const parentPath = this._getParentPath(path);
		const parent = this.dirFilesMap[parentPath];
		if (!parent) {
			return null;
		}
		return parent.files[path.split('/').pop()]?.id;
	}
	async _getFileId(path: string, throwIfNotFound = true) {
		const id = this._getExistingFileId(path);
		if (id === null) {
			const parentPath = this._getParentPath(path);
			await this.readdir(parentPath, null, { withFileTypes: true }, true);
			return this._isRoot(parentPath) ? this._getExistingFileId(path) : this._getFileId(path, throwIfNotFound);
		}
		if (id === undefined && throwIfNotFound) {
			throw ApiError.ENOENT(path);
		}
		return id;
	}

	async readdir(path: string, cred: any, optionsOrCallback = {} as any, internalCall = false) {
		console.debug('readdir', path);
		if (!internalCall) {
			this._readdirTimes = 0;
		}
		if (this._readdirTimes++ > this.READDIR_OPERATIONS_LIMIT) {
			throw new Error('Too many readdir operations');
		}
		try {
			const fileId = await this._getFileId(path);
			if (!fileId) {
				throw new Error(`Path not found: ${path}`);
			}

			let files: File[];
			if (this.dirFilesMap[path]) {
				files = Object.values(this.dirFilesMap[path].files);
			} else {
				const res = await gapi.client.drive.files.list({
					q: `'${fileId}' in parents and trashed=false`,
					// also include
					fields: `files(${this.READDIR_FIELDS.join(',')})`,
					pageSize: this.READDIR_MAX_FILES_LIMIT,
				});
				files = (res.result as any).files;
			}

			if (files.length >= this.READDIR_MAX_FILES_LIMIT) {
				// throw new Error(`Too many files in directory: ${path}`);
				console.warn(`Too many files in directory: ${path}`);
			}
			const mapped = /* options.withFileTypes;
			? files.map(file => ({
						name: file.name,
						isDirectory: file.mimeType === 'application/vnd.google-apps.folder',
				  }))
				:  */ files.map(file => file.name);

			this.dirFilesMap[path] = {
				files: Object.fromEntries(files.map(file => [file.name, file])),
				// nextPageToken: res.result.nextPageToken,
			};
			if (typeof optionsOrCallback === 'function') {
				optionsOrCallback(null, mapped);
			}
			return mapped;
		} catch (err) {
			if (typeof optionsOrCallback === 'function') {
				optionsOrCallback(this._processError(err));
			}
			throw this._processError(err);
		}
	}

	_getParentPath(path) {
		const parts = path.split('/');
		parts.pop();
		return parts.join('/');
	}

	async _syncFile(path, data, callback) {
		// todo workaround
		if (this.savingFiles.includes(path)) {
			console.debug('[google drive] Skipping saving file because already saving', path);
			return;
		}
		try {
			this.savingFiles.push(path);
			let fileExists = true;
			try {
				await this._getFileId(path);
			} catch (err) {
				fileExists = false;
			}
			// skip empty data (wipe file)
			if (fileExists && data.length === 0) {
				console.debug('[google drive] Skipping saving file because empty', path);
				return;
			}
			if (this.isReadonly) {
				console.debug('[google drive] Skipping saving file because in read only mode', path);
				// console.trace();
				return;
			} else {
				console.debug('[google drive] Saving file', path);
			}
			const name = path.split('/').pop();

			let fileId = await this._getFileId(path, false);
			if (!fileId) {
				const parentId = await this._getFileId(this._getParentPath(path));
				const mimeType = 'application/octet-stream';

				// const fileMetadata = {
				// 	parents: [parentId],
				// 	name,
				// 	mimeType,
				// };
				const res = await gapi.client.drive.files.create({
					// resource: fileMetadata,
					// media: {
					// 	mimeType: mimeType,
					// 	// body: blob,
					// }
					mimeType,
					name,
					parents: [parentId],
					// fields: "id",
				} as any);
				fileId = res.result.id;
			}

			const blob = new Blob([data], { type: 'application/octet-stream' });
			const file = new File([blob], name, { type: 'application/octet-stream' });
			const res = await fetch(`https://content.googleapis.com/upload/drive/v3/files/${fileId}?access_token=${gapi.auth.getToken().access_token}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/octet-stream',
				},
				body: file,
			});
			const map = this.dirFilesMap[this._getParentPath(path)];
			map.files[path.split('/').pop()] = {
				id: fileId,
				name,
				mimeType: 'application/octet-stream',
				modifiedTime: new Date().toISOString(),
				createdTime: new Date().toISOString(),
				size: data.length,
			};
			if (!res.ok) throw new Error('Failed to upload file');
		} catch (err) {
			throw this._processError(err);
		} finally {
			this.savingFiles = this.savingFiles.filter(f => f !== path);
		}
	}

	async mkdir(path, mode, cred, callback) {
		const fileId = await this._getFileId(path, false);
		if (fileId) {
			callback?.();
			return;
		}
		try {
			let fileId = 'virtual';
			if (this.isReadonly) {
				console.debug('[google drive] Skipping creating directory because in read only mode', path);
			} else {
				console.debug('[google drive] creating directory', path);
				const parentId = await this._getFileId(this._getParentPath(path));
				const res = await gapi.client.drive.files.create({
					mimeType: 'application/vnd.google-apps.folder',
					name: path.split('/').pop(),
					parents: [parentId],
					// fields: "id",
				} as any);
				fileId = res.result.id;
			}
			const map = this.dirFilesMap[this._getParentPath(path)];
			map.files[path.split('/').pop()] = {
				id: fileId,
				name: path.split('/').pop(),
				mimeType: 'application/vnd.google-apps.folder',
				modifiedTime: new Date().toISOString(),
				createdTime: new Date().toISOString(),
				size: 0,
			};
			this.dirFilesMap[path] = {
				files: {},
			};
			callback?.();
		} catch (err) {
			if (callback) {
				callback?.(this._processError(err));
			} else {
				throw this._processError(err);
			}
		}
	}

	async rmdir(path) {
		throw new Error('Not implemented');
	}

	async unlink(path) {
		throw new Error('Not implemented');
	}

	async createFile(p: string, _flags: FileFlag, mode: number, _cred: Cred) {
		const fileData = Buffer.alloc(0);
		try {
			await this._syncFile(p, fileData);
			return new GoogleDriveFile(this, p, _flags, new Stats(FileType.FILE, 0, 0o644, Date.now(), Date.now()), fileData);
		} catch (err) {
			if (callback) {
				callback?.(this._processError(err));
			} else {
				throw this._processError(err);
			}
		}
	}

	async openFile(path: string, _flags: FileFlag, _cred: Cred, callback) {
		try {
			const fileId = await this._getFileId(path);
			console.debug('reading file', path);
			const res = await gapi.client.drive.files.get({
				fileId: fileId,
				alt: 'media',
			});
			const body = res.body as string;
			const arrayBuffer = new ArrayBuffer(body.length);
			const view = new Uint8Array(arrayBuffer);
			for (let i = 0; i < body.length; i++) {
				view[i] = body.charCodeAt(i);
			}
			const buffer = Buffer.from(arrayBuffer);
			const file = new GoogleDriveFile(this, path, _flags, new Stats(FileType.FILE, buffer.length), buffer);
			callback?.(null, file);
			return file;
		} catch (err) {
			if (callback) {
				callback?.(this._processError(err));
			} else {
				throw this._processError(err);
			}
		}
	}

	async stat(path: string, falseVar, cred, callback) {
		// todo test deleted
		try {
			// todo quick this.dirFilesMap[path] discovery
			const fileId = await this._getFileId(path);
			const parentPath = this._getParentPath(path);
			const file = this.dirFilesMap[parentPath].files[path.split('/').pop()];
			const isDir = file.mimeType === 'application/vnd.google-apps.folder';
			const fileType = isDir ? FileType.DIRECTORY : FileType.FILE;
			const stats = new Stats(
				fileType,
				file.size ? +file.size : 4096,
				undefined,
				file.modifiedTime && new Date(file.modifiedTime).valueOf(),
				file.createdTime && new Date(file.createdTime).valueOf()
			);
			callback?.(null, stats);
			return stats;
		} catch (err) {
			if (callback) {
				callback?.(this._processError(err));
			} else {
				throw this._processError(err);
			}
		}
	}

	async rename(oldPath: string, newPath: string, callback) {
		try {
			const fileId = await this._getFileId(oldPath);
			const oldName = oldPath.split('/').pop();
			const newName = newPath.split('/').pop();
			const res = await gapi.client.drive.files.update({
				fileId: fileId,
				name: newName,
				fields: 'id',
			} as any);
			const newFileId = res.result.id;
			const map = this.dirFilesMap[this._getParentPath(newPath)];
			const file = map.files[oldName];
			delete map.files[oldName];
			map.files[newName] = file;
			file.name = newName;
			callback?.(null);
		} catch (err) {
			throw this._processError(err);
		}
	}

	_processError(err) {
		// Implement your error handling logic here
		return err;
	}
}

export class GoogleDriveFile extends PreloadFile<GoogleDriveFileSystem> implements File {
	constructor(_fs: GoogleDriveFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
		super(_fs, _path, _flag, _stat, contents);
	}
	id: string;
	name: string;
	mimeType: string;
	modifiedTime: string;
	createdTime: string;
	size: number;

	public async sync(): Promise<void> {
		if (!this.isDirty()) {
			return;
		}

		await this._fs._syncFile(this.getPath(), this.getBuffer());

		this.resetDirty();
	}

	public async close(): Promise<void> {
		this.sync();
	}
}
