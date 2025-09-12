import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { warn, debug, error } from '@tauri-apps/plugin-log';
import { saveOpenDirectory } from './store';


export type FileMetaData = {
  name: string;
  filePath: string;
  isFile: boolean;
  isDirectory: boolean;
};

export async function pickFolder(setFolderPath: (path: string) => void) {
    const selected = await open({
        multiple: false,
        directory: true,
    });

    if (typeof selected === "string") {
        setFolderPath(selected);
        await saveOpenDirectory(selected);
    } else {
        warn('Unable to set path for the selected directory')
    }

}

export async function getFolderEntries( folderPath: string, setFolderEntries: (entries: FileMetaData[]) => void) {
  try {
    const response = await readDir(folderPath, {baseDir: BaseDirectory.Home});
    
    const mdFilesOnly: FileMetaData[] = response.filter(entry =>
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
    warn("Error in getFolderEntries: " + (err instanceof Error ? err.message : String(err)));
  }
}

export async function readFileContent(filePath: string){
  const fileContent = await readTextFile(filePath);
  return fileContent;
}

export async function writeFileContent(filePath: string, content: string) {
  await writeTextFile(filePath, content);
}