"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { Pencil, XIcon } from "lucide-react";
import { type Id, api } from "@repo/convex";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Loader,
  LoadingScreen,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import Image from "next/image";
import { useDebounce } from "@repo/hooks";

const validationSchema = Yup.object().shape({
  companionUserIds: Yup.array(Yup.string()),
});

interface CompanionsFormValues {
  companionUserIds: Id<"users">[];
}

export function EditableAdventureLogCompanions({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) {
  const { id } = useParams();
  const { toast } = useToast();
  const currentAdventureLogCompanions = useQuery(
    api.adventureLogCompanions.findAllByAdventureLogId,
    {
      adventureLogId: id as Id<"adventureLogs">,
    }
  );
  const isLoading = currentAdventureLogCompanions === undefined;

  const updateAdventureLog = useMutation(
    api.adventureLogCompanions.updateAdventureLogCompanionsAsOwner
  );
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: CompanionsFormValues) {
    setIsSaving(true);
    try {
      await updateAdventureLog({
        adventureLogId: id as Id<"adventureLogs">,
        companionUserIds: values.companionUserIds,
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
        <Text className="group w-full flex flex-row items-center font-bold tracking-wider uppercase text-xs text-neutral-400 pt-1 cursor-pointer hover:underline ">
          {currentAdventureLogCompanions.length > 0 ? (
            <>
              {currentAdventureLogCompanions.map((companion, index) => (
                <>
                  {companion.user.name}
                  {index < currentAdventureLogCompanions.length - 2
                    ? ", "
                    : null}
                  {currentAdventureLogCompanions.length > 1 &&
                  index === currentAdventureLogCompanions.length - 2
                    ? " & "
                    : null}
                </>
              ))}
            </>
          ) : (
            "Solo Adventure"
          )}
          <Pencil className="hidden w-3 h-3 group-hover:inline-block ml-1 -mt-1" />
        </Text>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            Who did you adventure with?
          </DialogTitle>
          <Formik<CompanionsFormValues>
            initialValues={{
              companionUserIds: currentAdventureLogCompanions.map(
                (companion) => companion.companionUserId
              ),
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form>
                <Field name="companionUserIds" className="pb-4">
                  {({ meta, form }: FieldProps) => (
                    <>
                      {values.companionUserIds.length > 0 ? (
                        <div className="pb-4 flex items-center flex-wrap gap-2">
                          {values.companionUserIds.map((companionUserId) => (
                            <SelectedCompanion
                              companionUserId={companionUserId}
                              onRemove={(userId) =>
                                form.setFieldValue(
                                  "companionUserIds",
                                  values.companionUserIds.filter(
                                    (id) => id !== userId
                                  )
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : null}
                      <UserSearchInput
                        onSelect={(userId) =>
                          form.setFieldValue("companionUserIds", [
                            ...values.companionUserIds,
                            userId,
                          ])
                        }
                        selectedCompanionUserIds={values.companionUserIds}
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
            )}
          </Formik>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function SelectedCompanion({
  companionUserId,
  onRemove,
}: {
  companionUserId: Id<"users">;
  onRemove?: (userId: Id<"users">) => void;
}) {
  const user = useQuery(api.users.sessionedFindPublicUserById, {
    id: companionUserId,
  });
  if (!user) return null;
  return (
    <div className="inline-flex flex-row items-center gap-2 pl-1 border rounded-md">
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          width="20"
          height="20"
          alt="User"
          className="w-5 h-5 rounded-full mr-2"
        />
      ) : null}
      {user.name}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onRemove?.(companionUserId)}
      >
        <XIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function UserSearchInput({
  onSelect,
  selectedCompanionUserIds,
}: {
  onSelect?: (userId: Id<"users">) => void;
  selectedCompanionUserIds: Id<"users">[];
}) {
  const [queryTerm, setQueryTerm] = useState("");
  const debouncedQueryTerm = useDebounce(queryTerm, 500);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const userSearchResults = useQuery(api.users.search, {
    queryTerm: debouncedQueryTerm,
  });
  const isLoading = userSearchResults === undefined;
  const filterdUserSearchResults = userSearchResults?.filter(
    (user) => !selectedCompanionUserIds.includes(user._id)
  );

  function handleSelect(userId: Id<"users">) {
    onSelect?.(userId);
    setIsOptionsOpen(false);
  }

  return (
    <div className="w-full relative">
      <Input
        value={queryTerm}
        onChange={(e) => setQueryTerm(e.currentTarget.value)}
        onFocus={() => setIsOptionsOpen(true)}
      />

      {isLoading ? <Loader className="absolute top-3 right-3" /> : null}

      {isOptionsOpen &&
      filterdUserSearchResults &&
      filterdUserSearchResults?.length > 0 ? (
        <div className="w-full absolute top-full z-50 border rounded-md p-1 bg-background shadow">
          {filterdUserSearchResults
            ?.map((user) =>
              user.name ? (
                <Button
                  type="button"
                  key={`select-item-${user._id}`}
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => handleSelect(user._id)}
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      width="20"
                      height="20"
                      alt="User"
                      className="w-5 h-5 rounded-full mr-2"
                    />
                  ) : null}
                  {user.name}
                </Button>
              ) : null
            )
            .filter((n) => n)}
        </div>
      ) : null}
    </div>
  );
}
