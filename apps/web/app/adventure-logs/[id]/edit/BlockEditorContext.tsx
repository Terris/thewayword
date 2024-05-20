"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api, type Id } from "@repo/convex";

interface EditableBlockProps {
  displaySize?: "small" | "medium" | "large";
  caption?: string;
}
interface BlockEditorContextProps {
  adventureLogId?: Id<"adventureLogBlocks">;
  editingBlockId: Id<"adventureLogBlocks"> | null | undefined;
  setEditingBlockId: (value: Id<"adventureLogBlocks"> | null) => void;
  handleUpdateBlock: (props: { values: EditableBlockProps }) => void;
}

const initialProps = {
  adventureLogId: undefined,
  editingBlockId: null,
  setEditingBlockId: () => null,
  handleUpdateBlock: () => null,
};

export const BlockEditorContext =
  createContext<BlockEditorContextProps>(initialProps);

interface BlockEditorProviderProps {
  adventureLogId: Id<"adventureLogBlocks">;
  children: ReactNode;
}

export function BlockEditorProvider({
  adventureLogId,
  children,
}: BlockEditorProviderProps) {
  const [editingBlockId, setEditingBlockId] = useState<
    Id<"adventureLogBlocks"> | null | undefined
  >(null);

  const updateAdventureLogBlock = useMutation(api.adventureLogBlocks.update);

  const handleUpdateBlock = async ({
    values,
  }: {
    values: EditableBlockProps;
  }) => {
    if (!editingBlockId) return;

    await updateAdventureLogBlock({
      id: editingBlockId,
      ...values,
    });
  };

  return (
    <BlockEditorContext.Provider
      value={{
        adventureLogId,
        editingBlockId,
        setEditingBlockId,
        handleUpdateBlock,
      }}
    >
      {children}
    </BlockEditorContext.Provider>
  );
}

export const useBlockEditorContext = () => {
  const blockEditorContext = useContext(BlockEditorContext);
  return blockEditorContext;
};
