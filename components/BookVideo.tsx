"use client";
import React from "react";
import { IKVideo, IKContext } from "imagekitio-react";
import config from "@/lib/config";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <IKContext
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl" />
    </IKContext>
  );
};
export default BookVideo;
