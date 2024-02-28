"use client";

import { useState } from "react";
import { type FormikValues } from "formik";
import { SimpleForm, type SimpleFormProps } from "./SimpleForm";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

interface SimpleDialogFormProps<CustomFormValues>
  extends SimpleFormProps<CustomFormValues> {
  formTitle: string;
  formDescription?: string;
  onCloseForm?: () => void;
}

export function SimpleDialogForm<CustomFormValues extends FormikValues>({
  formTitle,
  renderTrigger,
  formDescription,
  config,
  onCloseForm,
}: SimpleDialogFormProps<CustomFormValues>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnSetOpen(open: boolean) {
    if (!open) onCloseForm?.();
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnSetOpen}>
      <DialogTrigger asChild>
        {renderTrigger ? renderTrigger : <Button size="sm">{formTitle}</Button>}
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            {Boolean(formDescription) && (
              <DialogDescription>{formDescription}</DialogDescription>
            )}
          </DialogHeader>
          <SimpleForm<CustomFormValues>
            config={config}
            onSuccess={() => {
              handleOnSetOpen(false);
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
