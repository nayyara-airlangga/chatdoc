import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export const FileUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const { mutateAsync: fetchPresignedUrl, isLoading } =
    api.document.getS3UploadPresignedUrl.useMutation();

  const { toast } = useToast();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 25 * 2 ** 20,
    onDropAccepted: (acceptedFiles) => {
      const file = acceptedFiles[0] as File;

      fetchPresignedUrl({
        key: Date.now().toString() + "_" + file.name,
      })
        .then((url) => {
          setIsUploading(true);
          setPresignedUrl(url);
        })
        .catch(() =>
          toast({
            variant: "destructive",
            title: "Failed to upload your document.",
          }),
        );
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]!;
      const err = rejection.errors[0]!;

      if (err.code === "file-too-large") {
        toast({
          variant: "destructive",
          title: "File can't be larger than 25 MBs",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to upload your document.",
        });
      }
    },
  });

  useEffect(() => {
    if (acceptedFiles.length > 0 && presignedUrl !== null) {
      setIsUploading(true);

      const file = acceptedFiles[0]!;

      axios
        .put(presignedUrl, file.slice(), {
          headers: {
            "Content-Type": file.type,
          },
        })
        .then(() => {
          setIsUploading(false);
          setPresignedUrl(null);
          toast({
            title: "Document uploaded successfully!",
          });
        })
        .catch(() => {
          setIsUploading(false);
          setPresignedUrl(null);
          toast({
            variant: "destructive",
            title: "Failed to upload your document.",
          });
        });
    }
  }, [presignedUrl, acceptedFiles, toast]);

  return (
    <div className="rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center",
        })}
      >
        <input disabled={isLoading || isUploading} {...getInputProps()} />
        <>
          {isLoading || isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          ) : (
            <Inbox className="h-10 w-10 text-blue-500" />
          )}
          <p className="mt-2 text-sm text-slate-400">
            {isLoading || isUploading ? "Uploading..." : "Insert File Here"}
          </p>
        </>
      </div>
    </div>
  );
};
