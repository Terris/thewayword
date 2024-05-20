import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3020;

app.get("/", async (req: Request, res: Response) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText("Creating PDFs in JavaScript is awesome!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  new Upload({
    client: new S3Client({
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
      }),
      region: "us-east-1",
    }),
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_FOLDER}/printable-${new Date().toUTCString()}.pdf`,
      Body: buffer,
    },
  })
    .done()
    .then((data) => {
      console.log("SUCCESS:", data);
    })
    .catch((err) => {
      console.log("ERROR!:", err);
    });

  res.setHeader("Content-Type", "application/pdf");
  res.send(buffer);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
