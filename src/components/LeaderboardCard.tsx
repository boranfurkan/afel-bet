import Image from "next/image";
import { LeaderboardUser } from "@/types/leaderboard";
import defaultProfileImage from "/public/images/lizard-1.png";
import { useState } from "react";

type LeaderboardCardProps = LeaderboardUser;

export default function LeaderboardCard({
  rank,
  username,
  posts,
  points,
  profile_image_url,
}: LeaderboardCardProps) {
  const [imgSrc, setImgSrc] = useState(profile_image_url);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(defaultProfileImage.src);
    }
  };

  return (
    <div className="flex justify-between items-center w-full pl-2 pr-1 md:px-5 py-1.5 md:py-3 rounded-lg bg-black/[0.24] backdrop-blur-[50px] font-sans">
      <div className="flex items-center gap-0.5 md:gap-3 w-[168px] md:w-[286.5px]">
        <p className="w-6 md:w-8 opacity-80 text-sm md:text-base font-semibold text-center text-white">
          {rank}
        </p>
        <div className="flex items-center gap-1">
          <Image
            src={imgSrc}
            alt={username}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
            onError={handleImageError}
            unoptimized
            priority={rank <= 10} // Prioritize loading for top 10 users
          />
          <p className="opacity-80 text-xs md:text-sm font-semibold text-white">
            {username}
          </p>
        </div>
      </div>
      <p className="w-12 md:w-20 text-xs md:text-sm font-bold text-center text-white">
        {posts}
      </p>
      <p className="w-12 md:w-20 text-xs md:text-sm font-bold text-center text-white">
        {points}
      </p>
    </div>
  );
}
