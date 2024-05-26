import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const cleanUpFiles = internalAction({
  args: {},
  handler: async (ctx) => {
    const allFiles = await ctx.runQuery(internal.files.systemFindAll);
    // figure out if the file is used anywhere

    // if not, delete the s3 file

    // finally, delete the file record
  },
});
