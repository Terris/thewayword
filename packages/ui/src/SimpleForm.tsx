"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  type FieldInputProps,
  type FormikValues,
  Form,
  Formik,
  useField,
} from "formik";
import { cn } from "@repo/utils";
import { Alert, AlertDescription, AlertTitle } from "./Alert";
import { Button } from "./Button";
import { Label } from "./Label";
import { Input } from "./Input";
import { Switch } from "./Switch";
import { Text } from "./Text";
import { Loader } from "./Loader";

export interface SimpleFormConfig<CustomFormValues> {
  validationSchema: unknown;
  fields: SimpleFormField[];
  initialValues: CustomFormValues;
  onSubmit: (values: CustomFormValues) => Promise<void>;
  submitButtonLabel?: string;
}

export interface SimpleFormProps<CustomFormValues> {
  renderTrigger?: React.ReactNode;
  config: SimpleFormConfig<CustomFormValues>;
  onSuccess?: () => void;
}

export function SimpleForm<CustomFormValues extends FormikValues>({
  config,
  onSuccess,
}: SimpleFormProps<CustomFormValues>) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
    submitButtonLabel,
  } = config;

  const handleSubmit = async (values: CustomFormValues) => {
    setServerError(null);
    try {
      await onSubmit(values);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error submitting form.";
      setServerError(errorMessage);
    }
  };

  return (
    <Formik<CustomFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          {Boolean(serverError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops, something went wrong...</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            {fields.map((f) => (
              <SimpleFormField
                key={`form-field-${f.name}`}
                name={f.name}
                label={f.label}
                fieldtype={f.fieldtype}
                options={f.options}
              />
            ))}
          </div>
          <div className="flex flex-row items-center justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="mr-2" /> : null}
              {submitButtonLabel ?? "Save"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export type SimpleFieldtype =
  | "text"
  | "textarea"
  | "switch"
  | "number"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect";

export interface SimpleFormFieldOption {
  label: string;
  value: string;
}
export interface SimpleFormField {
  name: string;
  label?: string;
  fieldtype?: SimpleFieldtype;
  options?: SimpleFormFieldOption[];
}

type SimpleFormFieldProps = Pick<
  SimpleFormField,
  "name" | "label" | "fieldtype" | "options"
>;

export function SimpleFormField({
  name,
  label,
  fieldtype = "text",
  options,
}: SimpleFormFieldProps) {
  const [field, meta, helpers] = useField(name);

  function renderFieldType() {
    switch (fieldtype) {
      case "multiselect":
        return (
          <MultiSelectInput
            options={options}
            // eslint-disable-next-line -- Temporarily avoids the lint error problem. Not sure wtf.
            value={field.value}
            setValue={helpers.setValue}
          />
        );
      case "switch":
        return (
          <SwitchInput
            name={field.name}
            // eslint-disable-next-line -- Temporarily avoids the lint error problem. Not sure wtf.
            value={field.value}
            setValue={helpers.setValue}
            className="mt-2"
          />
        );
      case "textarea":
      case "number":
      case "checkbox":
      case "radio":
      case "select":
      default:
        return (
          <TextInput touched={meta.touched} error={meta.error} field={field} />
        );
    }
  }

  return (
    <FieldWrapper>
      <FieldLabel name={name} label={label} />
      <div className="col-span-3">
        {renderFieldType()}
        <FieldError touched={meta.touched} error={meta.error} />
      </div>
    </FieldWrapper>
  );
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 items-start gap-4">{children}</div>;
}

function FieldLabel({ name, label }: { name: string; label?: string }) {
  return (
    <Label htmlFor={name} className="text-right pt-3">
      {label ?? name}
    </Label>
  );
}

function TextInput({
  touched,
  error,
  field,
}: {
  touched: boolean;
  error?: string;
  // eslint-disable-next-line -- Temporarily avoids the lint error problem. Not sure wtf.
  field: FieldInputProps<any>;
}) {
  return (
    <Input
      className={touched && error ? "border-destructive" : ""}
      {...field}
    />
  );
}

function SwitchInput({
  name,
  value,
  setValue,
  className,
}: {
  name: string;
  value: boolean;
  setValue: (v: boolean) => void;
  className?: string;
}) {
  return (
    <Switch
      id={name}
      checked={value}
      onCheckedChange={setValue}
      className={className}
    />
  );
}

function MultiSelectInput({
  options,
  value,
  setValue,
}: {
  options: SimpleFormField["options"];
  value: string[];
  setValue: (v: string[]) => void;
}) {
  const handleSetValue = (selected: boolean, optionValue: string) => {
    if (selected) {
      setValue([...value, optionValue]);
    } else {
      setValue(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="rounded border px-4 max-h-52 overflow-hidden overflow-y-auto">
      {options?.map((option, index) => {
        return (
          <div
            className={cn(
              "grid grid-cols-4 py-2 items-center gap-4",
              index < options.length - 1 ? "border-b" : ""
            )}
            key={option.value}
          >
            <div className="col-span-3">
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
            <div className="col-span-1 flex justify-end">
              <SwitchInput
                name={option.value}
                value={value.includes(option.value)}
                setValue={(v) => {
                  handleSetValue(v, option.value);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ touched, error }: { touched: boolean; error?: string }) {
  return touched && error ? (
    <Text className="text-destructive" size="sm">
      {error}
    </Text>
  ) : null;
}
