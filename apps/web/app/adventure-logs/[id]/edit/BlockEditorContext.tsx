"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { type Id } from "@repo/convex";
// import { useMutation } from "convex/react";

interface BlockEditorContextProps {
  adventureLogId?: Id<"adventureLogBlocks">;
  editingBlockId: Id<"adventureLogBlocks"> | null | undefined;
  setEditingBlockId: (value: Id<"adventureLogBlocks"> | null) => void;
}

const initialProps = {
  adventureLogId: undefined,
  editingBlockId: null,
  setEditingBlockId: () => null,
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

  // const updateAdventureLogBlock = useMutation(api.adventureLogBlocks.update);

  return (
    <BlockEditorContext.Provider
      value={{
        adventureLogId,
        editingBlockId,
        setEditingBlockId,
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
