import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import { ConvexHttpClient } from "convex/browser";
import { Id, api } from "@repo/convex";
import { extractTextRecursively } from "./utils";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3020;

app.get("/", async function (req: Request, res: Response) {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  const adventureLog = await convexClient
    // @ts-ignore
    .query(api.printables.findAdventureLogByIdAsMachine, {
      id: "mh7b0cz1ybwcwmaz0yw7y8x6zx6sg2fp" as Id<"adventureLogs">,
    });

  if (!adventureLog) {
    return res.status(404).send("Adventure log not found!");
  }

  // const adventureLogCoverImage = adventureLog.blocks.find(
  //   (block) => block.type === "image"
  // );

  // CREATE PDF
  const pageWidth = 324;
  const pageHeight = 513;
  const baseFont = "Courier";
  const titleFont = "Courier-Bold";
  const baseFontSize = 10;
  const baseFontColor = "#000000";

  // create document and build buffers
  const pdfDoc = new PDFDocument({
    bufferPages: true,
    size: [pageWidth, pageHeight],
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  // write buffers to response on end
  let buffers: Buffer[] = [];
  pdfDoc.on("data", buffers.push.bind(buffers));
  pdfDoc.on("end", () => {
    let pdfData = Buffer.concat(buffers);

    // upload to S3
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
    //     Key: `${process.env.S3_FOLDER}/printable-${
    //       adventureLog._id
    //     }-${new Date().toUTCString()}.pdf`,
    //     Body: pdfData,
    //   },
    // })
    //   .done()
    //   .catch((err) => {
    //     throw new Error(err);
    //   });

    // respond to the browser
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        // "Content-disposition": "attachment;filename=test.pdf",
      })
      .end(pdfData);
  });

  // Cover page image
  // if (adventureLogCoverImage && adventureLogCoverImage.file?.url) {
  //   const fileUrl = adventureLogCoverImage.file.url;
  //   const fileImageBytesRes = await fetch(fileUrl);
  //   const fileImageBytes = await fileImageBytesRes.arrayBuffer();
  //   pdfDoc.image(fileImageBytes, {
  //     fit: [224, 300],
  //     align: "center",
  //   });
  // }

  // Cover page title
  pdfDoc
    .moveDown(26)
    .fontSize(baseFontSize + 2)
    .font(titleFont)
    .fillColor(baseFontColor)
    .text(adventureLog.title, {
      width: pageWidth - 100,
      lineGap: baseFontSize * 0.25,
    })
    .fontSize(baseFontSize - 2)
    .text("GERTON NORTH CAROLINA - MAY 18, 2024", {
      width: pageWidth - 100,
    });
  // .text(adventureLog.user?.name ?? "", {
  //   width: pageWidth - 100,
  // });

  // const interiorBlocks = adventureLog.blocks.filter(
  //   (block) => block._id !== adventureLogCoverImage?._id
  // );
  const interiorBlocks = adventureLog.blocks;

  for (const block of interiorBlocks) {
    if (block.type === "image" && block.file?.url) {
      const fileUrl = block.file.url;
      const fileImageBytesRes = await fetch(fileUrl);
      const fileImageBytes = await fileImageBytesRes.arrayBuffer();
      pdfDoc.addPage().image(fileImageBytes, {
        fit: [224, 300],
        align: "center",
      });
    } else if (block.type === "text" && block.content) {
      const textAsJson = JSON.parse(block.content);
      const text = extractTextRecursively(textAsJson.content);
      pdfDoc
        .addPage()
        .font(baseFont)
        .text(text, {
          width: pageWidth - 100,
          lineGap: baseFontSize * 0.25,
        });
    }
  }
  pdfDoc.addPage();

  pdfDoc.end();
});

