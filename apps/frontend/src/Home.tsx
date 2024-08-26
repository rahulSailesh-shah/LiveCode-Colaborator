import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://localhost:3000/contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { id } = await response.json();
      window.location.href = `/room/${id}`;
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      console.log("object");
      const response = await fetch(`http://localhost:3000/contest/${roomId}`);
      const res = await response.json();
      if (response.ok) {
        window.location.href = `/room/${res.id}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Dialog>
        <Button className="mx-4" onClick={handleCreateRoom}>
          Create Room
        </Button>
        <DialogTrigger asChild>
          <Button variant="outline">Join Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Room ID</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-4">
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="col-span-3 flex-grow"
            />
            <Button onClick={handleJoinRoom}>Join Room</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
