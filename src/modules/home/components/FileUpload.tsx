import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export const FileUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: fetchPresignedUrl, isLoading } =
    api.document.getS3UploadPresignedUrl.useMutation();
  const { mutateAsync: createChat } = api.chat.createChat.useMutation();
  const { mutateAsync: loadFromS3ToPinecone } =
    api.document.loadFromS3ToPinecone.useMutation();
  const documentAPI = api.useContext().document;

  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 25 * 2 ** 20,
    onDropAccepted: (acceptedFiles) => {
      const file = acceptedFiles[0] as File;
      const fileKey = Date.now().toString() + "_" + file.name;

      fetchPresignedUrl({
        key: fileKey,
      })
        .then((url) => {
          setIsUploading(true);
          setPresignedUrl(url);
          setFileKey(fileKey);
          setFile(file);
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
    if (file !== null && presignedUrl !== null && fileKey !== null) {
      setIsUploading(true);

      void (async () => {
        try {
          await axios.put(presignedUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
          });

          const downloadUrl = await documentAPI.getS3ObjectPresignedUrl.fetch({
            key: fileKey,
          });

          await loadFromS3ToPinecone({
            fileKey,
            presignedDownloadUrl: downloadUrl,
          });

          // TODO: redirect to chat page once chats is finished
          await createChat({
            docName: file.name,
            docKey: fileKey,
            docType: "pdf",
          });

          toast({
            title: "Document uploaded successfully!",
            variant: "success",
          });
        } catch (err) {
          toast({
            variant: "destructive",
            title: "Failed to upload your document.",
          });
        } finally {
          setIsUploading(false);
          setPresignedUrl(null);
          setFileKey(null);
          setFile(null);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignedUrl, file, fileKey]);

  return (
    <div className="rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center",
        })}
      >
        <input
          {...getInputProps({
            multiple: false,
            disabled: isLoading || isUploading,
          })}
        />
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
