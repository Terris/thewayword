import { Request, Response } from "express";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import sharp from "sharp";

export async function optimizeFileImage(req: Request, res: Response) {
  // extract request to get file id
  const { fileId, fileUrl } = req.params;
  if (!fileId || !fileUrl) {
    return res.status(400).json({ message: "fileId and fileUrl are required" });
  }

  const fileImageBytesRes = await fetch(fileUrl);
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

  const s3FileKey = `${process.env.S3_FOLDER}/optimized-1400-${fileId}.webp`;

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
      Key: `${process.env.S3_FOLDER}/optimized-1400-${fileId}.webp`,
      Body: optimizedImageBuffer,
    },
  }).done();

  const optimizedUrl = `${process.env.S3_BUCKET_URL}/${process.env.S3_FOLDER}/${s3FileKey}`;
  res.json({ fileId, optimizedUrl });
}
