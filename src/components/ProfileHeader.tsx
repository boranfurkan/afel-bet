import Image from "next/image";
import defaultProfileImage from "/public/images/lizard-1.png";

interface ProfileHeaderProps {
  username?: string;
  profileImage?: string;
}

export default function ProfileHeader({
  username = "@username_xyz",
  profileImage,
}: ProfileHeaderProps) {
  return (
    <div className="flex justify-start items-center gap-3 md:gap-6 font-sans">
      {/* Profile Image Container */}
      <div className="flex justify-start items-center w-[72px] h-[72px] md:w-[104px] md:h-[104px] p-0.5 rounded-lg md:rounded-[10px] bg-black">
        <Image
          src={profileImage || defaultProfileImage}
          alt="Profile Image"
          height={104}
          width={104}
          className="w-full h-full rounded-lg"
          onError={(e) => {
            // Fallback to default image if loading fails
            const target = e.target as HTMLImageElement;
            target.src = defaultProfileImage.src;
          }}
        />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col justify-center items-start gap-3">
        <div className="flex flex-col justify-start items-start gap-3">
          <p className="text-base md:text-2xl font-black text-center text-white">
            {username}
          </p>
          {/* Wallet address section commented out */}
          {/* <p className="opacity-60 text-sm font-bold text-center text-white">
            {walletAddress}
          </p> */}
        </div>
      </div>
    </div>
  );
}
