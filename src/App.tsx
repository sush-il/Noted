import { useState } from "preact/hooks";
import "./App.css";
import Editor from "./components/editor";
import Navbar from "./components/navbar";

export interface fileDetailProp {
    path: string,
    folderPath: string,
    content: string
}

function App() {
  const [selectedFile, setFileDetails] = useState<fileDetailProp>({path: "", folderPath: "", content: ""});
  return (
    <div className={"flex w-full h-screen justify-between flex-row bg-gray-100 dark:bg-gray-900 p-4"}> 
      <Navbar setFileDetails={setFileDetails}/>
      <Editor file={selectedFile} />
    </div>

  );
}

export default App;
