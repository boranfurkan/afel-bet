"use client";

import { useEffect } from "react";
import StakeContent from "@/components/stake/StakeContent";
import StakeList from "@/components/stake/StakeList";

export default function StakePage() {
  useEffect(() => {
    const fromAfelId = sessionStorage.getItem("fromAfelId");

    if (fromAfelId === "true") {
      const stakeSection = document.getElementById("stake-section");
      stakeSection?.scrollIntoView({ behavior: "smooth" });
      // Flag'i temizle
      sessionStorage.removeItem("fromAfelId");
    }
  }, []);

  return (
    <div>
      <StakeContent />
      <StakeList />
    </div>
  );
}
