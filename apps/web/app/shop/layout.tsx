"use client";

import { type ReactNode } from "react";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
