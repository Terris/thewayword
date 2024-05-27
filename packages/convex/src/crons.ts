import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "index adventure log search content",
  { hours: 24 },
  internal.adventureLogs.systemIndexSearchContent
);

export default crons;
