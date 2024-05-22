import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { type Doc, api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { Button, Text } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { EditCommentForm } from "./EditCommentForm";

interface CommentWithUser extends Doc<"comments"> {
  user: Pick<Doc<"users">, "_id" | "name" | "avatarUrl">;
}

interface CommentProps {
  comment: CommentWithUser;
}

export function EditableComment({ comment }: CommentProps) {
  const { me } = useMeContext();
  const meCanEdit = me?.id === comment.user._id;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const deleteComment = useMutation(api.comments.deleteByIdAsOwner);

  return (
    <div className="py-4 flex flex-row items-start gap-2">
      <div className="w-[30px]">
        {comment.user.avatarUrl ? (
          <Link
            href={`/user/${comment.user._id}`}
            className="hover:text-amber-400"
          >
            <Image
              src={comment.user.avatarUrl}
              width="20"
              height="20"
              alt="User"
              className="w-5 h-5 rounded-full mt-1"
            />
          </Link>
        ) : null}
      </div>
      <div className="w-full">
        <Text className="text-neutral-400 leading-tight">
          <Link
            href={`/user/${comment.user._id}`}
            className="hover:text-amber-400"
          >
            {comment.user.name}
          </Link>{" "}
          <br />
        </Text>
        <Text className="text-sm text-neutral-400 mb-4 leading-tight">
          {formatDateTime(comment._creationTime)}
        </Text>

        {meCanEdit && isEditing ? (
          <EditCommentForm
            comment={comment}
            onSuccess={() => {
              setIsEditing(false);
            }}
          />
        ) : (
          <Text className="w-full font-mono leading-relaxed text-sm">
            {comment.message}
          </Text>
        )}
      </div>
      <div>
        {meCanEdit ? (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditing(true);
              }}
              size="sm"
              className="text-neutral-400 hover:text-foreground"
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => deleteComment({ id: comment._id })}
              size="sm"
              className="text-neutral-400 hover:text-foreground"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
