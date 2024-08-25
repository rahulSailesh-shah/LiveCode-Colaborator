import { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";

function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://your-websocket-server-url");
    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    const doc = new Y.Doc();

    const provider = new WebrtcProvider("test-room", doc);
    const type = doc.getText("monaco");

    if (!editorRef.current) {
      return;
    }

    new MonacoBinding(
      type,
      editorRef.current.getModel() as monaco.editor.ITextModel,
      new Set([editorRef.current]),
      provider.awareness
    );

    console.log(provider.awareness);
  };

  const handleSave = () => {
    if (editorRef.current && socket) {
      const code = editorRef.current.getValue();
      socket.send(JSON.stringify({ type: "save", content: code }));
    } else {
      console.error("Editor or WebSocket not initialized");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <Editor
          className="h-full w-screen"
          theme="vs-dark"
          language="javascript"
          onMount={handleEditorDidMount}
        />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-base bg-green-500 text-white border-none cursor-pointer my-4 mx-10"
      >
        Save
      </button>
    </div>
  );
}

export default CodeEditor;
