import { useEffect, useRef } from "preact/hooks";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";


const AUTOSAVE_KEY = "markdown-content";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const crepe = new Crepe({
        root: editorRef.current,
        defaultValue: localStorage.getItem(AUTOSAVE_KEY) ||"",
        // onChange: (val: string) => {
        //   localStorage.setItem(AUTOSAVE_KEY, val);
        // },
      });

      crepe.create();
      crepeRef.current = crepe;

      return () => {
        crepe.destroy();
      };
    }
  }, []);

  return (
    <div
        ref={editorRef}
        className="
          [&>.milkdown]:min-h-[100vh]
          [&_.editor]:min-h-[100vh] 
        [&_.editor]:dark:bg-gray-800 
        [&_.ProseMirror]:dark:text-gray-100

         overflow-auto w-full rounded-xl shadow-sm"
    />
  );
}
