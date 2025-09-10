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

