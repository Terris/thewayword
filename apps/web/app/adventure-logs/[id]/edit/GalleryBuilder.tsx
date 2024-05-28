import { Button } from "@repo/ui";

export function GalleryBuilder({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="">
      <div className="p-8 w-full">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <h1>Gallery Builder</h1>
      </div>
    </div>
  );
}
