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
  Checkbox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  LoadingScreen,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { formatDate } from "@repo/utils";

const validationSchema = Yup.object().shape({
  adventureStartDate: Yup.string().required("Date is required"),
  multiday: Yup.boolean(),
  adventureEndDate: Yup.string(),
});

interface AdventureDateFormValues {
  adventureStartDate: string;
  multiday?: boolean;
  adventureEndDate?: string;
}

export function EditableAdventureDateForm({
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

  async function onSubmit(values: AdventureDateFormValues) {
    setIsSaving(true);
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        adventureStartDate: values.adventureStartDate,
        adventureEndDate:
          values.multiday === true ? values.adventureEndDate : "",
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
        <Text className="group w-full font-bold tracking-wider uppercase text-xs text-neutral-400 pt-1 cursor-pointer hover:text-amber-400">
          {adventureLog.adventureStartDate
            ? formatDate(adventureLog.adventureStartDate)
            : null}
          {adventureLog.adventureEndDate
            ? `-${formatDate(adventureLog.adventureEndDate)}`
            : null}
          <Pencil className="hidden w-3 h-3 group-hover:inline-block ml-1 -mt-1" />
        </Text>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            When did you go on your adventure?
          </DialogTitle>
          <Formik<AdventureDateFormValues>
            initialValues={{
              adventureStartDate:
                adventureLog.adventureStartDate ?? new Date().toISOString(),
              multiday: Boolean(adventureLog.adventureEndDate),
              adventureEndDate:
                adventureLog.adventureEndDate ?? new Date().toISOString(),
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => {
              return (
                <Form>
                  <div className="pb-4">
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
                  </div>
                  <div className="pb-4">
                    <Field name="multiday">
                      {({ field, form }: FieldProps) => (
                        <div className="flex flex-row items-center">
                          <Checkbox
                            value="multiday"
                            id="multiday"
                            checked={field.value as boolean}
                            onCheckedChange={(v) =>
                              form.setFieldValue("multiday", v)
                            }
                            className="mr-2"
                          />
                          <Label htmlFor="multiday">Multiday adventure?</Label>
                        </div>
                      )}
                    </Field>
                  </div>
                  {values.multiday ? (
                    <div className="pb-4">
                      <Field name="adventureEndDate" className="pb-4">
                        {({ meta, field, form }: FieldProps) => (
                          <>
                            <DatePicker
                              placeholder="Pick an adventure end date"
                              dateAsISOString={field.value as string}
                              setDate={(v) =>
                                form.setFieldValue("adventureEndDate", v)
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
                    </div>
                  ) : null}

                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
