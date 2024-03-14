"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useMutation } from "convex/react";
import mapboxgl from "mapbox-gl";
import { type Id, api } from "@repo/convex";
import { useGeoLocation } from "@repo/hooks";
import { Input, Text, Button } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { cn } from "@repo/utils";
import { UploadFileButton } from "../../_components/UploadFileButton";
import { ImageBlock } from "../../_components/ImageBlock";
import {
  type LocationInputValue,
  LocationSearchInput,
} from "../../_components/LocationSearchInput";
import "mapbox-gl/dist/mapbox-gl.css";
import { AdventureLogMap } from "../../_components/AdventureLogMap";

// eslint-disable-next-line -- fix
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

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
  coverImageFileId: Yup.string().required("Showcase image is required"),
  tagsAsString: Yup.string().required("At least one tag is required"),
});

interface CreateAdventureLogFormValues {
  location: LocationInputValue;
  coverImageFileId?: string;
  tagsAsString: string;
}

export default function CreatePage() {
  const router = useRouter();
  const { geo } = useGeoLocation();
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
        coverImageFileId: values.coverImageFileId as Id<"files">,
        tagsAsString: values.tagsAsString,
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
        coverImageFileId: "",
        tagsAsString: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, submitForm }) => (
        <Form>
          <div className="absolute top-0 left-0 right-0 bg-background">
            <div className="q-full p-8 flex flex-row ">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.push("/feed");
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="w-full p-8 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/2">
                <div className="max-w-[600px] mx-auto">
                  <Text className="text-4xl font-black italic pb-16 text-center">
                    Log an Adventure!
                  </Text>

                  {currentStep === 0 ? (
                    <>
                      <Text className="font-soleil pb-2">
                        Start by searching for your adventure location.
                      </Text>
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
                              <Text className="text-destructive">
                                {meta.error}
                              </Text>
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

                      <Field name="showcaseFileId">
                        {({ form, meta }: FieldProps) => (
                          <>
                            {values.coverImageFileId ? (
                              <ImageBlock
                                fileId={values.coverImageFileId as Id<"files">}
                                className="mb-4"
                              />
                            ) : null}
                            <UploadFileButton
                              onSuccess={(fileIds) => {
                                void form.setFieldValue(
                                  "coverImageFileId",
                                  fileIds[0]
                                );
                              }}
                              variant="outline"
                              className={cn(
                                "w-full border border-dashed",
                                values.coverImageFileId ? "" : "p-16"
                              )}
                            >
                              {values.coverImageFileId
                                ? "Select a different image"
                                : "Select showcase image"}
                            </UploadFileButton>
                            {meta.touched && meta.error ? (
                              <Text className="text-destructive">
                                {meta.error}
                              </Text>
                            ) : null}
                          </>
                        )}
                      </Field>
                    </>
                  ) : null}

                  {currentStep === 2 ? (
                    <>
                      <Text className="font-soleil pb-2">
                        Add some tags to help categorize your adventure.
                      </Text>
                      <Field name="tagsAsString">
                        {({ meta, field }: FieldProps) => (
                          <>
                            <Input
                              placeholder="Backpacking, Hiking, Camping..."
                              {...field}
                            />
                            {meta.touched && meta.error ? (
                              <Text className="text-destructive">
                                {meta.error}
                              </Text>
                            ) : null}
                          </>
                        )}
                      </Field>
                    </>
                  ) : null}

                  {currentStep === 2 ? (
                    <div className="flex flex-row items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full mt-8"
                        onClick={() => submitForm()}
                      >
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        className="w-full mt-8"
                        onClick={() => submitForm()}
                      >
                        Publish Now
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={currentStep === 0}
                        className="w-full mt-8"
                        onClick={() => {
                          setCurrentStep((s) => s - 1);
                        }}
                      >
                        Back
                      </Button>
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
                    </div>
                  )}
                  <div className=" my-16 flex flex-row items-center justify-center gap-4">
                    <div
                      className={cn(
                        "w-[12px] h-[12px] rounded-full border border-dashed",
                        currentStep >= 0
                          ? "border-foreground bg-foreground"
                          : "bg-transparent"
                      )}
                    />
                    <div
                      className={cn(
                        "w-[12px] h-[12px] rounded-full border border-dashed",
                        currentStep >= 1
                          ? "border-foreground bg-foreground"
                          : "bg-transparent"
                      )}
                    />
                    <div
                      className={cn(
                        "w-[12px] h-[12px] rounded-full border border-dashed",
                        currentStep === 2
                          ? "border-foreground bg-foreground"
                          : "bg-transparent"
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-[75vh] rounded border border-dashed p-2">
                <AdventureLogMap
                  defaultLongitude={-105.628997}
                  defaultLatitude={40.342441}
                  initialLongitude={geo?.coords.longitude}
                  initialLatitude={geo?.coords.latitude}
                  featureLongitude={Number(values.location.longitude)}
                  featureLatitude={Number(values.location.latitude)}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
