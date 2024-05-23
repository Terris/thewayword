"use node";

import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import sharp from "sharp";

export const optimizeImage = internalAction({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.runQuery(internal.files.systemFindById, {
      id: fileId,
    });
    if (!file) throw new ConvexError("File not found");

    const fileImageBytesRes = await fetch(file.url);
    const fileImageBytes = await fileImageBytesRes.arrayBuffer();
    const optimizedImageBuffer = await sharp(fileImageBytes)
      .resize({
        width: 1400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .withMetadata()
      .toFormat("webp")
      .toBuffer();

    const { width, height, size } =
      await sharp(optimizedImageBuffer).metadata();

    const s3FileKey = `${process.env.S3_FOLDER}/optimized-1400-${file._id}.webp`;

    // upload to S3
    await new Upload({
      client: new S3Client({
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: "us-east-2" },
          identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
        }),
        region: "us-east-1",
      }),
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_FOLDER}/optimized-1400-${file._id}.webp`,
        Body: optimizedImageBuffer,
      },
    }).done();

    const optimizedUrl = `${process.env.S3_BUCKET_URL}/${s3FileKey}`;

    // update the file with the new url
    await ctx.runMutation(internal.files.systemUpdate, {
      id: fileId,
      url: optimizedUrl,
      size,
      dimensions: { width, height },
    });

    return true;
  },
});
