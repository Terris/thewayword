"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useMutation } from "convex/react";
import * as Yup from "yup";
import { type Id, api } from "@repo/convex";
import { useToast } from "@repo/ui/hooks";
import { Button, Text } from "@repo/ui";
import { UploadFileButton } from "../../_components/UploadFileButton";
import { ImageBlock } from "../../_components/ImageBlock";
import {
  type LocationInputValue,
  LocationSearchInput,
} from "../../_components/LocationSearchInput";

const validationSchema = Yup.object().shape({
  location: Yup.object()
    .shape({
      mapboxId: Yup.string().required(),
      type: Yup.string().required(),
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
      name: Yup.string().required(),
      fullAddress: Yup.string().required(),
      poiCategories: Yup.array(Yup.string().required()),
    })
    .required("Location is required"),
  showcaseFileId: Yup.string().required("Showcase image is required"),
});

interface CreateAdventureLogFormValues {
  location: LocationInputValue;
  showcaseFileId?: string;
}

export function CreateLogForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const createLog = useMutation(api.adventureLogs.create);

  async function onSubmit(values: CreateAdventureLogFormValues) {
    try {
      const newAdventureLogId = await createLog({
        location: {
          mapboxId: values.location.mapboxId,
          type: values.location.type,
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
          name: values.location.name,
          full_address: values.location.fullAddress,
          poiCategories: values.location.poiCategories,
        },
        showcaseFileId: values.showcaseFileId as Id<"files">,
      });
      toast({
        duration: 5000,
        title: "Success",
        description: "Adventure log saved as draft!",
      });
      router.push(`/adventure-logs/${newAdventureLogId}/edit/`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<CreateAdventureLogFormValues>
      initialValues={{
        location: {
          mapboxId: "",
          type: "",
          latitude: "",
          longitude: "",
          name: "",
          fullAddress: "",
          poiCategories: [""],
        },
        showcaseFileId: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, submitForm }) => {
        return (
          <Form>
            {currentStep === 0 ? (
              <>
                <Text className="font-soleil pb-2">
                  Start by searching for your adventure location.
                </Text>
                <Field name="email">
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
              </>
            ) : null}
            {currentStep === 1 ? (
              <>
                <Text className="font-soleil pb-2">
                  Add a showcase photo or image.
                </Text>

                <Field name="email">
                  {({ form, meta }: FieldProps) => (
                    <>
                      {values.showcaseFileId ? (
                        <ImageBlock
                          fileId={values.showcaseFileId as Id<"files">}
                          className="mb-4"
                        />
                      ) : null}
                      <UploadFileButton
                        onSuccess={(fileIds) => {
                          void form.setFieldValue("showcaseFileId", fileIds[0]);
                        }}
                      >
                        Select showcase image
                      </UploadFileButton>
                      {meta.touched && meta.error ? (
                        <Text className="text-destructive">{meta.error}</Text>
                      ) : null}
                    </>
                  )}
                </Field>
              </>
            ) : null}
            {currentStep === 2 ? (
              <Text className="font-soleil pb-2">
                Almost there! You can save your adventure log as a draft now.
              </Text>
            ) : null}

            {currentStep === 2 ? (
              <Button
                type="button"
                disabled={isSubmitting}
                className="w-full mt-8"
                onClick={() => submitForm()}
              >
                Save Draft
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!values.location.name}
                className="w-full mt-8"
                onClick={() => {
                  setCurrentStep((s) => s + 1);
                }}
              >
                Next
              </Button>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
