import { LazyStore } from '@tauri-apps/plugin-store';
import { warn, debug, error } from '@tauri-apps/plugin-log';


const store = new LazyStore('settings.json') 

export async function saveOpenDirectory(filepath: string) {
    await store.set('lastOpenedDirectoryPath', filepath);
    await store.save();
}

export async function getLastOpenedDirectoryPath(){
    const val = await store.get<string>('lastOpenedDirectoryPath');
    return val;
}

export async function saveLastOpenedFilePath(filePath: string) {
    await store.set('lastOpenedFilePath', filePath);
    await store.save();
}

export async function getLastOpenedFilePath(){
    const val = await store.get<string>('lastOpenedFilePath');
    return val;
}

