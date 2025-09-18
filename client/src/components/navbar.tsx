import { useEffect, useState } from 'preact/hooks'
import { fileDetailProp } from '../util/dataTypes';
import { FileMetaData } from '../util/dataTypes';
import { createNewFile, getFolderEntries, pickFolder, readFileContent } from '../util/io';
import { getLastOpenedDirectoryPath, getLastOpenedFilePath, saveLastOpenedFilePath } from '../util/store';
import BurgerMenu from '../assets/burgerMenu';
import NewNoteIcon from '../assets/newNote'
import NewFolderIcon from '../assets/newFolder';
import SelectDatabase from '../assets/selectDatabase';
import MDFileExtensionIcon from '../assets/mdFileExt';
import DropdownIcon from '../assets/dropdown';
import { error } from '@tauri-apps/plugin-log';

interface Props {
  setFileDetails: (val: fileDetailProp) => void;
}

function Navbar({ setFileDetails }: Props){
    const [navVisible, setNavVisible] = useState(false);
    const [folderPath, setFolderPath] = useState("");
    const [folderEntries, setFolderEntries] = useState<FileMetaData[]>([]);
    const [creating, setCreating] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    
    useEffect(() => {
        async function loadSavedPaths() {
            const savedDirectoryPath = await getLastOpenedDirectoryPath();
            const savedFilePath = await getLastOpenedFilePath();

            if (savedDirectoryPath) {
                setFolderPath(savedDirectoryPath);
            }

            if (savedFilePath) {
                handleFileLoad(savedFilePath);
            }
        }
        loadSavedPaths();
    }, []);

    useEffect(() => {
        let isMounted = true;
        // Runs forever constantly checking for any file changes
        // Surely there's a better way to do this but I can't figure it out
        const tick = () => {
            if (!isMounted) return;
            if (folderPath) {
                getFolderEntries(folderPath, setFolderEntries);
            }
            setTimeout(tick, 500); // call itself after 500 ms
        };

        tick();
        return () => { isMounted = false; };

    }, [folderPath]);

    function toggleNav(){
        setNavVisible(!navVisible)
    }

    const handleFileLoad = async (path: string) => {
        try {
            const content = await readFileContent(path);
            const fileDetails = {
                content,
                folderPath,
                path
            }
            setFileDetails(fileDetails); 
            saveLastOpenedFilePath(path);
        } catch (e) {
            console.error("Failed to read file:", e);
        }
    };

    const handleCreate = () => {
        if (!newFileName.trim()) return;

        let finalFileName;

        if (!newFileName.includes(".")) {
            finalFileName = newFileName + ".md";
        } else {
            const ext = newFileName.split(".").pop()?.toLowerCase();
            if (ext !== "md") {
                error("Only .md files can be created");
                return;
            }
            finalFileName = newFileName;
        }

        finalFileName = `${folderPath}/${finalFileName}`;
        createNewFile(finalFileName);

        // reset state
        setNewFileName("");
        setCreating(false);
    };

    return (
        <nav className="flex items-center justify-between p-4 text-white fixed z-10">
            <button 
                onClick={() => toggleNav()} 
                className="p-2 rounded hover:bg-gray-800 transition-colors duration-200 bg-none z-50"
            >
                <BurgerMenu color='white' isOpen={navVisible} />
            </button>

            <div className={`fixed top-0 left-0 h-screen w-64 p-3 bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ${ navVisible ? 'translate-x-0 visible' : '-translate-x-full invisible' }`}>
                
                <div className={"flex flex-row justify-center mt-15"}> 
                    <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"> 
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-200 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            <NewFolderIcon color='#ffffff' />
                        </span>
                    </button>

                    <button onClick={() => setCreating(true)} className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"> 
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-200 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            <NewNoteIcon />
                        </span>
                    </button>
                </div>

                <div className={"flex flex-row justify-items-evenly mt-3 w-full text-gray-900 dark:text-gray-300 rounded-lg group bg-white dark:bg-gray-900"}> 
                    <span className="p-2 relative inline-flex items-center justify-center"> 
                        <SelectDatabase />
                    </span>
                    <button onClick={() => { pickFolder(setFolderPath) }} className="cursor-pointer p-2 relative inline-flex items-center justify-center overflow-hidden text-sm font-medium">
                       <p> {folderPath ? folderPath.split("/").pop() : "Select folder"} </p>
                    </button>
                </div>


                <div className="flex flex-col p-4">
                    {creating && (
                        <input
                            autoFocus
                            type="text"
                            onChange={(event) => setNewFileName(event.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate();
                                if (e.key === "Escape") {
                                    setNewFileName("");
                                    setCreating(false);
                                }
                            }}
                            placeholder="Enter file name..."
                            className="focused w-full py-2 px-3 text-sm bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                        />
                    )}
            
                    { 
                        folderEntries.sort((a, b) => {
                            if (a.isDirectory && !b.isDirectory) return -1;
                            if (!a.isDirectory && b.isDirectory) return 1;
                            return a.name.localeCompare(b.name, undefined, { numeric: true });
                        })
                        .map((entry, idx) => (
                            <div key={idx} className="flex flex-row justify-start items-center">
                                {entry.isDirectory ? 
                                    (
                                        <div className="flex flex-row items-center">
                                            <DropdownIcon size={16} />
                                            <a className="text-gray-200 hover:text-white py-1 px-1 rounded-md font-medium">
                                                {entry.name}
                                            </a>
                                        </div>
                                    ) : 
                                    
                                    (
                                        <div className="flex flex-row items-center">
                                            <MDFileExtensionIcon size={16} />
                                            <button onClick={() => handleFileLoad(entry.filePath)} className="cursor-pointer mt-2 text-gray-200 hover:text-white py-1 px-1 rounded-md font-medium" >
                                                {entry.name}
                                            </button>
                                        </div> 
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar
