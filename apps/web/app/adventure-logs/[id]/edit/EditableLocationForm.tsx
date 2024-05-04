"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
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
      mapboxId: Yup.string().required(),
      type: Yup.string().required(),
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
      name: Yup.string().required(),
      fullAddress: Yup.string(),
      poiCategories: Yup.array(Yup.string().required()),
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
          mapboxId: values.location.mapboxId,
          type: values.location.type,
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
          name: values.location.name,
          fullAddress: values.location.fullAddress,
          poiCategories: values.location.poiCategories,
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
        <Text className="w-full font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pt-1 cursor-pointer hover:underline ">
          {adventureLog.location?.name ? adventureLog.location.name : null}
        </Text>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Where did you go?</DialogTitle>
          <Formik<EditableLocationFormValues>
            initialValues={{
              location: {
                mapboxId: adventureLog.location?.mapboxId ?? "",
                type: adventureLog.location?.type ?? "",
                latitude: adventureLog.location?.latitude?.toString() ?? "",
                longitude: adventureLog.location?.longitude?.toString() ?? "",
                name: adventureLog.location?.name ?? "",
                fullAddress: adventureLog.location?.fullAddress ?? "",
                poiCategories: adventureLog.location?.poiCategories ?? [],
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
                      searchToken="add-adventure-log-location-search"
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
