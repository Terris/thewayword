"use client";

import { Button, Dialog, DialogContent, DialogTrigger, Text } from "@repo/ui";
import { useState } from "react";
import { CreateShopProductForm } from "./CreateShopProductForm";
import { ShopProductsTable } from "./ShopProductsTable";

export default function AdminProductsPage() {
  const [formIsOpen, setFormIsOpen] = useState(false);

  return (
    <div className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <Text className="font-bold text-xl pb-4">Admin Products</Text>
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
