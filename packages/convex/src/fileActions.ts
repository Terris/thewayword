"use node";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const systemDeleteFileAndS3ObjectsById = internalAction({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const file = await ctx.runQuery(internal.files.systemFindById, {
      id,
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

    // delete original file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: originalKey,
      })
    );

    // delete optimized file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: optimizedKey,
      })
    );

    // delete file record
    await ctx.runMutation(internal.files.systemDeleteById, {
      id: file._id,
    });
    return true;
  },
});
