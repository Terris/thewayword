import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";

export const migrateTextBlocksToRichText = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allAdventureLogTextBlocks = await ctx.db
      .query("adventureLogBlocks")
      .filter((q) => q.eq(q.field("type"), "text"))
      .collect();

    console.log(allAdventureLogTextBlocks);

    if (!allAdventureLogTextBlocks.length) {
      return;
    }

    await asyncMap(allAdventureLogTextBlocks, async (block) => {
      if (!block.content) return;

      const contentParagraphBlocks = prepLines(block.content).map((line) => {
        return {
          type: "paragraph",
          content: [{ type: "text", text: line }],
        };
      });

      const updatedBlockJSON = {
        type: "doc",
        content: contentParagraphBlocks,
      };

      await ctx.db.patch(block._id, {
        content: JSON.stringify(updatedBlockJSON),
      });
    });
  },
});

function prepLines(block: string) {
  return block.replace('"', "[QUOTE]").trim().split(/\r?\n/);
}

const obj = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Remember when we got back to our minuscule box of an AirBnB and painted each other's nails? ",
        },
      ],
    },
    { type: "paragraph", content: [{ type: "text", text: "&nbsp;" }] },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: 'I don\'t remember what we talked about or even that we talked at all. I do remember thinking "yah :) This day, this moment, is what friendship is all about."',
        },
      ],
    },
    { type: "paragraph", content: [{ type: "text", text: "&nbsp;" }] },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I love you, Jess. Thank you for adventuring with me.",
        },
      ],
    },
    { type: "paragraph", content: [{ type: "text", text: "&nbsp;" }] },
    { type: "paragraph", content: [{ type: "text", text: "Your friend," }] },
    { type: "paragraph", content: [{ type: "text", text: "&nbsp;" }] },
    { type: "paragraph", content: [{ type: "text", text: "Sadie" }] },
  ],
};
