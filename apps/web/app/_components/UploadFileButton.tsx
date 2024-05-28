import { useRef, useState, type ChangeEvent } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import type { VariantProps } from "class-variance-authority";
import { useMutation } from "convex/react";
import { type Id, api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { useToast } from "@repo/ui/hooks";
import { Loader, buttonVariants } from "@repo/ui";
import { cn } from "@repo/utils";

interface UploadFileButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
  multiple?: boolean;
  onSuccess?: (fileIds: Id<"files">[]) => void;
  setPreviewURL?: (url: string) => void;
  uniqueId?: string;
  disabled?: boolean;
}

export function UploadFileButton({
  variant,
  size,
  className,
  children,
  multiple,
  onSuccess,
  setPreviewURL,
  uniqueId,
  disabled,
}: UploadFileButtonProps) {
  const { toast } = useToast();
  const { me } = useMeContext();

  const [isUploading, setIsUploading] = useState(false);
  const keyPrefixRef = useRef("");

  const createFileRecords = useMutation(api.files.create);

  async function uploadFile(file: File) {
    const client = new S3Client({
      region: "us-east-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID!,
      }),
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${process.env.NEXT_PUBLIC_S3_FOLDER}/${
        keyPrefixRef.current
      }-${file.name.replace(/\s/g, "-")}`,
      Body: file,
    };

    const command = new PutObjectCommand(params);
    const data = await client.send(command);
    return data;
  }

  async function onSelectFiles(event: ChangeEvent<HTMLInputElement>) {
    if (!me) throw new Error("User must be logged in to upload a file.");
    if (!event.target.files) return;

    setIsUploading(true);
    keyPrefixRef.current = new Date().toISOString();
    const files = Array.from(event.target.files);

    if (event.target.files[0]) {
      setPreviewURL?.(URL.createObjectURL(event.target.files[0]));
    }

    try {
      await Promise.all(files.map((file) => uploadFile(file)));
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const url = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${
            process.env.NEXT_PUBLIC_S3_FOLDER
          }/${keyPrefixRef.current}-${file.name.replace(/\s/g, "-")}`;
          return {
            url,
            fileName: file.name.replace(/\s/g, "-"),
            mimeType: file.type,
            type: file.type.includes("image") ? "image" : "document",
            size: file.size,
            dimensions: await getImageDimensions(file),
            userId: me.id,
          };
        })
      );

      const fileIds = await createFileRecords({
        uploads: fileDetails,
      });

      if (!fileIds.length) return;
      onSuccess?.(fileIds);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Something went wrong trying to upload a file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <label
      htmlFor={`file-upload${uniqueId ? "-" + uniqueId : ""}`}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      <input
        type="file"
        onChange={onSelectFiles}
        id={`file-upload${uniqueId ? "-" + uniqueId : ""}`}
        className="hidden"
        multiple={multiple}
        accept="image/png, image/gif, image/jpeg"
        disabled={disabled}
      />
      {isUploading ? <Loader /> : children}
    </label>
  );
}

export interface ImageDimensions {
  width?: number;
  height?: number;
}

async function getImageDimensions(
  file: File
): Promise<ImageDimensions | undefined> {
  if (!file.type.includes("image")) return;
  const dimensions: ImageDimensions = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = URL.createObjectURL(file);
  });
  return dimensions;
}
