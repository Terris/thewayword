"use node";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const systemDeleteS3File = internalAction({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.runQuery(internal.files.systemFindById, {
      id: fileId,
    });
    if (!file) throw new ConvexError("File not found");

    const s3Client = new S3Client({
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
      }),
      region: "us-east-1",
    });

    const bucket = process.env.S3_BUCKET_NAME;
    const optimizedKey = `${process.env.S3_FOLDER}/optimized-w1400-${file._id}.webp`;
    const originalKey = file.originalUrl.split("/").slice(3).join("/");

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: originalKey,
      })
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: optimizedKey,
      })
    );
    return true;
  },
});

export const systemCleanUpFiles = internalAction({
  args: {},
  handler: async (ctx) => {
    const allFiles = await ctx.runQuery(internal.files.systemFindAll);

    await asyncMap(allFiles, async (file) => {
      // figure out if the file is used anywhere
      // is it part of an adventureLogBlock
      const relatedAdventureLogBlock = await ctx.runQuery(
        internal.adventureLogBlocks.systemFindByFileId,
        {
          fileId: file._id,
        }
      );
      if (relatedAdventureLogBlock) return;

      // or is it part of a shopProductImage
      const relatedShopProductImage = await ctx.runQuery(
        internal.shopProductImages.systemFindByFileId,
        {
          fileId: file._id,
        }
      );
      if (relatedShopProductImage) return;

      // if not, delete the s3 files and the file record
      await ctx.runAction(internal.fileActions.systemDeleteS3File, {
        fileId: file._id,
      });

      await ctx.runMutation(internal.files.systemDeleteById, {
        id: file._id,
      });
      return true;
    });
    return true;
  },
});
