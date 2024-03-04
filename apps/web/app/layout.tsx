import { cn } from "@repo/utils";
import { Toaster } from "@repo/ui";
import "@repo/ui/globals.css";
import "./app.css";
import { Masthead } from "./Masthead";
import { AppProviders } from "./AppProviders";

export const metadata = {
  title: "Bitty Brella",
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
        <link rel="stylesheet" href="https://use.typekit.net/crw6lsz.css" />
      </head>
      <body className={cn("min-h-screen antialiased font-gelica")}>
        <AppProviders>
          <div className="flex flex-col w-full h-full min-h-screen flex-1">
            <Masthead />
            <main className="w-full flex flex-col items-start justify-start">
              {children}
            </main>
            {modal}
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
