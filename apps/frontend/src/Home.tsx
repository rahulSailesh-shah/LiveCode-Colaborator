import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Dialog>
        <Button className="mx-4"> Create Room</Button>
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
              className="col-span-3 flex-grow"
            />
            <Button type="submit">Join Room</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
