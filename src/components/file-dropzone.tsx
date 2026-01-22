
"use client";

import { cn } from "@/lib/utils";
import { FileIcon, Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  label: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  accept?: Record<string, string[]>;
  required?: boolean;
}

export function FileDropzone({
  label,
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = { "text/csv": [".csv"] },
  required = false,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary/10 p-2 rounded">
            <FileIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileRemove();
          }}
          className="p-1 hover:bg-muted rounded-full"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-muted p-3 rounded-full mb-1">
        <Upload className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          CSV 파일을 드래그하거나 클릭하여 업로드하세요.
        </p>
      </div>
    </div>
  );
}
