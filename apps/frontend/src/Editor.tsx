import { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./components/ui/button";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { id, userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

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
          switch (message.type) {
            case "executing_code":
              setLoading(true);
              setResult("");
              break;
            case "code_result":
              setLoading(false);
              setResult(message.payload.output);
              break;
            default:
              console.log("Unhandled message:", message);
              break;
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

    const provider = new WebrtcProvider(id!, doc, {
      signaling: [`ws://localhost:8080/?contestId=${id}&userId=${userId}`],
    });
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
    <div className="w-screen h-screen p-4">
      <div className="flex space-x-4 h-[90%]">
        <div className="w-3/5 h-full p-4 rounded-2xl bg-[#1f1f1f]">
          <Editor
            theme="vs-dark"
            language="javascript"
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="w-2/5 h-full p-4 rounded-2xl bg-red-100">
          {loading ? "Loading..." : result}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-start">
        <Button className="mx-4" onClick={handleSave} disabled={loading}>
          Run Code
        </Button>
        <CopyToClipboard
          text={id!}
          onCopy={() => alert("Link copied to clipboard")}
        >
          <Button variant="outline" className="mx-4">
            Copy Room ID
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default CodeEditor;
