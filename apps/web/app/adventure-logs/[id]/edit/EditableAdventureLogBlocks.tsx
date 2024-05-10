import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { cn } from "@repo/utils";
import { EditableBlock } from "./EditableBlock";
import { BlockEditorProvider } from "./BlockEditorContext";

export function EditableAdventureLogBlocks({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) {
  const { id } = useParams();
  const adventureLogBlocks = useQuery(
    api.adventureLogBlocks.findAllByAdventureLogId,
    {
      adventureLogId: id as Id<"adventureLogs">,
    }
  );

  const isLoading = adventureLogBlocks === undefined;

  if (isLoading) return <LoadingBox />;

  return (
    <BlockEditorProvider adventureLogId={id as Id<"adventureLogBlocks">}>
      <div className={cn(adventureLogBlocks.length && "mb-16")}>
        {adventureLogBlocks.map((block) => (
          <div key={block._id} className="pb-8">
            <EditableBlock block={block} setIsSaving={setIsSaving} />
          </div>
        ))}
      </div>
    </BlockEditorProvider>
  );
}
