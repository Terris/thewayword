import localFont from "next/font/local";

export const shipsWhistle = localFont({
  src: [
    {
      path: "./ShipsWhistle-Rough.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./ShipsWhistle-ItalicRough.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./ShipsWhistle-BoldRough.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./ShipsWhistle-BoldItalicRough.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

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
