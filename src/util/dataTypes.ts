export interface IconProps {
  color: string;
  size: number; 
}

export type FileMetaData = {
  name: string;
  filePath: string;
  isFile: boolean;
  isDirectory: boolean;
};

export interface fileDetailProp {
    path: string,
    folderPath: string,
    content: string
}