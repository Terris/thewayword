import { type Doc, api } from "@repo/convex";
import { useMutation } from "convex/react";
import { type FieldProps, Field, Form, Formik } from "formik";
import { Button, Text, Textarea } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  message: Yup.string().required("Message is required"),
});

interface EditCommentFormValues {
  message: string;
}

interface CommentWithUser extends Doc<"comments"> {
  user: Pick<Doc<"users">, "name" | "avatarUrl">;
}

interface CommentProps {
  comment: CommentWithUser;
  onSuccess?: () => void;
}

export function EditCommentForm({ comment, onSuccess }: CommentProps) {
  const { toast } = useToast();
  const updateComment = useMutation(api.comments.updateByIdAsOwner);

  async function onSubmit(values: EditCommentFormValues) {
    try {
      await updateComment({ id: comment._id, message: values.message });
      toast({
        title: "Success",
        description: "Your comment has been updated",
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<EditCommentFormValues>
      initialValues={{
        message: comment.message,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className=" flex flex-col gap-4">
          <Field name="message">
            {({ field, meta }: FieldProps) => (
              <div>
                <Textarea className="w-full min-h-40" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <div className="flex flex-row items-center gap-4">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                onSuccess?.();
              }}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!dirty || !isValid || isSubmitting}
              className="w-full"
              size="sm"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
