import { useEffect, useRef } from "preact/hooks";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame-dark.css";
import { warn } from "@tauri-apps/plugin-log";
import { writeFileContent } from "../util/io";
import { fileDetailProp } from "../App";

export default function Editor({ file }: { file: fileDetailProp }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  const crepe = new Crepe({
    root: editorRef.current,
    defaultValue: file.content,
  });

  crepe.create();
  crepeRef.current = crepe;
  
 useEffect(() => {
    crepe.on((listener) => {
      listener.markdownUpdated(() => {
        const markdown = crepe.getMarkdown();
        writeFileContent(file.path, markdown);
      });
    });

    return () => {
      crepe.destroy();
      crepeRef.current = null;
    }

  }, [file.content]);


  return (
    <div
        ref={editorRef}
        className="
          [&>.milkdown]:min-h-[100vh]
          [&_.editor]:min-h-[100vh] 
        [&_.editor]:dark:bg-gray-900 
          overflow-auto w-full"
    />
  );
}
