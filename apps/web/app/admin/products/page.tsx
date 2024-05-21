"use client";

import { Button, Dialog, DialogContent, DialogTrigger, Text } from "@repo/ui";
import { useState } from "react";
import { CreateShopProductForm } from "./CreateShopProductForm";
import { ShopProductsTable } from "./ShopProductsTable";

export default function AdminProductsPage() {
  const [formIsOpen, setFormIsOpen] = useState(false);

  return (
    <div className="w-full p-8">
      <div className="w-full flex items-center justify-between pb-4 -mt-[6px]">
        <Text className="font-bold text-xl">
          Admin <span className="font-normal">Products</span>
        </Text>
        <Dialog
          open={formIsOpen}
          onOpenChange={(o) => {
            setFormIsOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <Button>Create product</Button>
          </DialogTrigger>
          <DialogContent>
            <CreateShopProductForm
              onSuccess={() => {
                setFormIsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ShopProductsTable />
    </div>
  );
}
