"use client";

import { useEffect, useState } from "react";
import { getUserData } from "@/utils/userService";

interface AfelIdProfileHeaderProps {
  jwt: string;
}

export default function AfelIdProfileHeader({ jwt }: AfelIdProfileHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(jwt);
        setUserData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data",
        );
        console.error("Error:", err);
      }
    };

    fetchUserData();
  }, [jwt]);

  // You can add a loading state here if needed
  if (error) {
    console.error("Error loading user data:", error);
  }

  return (
    <div className="w-3/4 md:w-1/4 h-20 relative overflow-hidden ">
      {userData && (
        <>
          <p className="text-3xl font-black text-center text-white">
            {userData.discordName || "Loading..."}
          </p>
          <p className="text-lg md:text-2xl font-black text-center text-white"></p>
        </>
      )}
      {/* You might want to add a loading spinner here */}
    </div>
  );
}
