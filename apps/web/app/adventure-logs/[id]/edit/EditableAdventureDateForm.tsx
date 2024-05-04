"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LoadingScreen,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { formatDate } from "@repo/utils";

const validationSchema = Yup.object().shape({
  adventureStartDate: Yup.string().required("Date is reuquired"),
});

interface AdventureDateFormValues {
  adventureStartDate: string;
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
          {adventureLog.adventureStartDate
            ? formatDate(adventureLog.adventureStartDate)
            : null}
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
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <Field name="adventureStartDate" className="pb-4">
                {({ meta, field, form }: FieldProps) => (
                  <>
                    <DatePicker
                      dateAsISOString={field.value as string}
                      setDate={(v) =>
                        form.setFieldValue("adventureStartDate", v)
                      }
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
