import { RecordingManifest } from '../types/recorder';

export interface StorageSession {
  appendChunk: (chunk: Blob) => Promise<void>;
  saveManifest: (manifest: RecordingManifest) => Promise<void>;
  finish: () => Promise<Blob>;
  abort: () => Promise<void>;
  isUsingOpfs: boolean;
  getRecordedBytes: () => number;
}

export class OpfsStorageManager {
  /**
   * Check if Origin Private File System (OPFS) is supported in current browser environment
   */
  public static isOpfsSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.storage &&
      typeof navigator.storage.getDirectory === 'function'
    );
  }

  /**
   * Start a new recording session, prioritizing OPFS with graceful in-memory fallback
   */
  public static async createSession(
    sessionId: string,
    mimeType: string
  ): Promise<StorageSession> {
    const isSupported = this.isOpfsSupported();
    let opfsFileHandle: FileSystemFileHandle | null = null;
    let opfsWritable: FileSystemWritableFileStream | null = null;
    let opfsDirectory: FileSystemDirectoryHandle | null = null;

    const memoryChunks: Blob[] = [];
    let totalBytesRecorded = 0;
    let isUsingOpfs = false;
    let opfsFailed = false;

    if (isSupported) {
      try {
        opfsDirectory = await navigator.storage.getDirectory();
        // Create recording subfolder
        const recordingsDir = await opfsDirectory.getDirectoryHandle('dadashmode_recordings', {
          create: true,
        });

        opfsFileHandle = await recordingsDir.getFileHandle(`${sessionId}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`, {
          create: true,
        });

        opfsWritable = await opfsFileHandle.createWritable();
        isUsingOpfs = true;
        console.log('[OpfsStorage] OPFS session initialized:', sessionId);
      } catch (err) {
        console.warn('[OpfsStorage] OPFS init failed, falling back to memory chunks:', err);
        isUsingOpfs = false;
      }
    }

    return {
      isUsingOpfs,
      getRecordedBytes: () => totalBytesRecorded,

      appendChunk: async (chunk: Blob) => {
        totalBytesRecorded += chunk.size;
        memoryChunks.push(chunk);

        if (opfsWritable) {
          try {
            await opfsWritable.write(chunk);
          } catch (e) {
            console.warn('[OpfsStorage] Failed writing chunk to OPFS:', e);
            opfsFailed = true;
          }
        }
      },

      saveManifest: async (manifest: RecordingManifest) => {
        const jsonStr = JSON.stringify(manifest, null, 2);
        try {
          if (opfsDirectory) {
            const recordingsDir = await opfsDirectory.getDirectoryHandle('dadashmode_recordings', {
              create: true,
            });
            const manifestHandle = await recordingsDir.getFileHandle(`${sessionId}_manifest.json`, {
              create: true,
            });
            const writable = await manifestHandle.createWritable();
            await writable.write(jsonStr);
            await writable.close();
          }
        } catch (e) {
          console.warn('[OpfsStorage] Failed saving manifest to OPFS:', e);
        }
      },

      finish: async (): Promise<Blob> => {
        if (opfsWritable) {
          try {
            await opfsWritable.close();
          } catch (e) {
            console.warn('[OpfsStorage] Error closing OPFS writable:', e);
          }
        }

        if (opfsFileHandle) {
          try {
            const file = await opfsFileHandle.getFile();
            if (!opfsFailed && file.size === totalBytesRecorded && file.size > 0) {
              return file;
            }
          } catch (e) {
            console.warn('[OpfsStorage] Error reading OPFS recorded file, using memory fallback:', e);
          }
        }

        // Fallback: Assemble combined Blob from memory chunks
        return new Blob(memoryChunks, { type: mimeType });
      },

      abort: async () => {
        if (opfsWritable) {
          try {
            await opfsWritable.abort();
          } catch {}
        }
        memoryChunks.length = 0;
      },
    };
  }
}
