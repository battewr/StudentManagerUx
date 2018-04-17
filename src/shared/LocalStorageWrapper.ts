
class StorageShim implements Storage {
    [key: string]: any;
    length: number;
    clear(): void {
    }
    getItem(key: string): string {
        return null;
    }
    key(index: number): string {
        return null;
    }
    removeItem(key: string): void {

    }
    setItem(key: string, value: string): void {
    }
}

export class LocalStorageWrapper {
    private static _localStorageWrapper: Storage;
    static init() {
        try {
            this._localStorageWrapper = localStorage;
            this._localStorageWrapper.setItem("student_manager_test", "test");
            if ("test" !== this._localStorageWrapper.getItem("student_manager_test")) {
                console.error("failed localstorage check falling back to stub");
                this._localStorageWrapper = new StorageShim();
            }
            this._localStorageWrapper.removeItem("student_manager_test");
        } catch (error) {
            console.error("failed localstorage exception falling back to stub");
            console.error(`Error: ${error}`);
            this._localStorageWrapper = new StorageShim();
        }
    }

    public static get(): Storage {
        return this._localStorageWrapper;
    }
}

LocalStorageWrapper.init();