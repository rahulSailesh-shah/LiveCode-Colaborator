import { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import { useNavigate, useParams } from "react-router-dom";

function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { id, userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let ws: WebSocket | null = null;

    const setupContest = async () => {
      if (!id || !userId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/contest/${id}`);
        if (!response.ok) {
          console.error("Invalid contest ID");
          navigate("/");
          return;
        }

        ws = new WebSocket(
          `ws://localhost:8080/?contestId=${id}&userId=${userId}`
        );

        ws.onopen = () => {
          console.log("Connected to WebSocket server");
          setSocket(ws);
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === "executing_code") {
            console.log("Executing code");
          }
          if (message.type === "code_result") {
            console.log("Code result: ", message.payload);
          }
        };

        ws.onerror = () => {
          navigate("/");
        };
      } catch (error) {
        console.error("Error setting up contest:", error);
        navigate("/");
      }
    };

    setupContest();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [id, navigate, userId]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    const doc = new Y.Doc();

    const provider = new WebrtcProvider(id!, doc);
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
  };

  const handleSave = () => {
    if (
      editorRef.current &&
      socket &&
      socket.readyState === WebSocket.OPEN &&
      id
    ) {
      const code = editorRef.current.getValue();
      console.log("Sending code:", code);
      socket.send(
        JSON.stringify({
          type: "code_submit",
          payload: {
            code,
            codeId: "63",
            contestId: id,
          },
        })
      );
    } else {
      console.error("Editor or WebSocket not initialized or not open");
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
