import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@repo/ui";
import { Masthead } from "./Masthead";
import { AppProviders } from "./AppProviders";
import { Footer } from "./Footer";
import "@repo/ui/globals.css";
import "./app.css";

export const metadata = {
  title: "The Wayword",
  description: "An adventure app for those whose best days are spent outdoors.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/jke7edq.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen antialiased font-futura font-medium border-b-8 border-b-amber-400">
        <AppProviders>
          <div className="flex flex-col w-full flex-1">
            <Masthead />
            <main className="w-full flex flex-col items-start justify-start">
              {children}
            </main>
            <Footer />
            {modal}
            <Toaster />
          </div>
          <Analytics />
          <SpeedInsights />
        </AppProviders>
      </body>
    </html>
  );
}
