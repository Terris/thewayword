"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { Pencil } from "lucide-react";
import { type Id, api } from "@repo/convex";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  LoadingScreen,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";

const validationSchema = Yup.object().shape({
  tagsAsString: Yup.string().required("Tags are required"),
});

interface TagsFormValues {
  tagsAsString: string;
}

export function EditableAdventureLogTags({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) {
  const { id } = useParams();
  const { toast } = useToast();
  const currentAdventureLogTags = useQuery(
    api.adventureLogTags.findAllByAdventureLogId,
    {
      adventureLogId: id as Id<"adventureLogs">,
    }
  );
  const isLoading = currentAdventureLogTags === undefined;
  const currentAdventureLogTagsAsString = currentAdventureLogTags
    ?.map((tag) => tag?.name)
    .join(", ");

  const updateAdventureLogTags = useMutation(
    api.adventureLogTags.updateByAdventureLogId
  );
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: TagsFormValues) {
    setIsSaving(true);
    try {
      await updateAdventureLogTags({
        adventureLogId: id as Id<"adventureLogs">,
        tagsAsString: values.tagsAsString,
      });
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
      }}
    >
      <DialogTrigger>
        <Text className="group w-full font-bold tracking-wider uppercase text-xs text-muted-foreground pt-1 cursor-pointer hover:underline ">
          {currentAdventureLogTags.map(
            (tag, index) =>
              `${tag?.name}${
                index + 1 < currentAdventureLogTags.length ? ", " : ""
              }`
          )}
          <Pencil className="hidden w-3 h-3 group-hover:inline-block ml-1 -mt-1" />
        </Text>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            Add some tags to help categorize your adventure.
          </DialogTitle>
          <Formik<TagsFormValues>
            initialValues={{
              tagsAsString: currentAdventureLogTagsAsString ?? "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <Field name="tagsAsString" className="pb-4">
                {({ meta, field }: FieldProps) => (
                  <>
                    <Input {...field} />
                    {meta.touched && meta.error ? (
                      <Text className="text-destructive">{meta.error}</Text>
                    ) : null}
                  </>
                )}
              </Field>

              <Button type="submit" className="w-full mt-4">
                Save
              </Button>
            </Form>
          </Formik>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
