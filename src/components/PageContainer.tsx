"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { StaticImageData } from "next/image";
import dynamic from "next/dynamic";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface PageContainerProps {
  title: string;
  content: string;
  media?: {
    type: "image" | "video" | "lottie";
    src: string | StaticImageData | unknown;
    alt?: string;
  };
}

export default function PageContainer({
  title,
  content,
  media,
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1000px] mx-auto relative flex flex-col gap-4 px-4 md:px-8 pt-6 md:pt-8 rounded-md bg-[#181818]/80 border border-white/30 font-sans backdrop-blur-lg pb-4"
    >
      <p className="text-2xl md:text-[32px] font-black text-white">{title}</p>
      <p className="text-lg md:text-xl text-white">{content}</p>
      {media && (
        <div className="flex justify-center items-center w-full max-w-[570px] mx-auto h-full gap-2 rounded-md overflow-hidden">
          {media.type === "image" && (
            <Image
              src={media.src as string | StaticImageData}
              alt={media.alt || title}
              width={320}
              height={320}
              className="object-cover w-[300px] h-full"
            />
          )}
          {media.type === "video" && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover "
            >
              <source src={media.src as string} type="video/mp4" />
            </video>
          )}
          {media.type === "lottie" && (
            <Lottie
              animationData={media.src as object}
              loop={true}
              className="w-full h-full"
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
