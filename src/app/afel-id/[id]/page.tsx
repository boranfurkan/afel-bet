import { ProfileClaim } from "@/components/profile/ProfileClaim";
import { ProfileNFTs } from "@/components/profile/ProfileNFTs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AfelIdConnectedPage() {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");

  if (!jwt) {
    redirect("/afel-id");
  }

  return (
    <div id="stake-section" className="w-full min-h-screen bg-[#1C1C1C] py-20">
      <div className="mx-auto px-4 md:px-[15vw]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-5 h-full">
            <div className="h-full">
              <ProfileClaim />
            </div>
          </div>
        </div>
        <ProfileNFTs />
      </div>
    </div>
  );
}
