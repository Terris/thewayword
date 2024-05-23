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
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  LoadingScreen,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import {
  type LocationInputValue,
  LocationSearchInput,
} from "../../../_components/LocationSearchInput";

const validationSchema = Yup.object().shape({
  location: Yup.object()
    .shape({
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
      name: Yup.string().required(),
      fullAddress: Yup.string(),
    })
    .required("Location is required"),
});

interface EditableLocationFormValues {
  location: LocationInputValue;
}

export function EditableLocationForm({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) {
  const { id } = useParams();
  const { toast } = useToast();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findByIdAsOwner, queryArgs);
  const isLoading = adventureLog === undefined;
  const updateAdventureLog = useMutation(api.adventureLogs.update);
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: EditableLocationFormValues) {
    setIsSaving(true);
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        location: {
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
          name: values.location.name,
          fullAddress: values.location.fullAddress,
        },
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
        <Text className="group w-full font-bold tracking-wider uppercase text-xs text-neutral-400 pt-1 cursor-pointer hover:underline ">
          {adventureLog.location?.name ? adventureLog.location.name : null}
          <Pencil className="hidden w-3 h-3 group-hover:inline-block ml-1 -mt-1" />
        </Text>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          onInteractOutside={(e) => {
            const hasPacContainer = e.composedPath().some((el: EventTarget) => {
              if ("classList" in el) {
                return Array.from((el as Element).classList).includes(
                  "pac-container"
                );
              }
              return false;
            });

            if (hasPacContainer) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="pb-4">Where did you go?</DialogTitle>
            <Formik<EditableLocationFormValues>
              initialValues={{
                location: {
                  latitude: adventureLog.location?.latitude?.toString() ?? "",
                  longitude: adventureLog.location?.longitude?.toString() ?? "",
                  name: adventureLog.location?.name ?? "",
                  fullAddress: adventureLog.location?.fullAddress ?? "",
                },
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                <Field name="location">
                  {({ form, meta }: FieldProps) => (
                    <>
                      <LocationSearchInput
                        onChange={(location) => {
                          void form.setFieldValue("location", location);
                        }}
                      />
                      {meta.touched && meta.error ? (
                        <Text className="text-destructive">{meta.error}</Text>
                      ) : null}
                    </>
                  )}
                </Field>
                <Button type="submit" className="relative w-full mt-4">
                  Save
                </Button>
              </Form>
            </Formik>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
