import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { ConvexHttpClient } from "convex/browser";
import { Id, api } from "@repo/convex";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3020;

app.get("/", async (req: Request, res: Response) => {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  const adventureLog = await convexClient
    // @ts-ignore
    .query(api.printables.findAdventureLogByIdAsMachine, {
      id: "mh75143hb3rm7btv1x5ak7h76d6rvbf8" as Id<"adventureLogs">,
    });

  if (!adventureLog) {
    return res.status(404).send("Adventure log not found!");
  }

  const adventureLogCoverImage = adventureLog.blocks.find(
    (block) => block.type === "image"
  );

  // CREATE PDF
  const pdfDoc = await PDFDocument.create();
  const baseFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const bolfFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const cover = pdfDoc.addPage([324, 513]);
  const contentFontSize = 12;
  const { width, height } = cover.getSize();
  const titleFontSize = 18;
  cover.drawText(adventureLog.title, {
    x: 50,
    y: 120,
    size: titleFontSize,
    font: bolfFont,
    color: rgb(0, 0, 0),
    maxWidth: width - 100,
  });

  if (adventureLogCoverImage && adventureLogCoverImage.file?.url) {
    const fileUrl = adventureLogCoverImage.file.url;
    const fileImageBytesRes = await fetch(fileUrl);
    const fileImageBytes = await fileImageBytesRes.arrayBuffer();
    const image = await pdfDoc.embedJpg(fileImageBytes);

    const imageDims = image.scaleToFit(324 - 100, 300);
    cover.drawImage(image, {
      x: 50,
      y: 300,
      width: imageDims.width,
      height: imageDims.height,
    });
  }

  const page1 = pdfDoc.addPage([324, 513]);
  if (adventureLog.user?.name) {
    page1.drawText(adventureLog.user.name, {
      x: 50,
      y: 100,
      size: contentFontSize,
      font: baseFont,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  // new Upload({
  //   client: new S3Client({
  //     credentials: fromCognitoIdentityPool({
  //       clientConfig: { region: "us-east-2" },
  //       identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
  //     }),
  //     region: "us-east-1",
  //   }),
  //   params: {
  //     Bucket: process.env.S3_BUCKET_NAME,
  //     Key: `${process.env.S3_FOLDER}/printable-${new Date().toUTCString()}.pdf`,
  //     Body: buffer,
  //   },
  // })
  //   .done()
  //   .then((data) => {
  //     console.log("SUCCESS:", data);
  //   })
  //   .catch((err) => {
  //     console.log("ERROR!:", err);
  //   });

  res.setHeader("Content-Type", "application/pdf");
  res.send(buffer);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
