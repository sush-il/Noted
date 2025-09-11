import "./App.css";
import Editor from "./components/editor";
import Navbar from "./components/navbar";

function App() {
  // const crepe = Editor();

  return (
    <div className={"flex w-full h-screen justify-between flex-row bg-gray-100 dark:bg-gray-800 p-4"}> 
      <Navbar />
      <Editor />
    </div>

  );
}

export default App;