app.get("/interior", async function (req: Request, res: Response) {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  const adventureLog = await convexClient
    // @ts-ignore
    .query(api.printables.findAdventureLogByIdAsMachine, {
      id: "mh7b0cz1ybwcwmaz0yw7y8x6zx6sg2fp" as Id<"adventureLogs">,
    });

  if (!adventureLog) {
    return res.status(404).send("Adventure log not found!");
  }

  // const adventureLogCoverImage = adventureLog.blocks.find(
  //   (block) => block.type === "image"
  // );

  // CREATE PDF
  const pageWidth = 324;
  const pageHeight = 513;
  const baseFont = __dirname + "/fonts/CourierPrime-Regular.ttf";
  const baseFontSize = 10;
  const baseFontColor = "#000000";

  // create document and build buffers
  const pdfDoc = new PDFDocument({
    bufferPages: true,
    size: [pageWidth, pageHeight],
    margins: { top: 50, bottom: 52, left: 50, right: 50 },
  });

  // write buffers to response on end
  let buffers: Buffer[] = [];
  pdfDoc.on("data", buffers.push.bind(buffers));
  pdfDoc.on("end", () => {
    let pdfData = Buffer.concat(buffers);

    // upload to S3
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
    //     Key: `${process.env.S3_FOLDER}/printable-${
    //       adventureLog._id
    //     }-${new Date().toUTCString()}.pdf`,
    //     Body: pdfData,
    //   },
    // })
    //   .done()
    //   .catch((err) => {
    //     throw new Error(err);
    //   });

    // respond to the browser
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        // "Content-disposition": "attachment;filename=test.pdf",
      })
      .end(pdfData);
  });

  // Cover page image
  // if (adventureLogCoverImage && adventureLogCoverImage.file?.url) {
  //   const fileUrl = adventureLogCoverImage.file.url;
  //   const fileImageBytesRes = await fetch(fileUrl);
  //   const fileImageBytes = await fileImageBytesRes.arrayBuffer();
  //   pdfDoc.image(fileImageBytes, {
  //     fit: [224, 300],
  //     align: "center",
  //   });
  // }

  pdfDoc
    .fontSize(baseFontSize + 2)
    .font(baseFont)
    .fillColor(baseFontColor);

  const interiorBlocks = adventureLog.blocks;

  for (const block of interiorBlocks) {
    if (block.type === "image" && block.file?.url) {
      const fileUrl = block.file.url;
      const fileImageBytesRes = await fetch(fileUrl);
      const fileImageBytes = await fileImageBytesRes.arrayBuffer();
      pdfDoc.addPage().image(fileImageBytes, {
        fit: [224, 300],
        align: "center",
      });
    } else if (block.type === "text" && block.content) {
      const textAsJson = JSON.parse(block.content);
      const text = extractTextRecursively(textAsJson.content);
      pdfDoc
        .addPage()
        .font(baseFont)
        .text(text, {
          width: pageWidth - 100,
          lineGap: baseFontSize * 0.25,
        });
    }
  }

  pdfDoc.end();
});

app.get("/cover", async function (req: Request, res: Response) {
  const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);
  const adventureLog = await convexClient
    // @ts-ignore
    .query(api.printables.findAdventureLogByIdAsMachine, {
      id: "mh7b0cz1ybwcwmaz0yw7y8x6zx6sg2fp" as Id<"adventureLogs">,
    });

  if (!adventureLog) {
    return res.status(404).send("Adventure log not found!");
  }

  // const adventureLogCoverImage = adventureLog.blocks.find(
  //   (block) => block.type === "image"
  // );

  console.log(__dirname);

  // CREATE PDF
  const pageWidth = 630;
  const pageHeight = 513;
  const titleFont = __dirname + "/fonts/CourierPrime-Bold.ttf";
  const baseFontSize = 10;
  const baseFontColor = "#000000";

  // create document and build buffers
  const pdfDoc = new PDFDocument({
    bufferPages: true,
    size: [pageWidth, pageHeight],
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  // write buffers to response on end
  let buffers: Buffer[] = [];
  pdfDoc.on("data", buffers.push.bind(buffers));
  pdfDoc.on("end", () => {
    let pdfData = Buffer.concat(buffers);

    // upload to S3
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
    //     Key: `${process.env.S3_FOLDER}/printable-cover-${
    //       adventureLog._id
    //     }-${new Date().toUTCString()}.pdf`,
    //     Body: pdfData,
    //   },
    // })
    //   .done()
    //   .catch((err) => {
    //     throw new Error(err);
    //   });

    // respond to the browser
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        // "Content-disposition": "attachment;filename=test.pdf",
      })
      .end(pdfData);
  });

  // Cover page title
  pdfDoc
    .moveDown(26)
    .fontSize(baseFontSize + 2)
    .font(titleFont)
    .fillColor(baseFontColor)
    .text(adventureLog.title, pageWidth / 2 + 50, pageHeight - 100, {
      width: pageWidth - 100,
      lineGap: baseFontSize * 0.25,
    })
    .fontSize(baseFontSize - 2)
    .text("GERTON NORTH CAROLINA - MAY 18, 2024", {
      width: pageWidth - 100,
    });
  pdfDoc.end();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
