import express, { Express } from "express";
import dotenv from "dotenv";
import { createPdfLogCover, createPdfLogInteriorPages } from "./printables";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3020;

app.get("/");

app.get("/pdf/new/interior", createPdfLogInteriorPages);

app.get("pdf/new/cover", createPdfLogCover);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
