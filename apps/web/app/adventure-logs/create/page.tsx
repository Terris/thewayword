"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";
import { Input, Text, Button, DatePicker } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { cn } from "@repo/utils";
import { type LocationInputValue } from "../../_components/LocationSearchInput";
import { AdventureLogMap } from "../../_components/AdventureLogMap";
import { LocationSearchInput } from "../../_components/LocationSearchInput";

const validationSchema = Yup.object().shape({
  location: Yup.object()
    .shape({
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
      name: Yup.string().required(),
      fullAddress: Yup.string(),
    })
    .required("Location is required"),
  tagsAsString: Yup.string().required("At least one tag is required"),
  adventureStartDate: Yup.string().required("Date is required"),
  adventureEndDate: Yup.string(),
});

interface CreateAdventureLogFormValues {
  location: LocationInputValue;
  tagsAsString: string;
  adventureStartDate: string;
  adventureEndDate?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const createLog = useMutation(api.adventureLogs.create);

  async function onSubmit(values: CreateAdventureLogFormValues) {
    try {
      const newAdventureLogId = await createLog({
        location: {
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
          name: values.location.name,
          fullAddress: values.location.fullAddress,
        },
        tagsAsString: values.tagsAsString,
        adventureStartDate: values.adventureStartDate,
        adventureEndDate: values.adventureEndDate,
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
          latitude: "",
          longitude: "",
          name: "",
          fullAddress: "",
        },
        tagsAsString: "",
        adventureStartDate: new Date().toISOString(),
        adventureEndDate: "",
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
                  <Text className="text-4xl font-bold pb-16 text-center">
                    Log an Adventure!
                  </Text>
                  {currentStep === 0 ? (
                    <>
                      <Text className="font-bold pb-2">
                        Start by searching for your adventure location.
                      </Text>
                      <Field name="location">
                        {({ form, meta }: FieldProps) => (
                          <>
                            <LocationSearchInput
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
                      <Text className="font-bold pb-2">
                        When did you go on your adventure?
                      </Text>
                      <Field name="adventureStartDate">
                        {({ meta, field, form }: FieldProps) => (
                          <>
                            <DatePicker
                              dateAsISOString={field.value as string}
                              setDate={(v) =>
                                form.setFieldValue("adventureStartDate", v)
                              }
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
                    <>
                      <Text className="font-bold pb-2">
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
                    {currentStep === 2 ? (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        className="w-full mt-8"
                        onClick={() => submitForm()}
                      >
                        Next
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
                  </div>
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
                  adventureLogId="123456"
                  longitude={
                    values.location.longitude
                      ? Number(values.location.longitude)
                      : undefined
                  }
                  latitude={
                    values.location.latitude
                      ? Number(values.location.latitude)
                      : undefined
                  }
                  zoom={
                    values.location.longitude && values.location.latitude
                      ? 15
                      : undefined
                  }
                  markerTitle={values.location.name}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
