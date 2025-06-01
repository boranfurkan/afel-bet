"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { DiscordLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState, useCallback } from "react";
import { initiateXAuth, initiateMatricaAuth } from "@/utils/authService";
import { getUserData, type UserData } from "@/utils/userService";
import matricaIcon from "/public/icons/matrica-icon.svg";
import Image from "next/image";

interface SocialData {
  discordName: string | null;
  xName: string | null;
  matricaName: string | null;
}

interface SocialsSectionProps {
  jwt: string;
}

export default function SocialsSection({ jwt }: SocialsSectionProps) {
  const router = useRouter();
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData: UserData = await getUserData(jwt);
      setSocialData({
        discordName: userData.discordName,
        xName: userData.xName,
        matricaName: userData.matricaName,
      });
    } catch (err) {
      console.error("Error in fetchUserData:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleConnectX = async () => {
    try {
      await initiateXAuth(jwt);
    } catch (err) {
      console.error("Error connecting X:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect X account"
      );
    }
  };
  const handleConnectMatrica = async () => {
    try {
      await initiateMatricaAuth(jwt);
    } catch (err) {
      console.error("Error connecting Matrica:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect Matrica account"
      );
    }
  };

  const handleDiscordDisconnect = () => {
    // Remove JWT cookie
    Cookies.remove("jwt");
    // Redirect to /afel-id
    router.push("/afel-id");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-3/4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-3/4 relative gap-[15px] max-h-64 overflow-y-auto">
      <p className="self-stretch w-full text-center text-white">
        <span className="self-stretch w-full text-xl md:text-3xl font-black text-center text-white">
          SOCIALS
        </span>
        <br />
        <span className="self-stretch w-full text-xs md:text-base text-center text-white">
          (connect Discord account to get OG role)
        </span>
      </p>
      <div className="flex flex-col justify-start items-start self-stretch gap-2.5">
        {/* Matrica Section */}
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-between items-center self-stretch h-9 overflow-hidden px-5 py-[3px] rounded-[20px]">
            <div className="flex items-center gap-2">
              <Image
                width={25}
                height={25}
                src={matricaIcon}
                alt="matrica-ico"
              />
              <p className="text-sm md:text-base font-medium text-center text-white">
                {socialData?.matricaName || "not connected"}
              </p>
            </div>
            <button
              onClick={handleConnectMatrica}
              disabled={isLoading}
              className="flex justify-center items-center w-2/5 overflow-hidden px-2 py-0.5 rounded-[5px] border border-white hover:bg-white/10 transition-colors"
            >
              <p className="text-sm md:text-base text-center text-white">
                {socialData?.matricaName ? "reconnect" : "connect"}
              </p>
            </button>
          </div>
        </div>

        {/* Discord Section */}
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-between items-center self-stretch h-9 overflow-hidden px-5 py-[3px] rounded-[20px]">
            <div className="flex items-center gap-2">
              <DiscordLogo
                size={25}
                weight="regular"
                className="w-[25px] h-[25px] text-white"
              />
              <p className="text-sm md:text-base font-medium text-center text-white">
                {socialData?.discordName || "not connected"}
              </p>
            </div>
            <button
              onClick={
                socialData?.discordName ? handleDiscordDisconnect : undefined
              }
              disabled={isLoading}
              className="flex justify-center items-center w-2/5 overflow-hidden px-2 py-0.5 rounded-[5px] border border-white hover:bg-white/10 transition-colors"
            >
              <p className="text-sm md:text-base text-center text-white">
                {socialData?.discordName ? "disconnect" : "connect"}
              </p>
            </button>
          </div>
        </div>

        {/* X Section */}
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-between items-center self-stretch h-9 overflow-hidden px-5 py-[3px] rounded-[20px]">
            <div className="flex items-center gap-2">
              <XLogo
                size={25}
                weight="regular"
                className="w-[25px] h-[25px] text-white"
              />
              <p className="text-sm md:text-base font-medium text-center text-white">
                {socialData?.xName || "not connected"}
              </p>
            </div>
            <button
              onClick={handleConnectX}
              disabled={isLoading}
              className="flex justify-center items-center w-2/5 overflow-hidden px-2 py-0.5 rounded-[5px] border border-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <p className="text-sm md:text-base text-center text-white">
                {socialData?.xName ? "reconnect" : "connect"}
              </p>
            </button>
          </div>
        </div>
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
}
