import localFont from "next/font/local";

export const paintFactory = localFont({
  src: [
    {
      path: "./PaintFactory-Regular.woff2",
      weight: "400",
      style: "normal",
    },

    {
      path: "./PaintFactory-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
