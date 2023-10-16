import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

export const FileUpload: React.FC = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <div className="rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center",
        })}
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="h-10 w-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Insert File Here</p>
        </>
      </div>
    </div>
  );
};
