"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api, type Id } from "@repo/convex";

interface EditableBlockProps {
  displaySize?: "small" | "medium" | "large";
  caption?: string;
  content?: string;
  fileId?: Id<"files">;
  gallery?: {
    layout: "grid" | "masonry";
    fileIds: Id<"files">[];
  };
}
interface BlockEditorContextProps {
  adventureLogId?: Id<"adventureLogBlocks">;
  editingBlockId: Id<"adventureLogBlocks"> | null | undefined;
  setEditingBlockId: (value: Id<"adventureLogBlocks"> | null) => void;
  handleUpdateBlock: (values: EditableBlockProps) => void;
  isSaving: boolean;
}

const initialProps = {
  adventureLogId: undefined,
  editingBlockId: null,
  setEditingBlockId: () => null,
  handleUpdateBlock: () => null,
  isSaving: false,
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
  const [isSaving, setIsSaving] = useState(false);
  const updateAdventureLogBlock = useMutation(api.adventureLogBlocks.update);

  async function handleUpdateBlock(values: EditableBlockProps) {
    if (!editingBlockId) return;
    setIsSaving(true);
    await updateAdventureLogBlock({
      id: editingBlockId,
      ...values,
    });
    setIsSaving(false);
  }

  return (
    <BlockEditorContext.Provider
      value={{
        adventureLogId,
        editingBlockId,
        setEditingBlockId,
        handleUpdateBlock,
        isSaving,
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
