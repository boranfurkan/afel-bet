"use client";

import { useEffect, useState } from "react";
import { getRoles } from "@/utils/holdingsService";

interface RolesSectionProps {
  jwt: string;
}

interface RolesData {
  totalOgSpot: number;
  ogTokenRequirement: number;
  wlTokenRequirement: number;
  maxOgPerAccount: number;
  totalOg: number;
  remainingOgSpots: number;
  totalWl: number;
}

export default function RolesSectionComponent({ jwt }: RolesSectionProps) {
  const [rolesData, setRolesData] = useState<RolesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        // console.log("here is jwt ", jwt);
        setIsLoading(true);
        setError(null);
        const data = await getRoles(jwt);
        setRolesData(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch roles");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, [jwt]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-3/4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-3/4 relative gap-[15px] max-h-64 overflow-y-auto">
      <span className="self-stretch w-full text-xl md:text-3xl font-black text-center text-white">
        ROLES
      </span>
      <div className="flex flex-col justify-start items-start self-stretch gap-2.5">
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-start items-center self-stretch h-9 relative overflow-hidden gap-2.5 px-5 py-[3px] rounded-[20px]">
            <p className="text-sm md:text-base font-medium text-center text-white">
              remaining OG spots: {rolesData?.remainingOgSpots || 0}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-start items-center self-stretch h-9 relative overflow-hidden gap-2.5 px-5 py-[3px] rounded-[20px]">
            <p className="text-sm md:text-base font-medium text-center text-white">
              your OGs: {rolesData?.totalOg || 0}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]">
          <div className="flex justify-start items-center self-stretch h-9 relative overflow-hidden gap-2.5 px-5 py-[3px] rounded-[20px]">
            <p className="text-sm md:text-base font-medium text-center text-white">
              your WLs: {rolesData?.totalWl || 0}
            </p>
          </div>
        </div>
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
}
