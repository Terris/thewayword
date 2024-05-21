"use client";

import { Text } from "@repo/ui";
import { cn } from "@repo/utils";

export default function GlobalError() {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/crw6lsz.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={cn(
          "min-h-screen antialiased font-faustina flex flex-col items-center justify-center"
        )}
      >
        <Text className="text-center text-2xl font-bold">
          Shoot, something went wrong!
        </Text>
        <Text className="text-center">
          We&rsquo;ve been notified of the problem and are working to fix it.
        </Text>
      </body>
    </html>
  );
}
