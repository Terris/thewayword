import { type Id, api } from "@repo/convex";
import { useQuery } from "convex/react";
import { LoadingBox } from "@repo/ui";
import { EditableBlock } from "./EditableBlock";

export function EditableAdventureLogBlocks({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const adventureLogBlocks = useQuery(
    api.adventureLogBlocks.findAllByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const isLoading = adventureLogBlocks === undefined;

  if (isLoading) return <LoadingBox />;

  return adventureLogBlocks.map((block) => (
    <div key={block._id} className="pb-8">
      <EditableBlock block={block} />
    </div>
  ));
}
