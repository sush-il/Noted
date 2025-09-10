import { open } from '@tauri-apps/plugin-dialog';
import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { warn, debug, error } from '@tauri-apps/plugin-log';

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
    } else {
        warn('Unable to set path for the selected directory')
    }

}

export async function getFolderEntries( folderPath: string, setFolderEntries: (entries: FileMetaData[]) => void ) {
  const response = await readDir(folderPath, {baseDir: BaseDirectory.Home});

  const mdFilesOnly: FileMetaData[] = response
    .filter((entry) => 
      entry.name?.toLowerCase().endsWith(".md") || 
      entry.isDirectory && !entry.name?.toLowerCase().startsWith(".")
    )
    .map((entry) => ({
      name: entry.name,
      filePath: `${folderPath}/${entry.name}`,
      isFile: entry.isFile,
      isDirectory: entry.isDirectory,
    }));

    setFolderEntries(mdFilesOnly);
}

