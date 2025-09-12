import { open } from '@tauri-apps/plugin-dialog';
import { create, readTextFile, writeTextFile, readDir } from '@tauri-apps/plugin-fs';
import { warn, debug, error } from '@tauri-apps/plugin-log';
import { saveOpenDirectory } from './store';
import { FileMetaData } from './dataTypes';

export async function pickFolder(setFolderPath: (path: string) => void) {
    const selected = await open({
        multiple: false,
        directory: true,
    });

    if (typeof selected === "string") {
        setFolderPath(selected);
        await saveOpenDirectory(selected);
    } else {
        error('Unable to set path for the selected directory')
    }

}

export async function getFolderEntries( folderPath: string, setFolderEntries: (entries: FileMetaData[]) => void) {
  try {
    const response = await readDir(folderPath);
    
    const mdFilesOnly = response.filter(entry =>
      entry.name?.toLowerCase().endsWith(".md") ||
      (entry.isDirectory && !entry.name?.toLowerCase().startsWith("."))
    ).map((entry) => ({
      name: entry.name ?? "",
      filePath: `${folderPath}/${entry.name}`,
      isFile: entry.isFile,
      isDirectory: entry.isDirectory,
    }));

    setFolderEntries(mdFilesOnly);
  } catch (err) {
    error("Error in getFolderEntries: " + (err instanceof Error ? err.message : String(err)));
  }
}

export async function readFileContent(filePath: string){
  try {
    const fileContent = await readTextFile(filePath);
    return fileContent;
  } catch (err) {
    error("Error reading file: " + (err instanceof Error ? err.message : String(err)));
  }

}

export async function writeFileContent(filePath: string, content: string) {
  try {
    await writeTextFile(filePath, content);
  } catch (err) {
    error("Error writing file: " + (err instanceof Error ? err.message : String(err)));
  }
}

export async function createNewFile(path:string) {
  try {
    await create(path);
  } catch (err) {
    error("Error creating file: " + (err instanceof Error ? err.message : String(err)));
    throw err;
  }
}