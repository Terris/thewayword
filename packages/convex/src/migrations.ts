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

const json = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Remember when we spent 12 hours at the aquarium? Remember when you sneakily found out that I like sea lions better than penguins and when you sneakily brought me over to the benches for a &lsquo;rest&rsquo; before surprising me with the best fucking animal experience ever?! You sneaky jerky. What an adventure!",
        },
      ],
    },
    { type: "paragraph", content: [{ type: "text" }] },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I will never forget the sea lion kiss slash tornado on my check. I will never forget how giddy we both were from start to finish, and how crazy the other two guests must have thought we were. I'm so happy that I can be my most exuberantly expressive self with you, and that you're always there being exuberant right back.",
        },
      ],
    },
  ],
};
