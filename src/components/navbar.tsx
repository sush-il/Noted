import { useEffect, useState } from 'preact/hooks'
import BurgerMenu from '../assets/burgerMenu';
import NewNoteIcon from '../assets/newNote'
import NewFolderIcon from '../assets/newFolder';
import SelectDatabase from '../assets/selectDatabase';
import { FileMetaData, getFolderEntries, pickFolder } from './util/io';
import MDFileExtensionIcon from '../assets/mdFileExt';
import { getLastOpenedDirectoryPath } from './util/store';
import DropdownIcon from '../assets/mdFileExt copy';

function Navbar(){
    const [navVisible, setNavVisible] = useState(false);
    const [folderPath, setFolderPath] = useState("");
    const [folderEntries, setFolderEntries] = useState<FileMetaData[]>([]);
    
    useEffect(() => {
        async function loadSavedPath() {
            const savedPath = await getLastOpenedDirectoryPath();
            if (savedPath) {
                setFolderPath(savedPath);
            }
        }
        loadSavedPath();
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

                    <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"> 
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-200 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            <NewNoteIcon color='#ffffff' />
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
                    { folderEntries.map((entry, idx) => (
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
                                        <a className="mt-2 text-gray-200 hover:text-white py-1 px-1 rounded-md font-medium" >
                                            {entry.name}
                                        </a>
                                    </div> 
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
