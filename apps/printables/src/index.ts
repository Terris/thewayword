import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ConvexHttpClient } from "convex/browser";
import { Id, api } from "@repo/convex";
import { extractTextRecursively } from "./utils";
import * as util from "util";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3020;

app.get("/", async (req: Request, res: Response) => {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  const adventureLog = await convexClient
    // @ts-ignore
    .query(api.printables.findAdventureLogByIdAsMachine, {
      id: "mh7b0cz1ybwcwmaz0yw7y8x6zx6sg2fp" as Id<"adventureLogs">,
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
  const baseFontSize = 10;

  // cover page
  const cover = pdfDoc.addPage([324, 513]);
  const { width: pageWidth, height: pageHeight } = cover.getSize();
  const titleFontSize = 18;
  cover.drawText(adventureLog.title, {
    x: 50,
    y: 120,
    size: titleFontSize,
    font: bolfFont,
    color: rgb(0, 0, 0),
    maxWidth: pageWidth - 100,
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

  const interiorBlocks = adventureLog.blocks.filter(
    (block) => block._id !== adventureLogCoverImage?._id
  );

  await Promise.all(
    interiorBlocks.map(async (block, index) => {
      if (block.type === "image" && block.file?.url) {
        const newPage = pdfDoc.addPage([324, 513]);
        const fileUrl = block.file.url;
        const fileImageBytesRes = await fetch(fileUrl);
        const fileImageBytes = await fileImageBytesRes.arrayBuffer();
        const image = await pdfDoc.embedJpg(fileImageBytes);
        const imageDims = image.scaleToFit(324 - 100, 300);
        newPage.drawImage(image, {
          x: 50,
          y: 300,
          width: imageDims.width,
          height: imageDims.height,
        });
      } else if (block.type === "text" && block.content) {
        const textAsJson = JSON.parse(block.content);
        const text = extractTextRecursively(textAsJson.content).slice(0, 500);
        console.log(text, text.length);

        // new page per x chars

        const newPage = pdfDoc.addPage([324, 513]);
        newPage.drawText(text, {
          x: 50,
          y: pageHeight - 50,
          size: baseFontSize,
          font: baseFont,
          lineHeight: 16,
          color: rgb(0, 0, 0),
          maxWidth: 224,
        });
      }
    })
  );

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
