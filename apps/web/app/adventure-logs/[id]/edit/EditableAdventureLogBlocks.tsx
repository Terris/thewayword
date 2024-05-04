import { useParams } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { useQuery } from "convex/react";
import { LoadingBox } from "@repo/ui";
import { EditableBlock } from "./EditableBlock";

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

  console.log(adventureLogBlocks);

  const isLoading = adventureLogBlocks === undefined;

  if (isLoading) return <LoadingBox />;

  return adventureLogBlocks.map((block) => (
    <div key={block._id} className="pb-8">
      <EditableBlock block={block} setIsSaving={setIsSaving} />
    </div>
  ));
}
