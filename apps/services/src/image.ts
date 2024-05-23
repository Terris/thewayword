import { Request, Response } from "express";
import { ConvexHttpClient } from "convex/browser";
import { Id, api } from "@repo/convex";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import sharp from "sharp";

export async function optimizeFileImage(req: Request, res: Response) {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  // @ts-ignore
  const file = await convexClient.query(api.files.findById, {
    id: "mh7b0cz1ybwcwmaz0yw7y8x6zx6sg2fp" as Id<"files">,
  });

  if (!file) {
    return res.status(404).send("File not found!");
  }

  const fileImageBytesRes = await fetch(file.url);
  const fileImageBytes = await fileImageBytesRes.arrayBuffer();
  const optimizedImageBuffer = await sharp(fileImageBytes)
    .resize({
      width: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("webp")
    .toBuffer();

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

  const optimizedUrl = `${process.env.S3_BUCKET_URL}/${process.env.S3_FOLDER}/${s3FileKey}`;
  res.json({ optimizedUrl });
}
