export type MutexCallback = () => void;
/**
 * Non-recursive mutex
 * @hidden
 */
export default class Mutex {
    private _locked;
    private _waiters;
    lock(cb: MutexCallback): void;
    unlock(): void;
    tryLock(): boolean;
    isLocked(): boolean;
}
