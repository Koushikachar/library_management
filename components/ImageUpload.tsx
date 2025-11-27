"use client";

import { IKImage, IKContext, IKUpload } from "imagekitio-react";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef<any>(null);
  const [file, setFile] = useState<{ filePath: string; fileId: string } | null>(
    null
  );
  const [uploading, setUploading] = useState(false);

  const onError = (error: any) => {
    console.error("Upload error:", error);
    setUploading(false);
    toast({
      title: "Image upload failed",
      description: "Your image could not be uploaded. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    console.log("Upload success:", res);
    setFile(res);
    setUploading(false);
    onFileChange(res.filePath);
    toast({
      title: "Image uploaded successfully",
      description: `${res.name} uploaded successfully`,
    });
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            ikUploadRef.current?.click();
          }
        }}
        className="flex flex-col items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
      >
        <Image
          src="/icons/upload.svg"
          alt="Upload"
          width={40}
          height={40}
          className="object-contain"
        />
        <p className="mt-2 text-sm text-gray-600">
          {uploading ? "Uploading..." : "Upload a File"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Click to browse files</p>
      </div>

      {file && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium mb-2">Uploaded Image:</p>
          <IKImage
            path={file.filePath}
            alt="Uploaded image"
            width={500}
            height={300}
            transformation={[{ width: 300, height: 200 }]}
            className="rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2 break-all">
            {file.filePath}
          </p>
        </div>
      )}

      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        fileName="upload.png"
        useUniqueFileName={true}
        validateFile={(file: any) => {
          const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
          ];
          if (!validTypes.includes(file.type)) {
            toast({
              title: "Invalid file type",
              description:
                "Please upload an image file (JPEG, PNG, GIF, or WebP)",
              variant: "destructive",
            });
            return false;
          }

          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            toast({
              title: "File too large",
              description: "Please upload an image smaller than 10MB",
              variant: "destructive",
            });
            return false;
          }

          return true;
        }}
      />
    </IKContext>
  );
};

export default ImageUpload;
