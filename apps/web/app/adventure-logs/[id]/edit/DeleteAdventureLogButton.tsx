import { useState } from "react";
import { api, type Id } from "@repo/convex";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
} from "@repo/ui";
import { Trash } from "lucide-react";
import { useMutation } from "convex/react";
import { useToast } from "@repo/ui/hooks";
import { useRouter } from "next/navigation";

export function DeleteAdventureLogButton({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const deleteAdventureLog = useMutation(api.adventureLogs.scheduleDestroy);

  async function handleDeleteAdventureLog() {
    try {
      await deleteAdventureLog({ id: adventureLogId });
      toast({
        title: "Success",
        description: "Adventure log deleted",
      });
      router.push(`/me/adventure-logs`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="border border-dashed border-red-600 bg-red-100 text-black p-4 rounded flex flex-col items-center justify-center gap-4">
      <Text className="text-sm font-bold font-soleil text-red-500 tracking-widest">
        DANGER ZONE!
      </Text>
      <Dialog
        open={isOpen}
        onOpenChange={(o) => {
          setIsOpen(o);
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            className="font-soleil font-black"
            variant="destructive"
            size="sm"
          >
            <Trash className="w-4 h-4 mr-2" /> DELETE THIS LOG
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center gap-4">
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              size="sm"
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void handleDeleteAdventureLog();
              }}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Yes, delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
