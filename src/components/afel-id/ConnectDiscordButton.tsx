"use client";

import { DiscordLogo } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { getOAuthSession, initiateDiscordAuth } from "@/utils/authService";

export default function ConnectDiscordButton() {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const handleDiscordAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get OAuth session
      const sessionData = await getOAuthSession();

      if (!sessionData.sessionId) {
        throw new Error("No session ID received");
      }

      // Redirect to Discord OAuth
      initiateDiscordAuth(sessionData.sessionId);
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <button
        onClick={handleDiscordAuth}
        disabled={isLoading}
        className="w-10/12 flex items-center justify-center gap-2 bg-[#5865F2] text-white px-6 py-3 rounded-lg hover:bg-[#4752C4] transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <span className="font-semibold text-sm md:text-xl">
              sign in with
            </span>
            <DiscordLogo
              size={24}
              weight="fill"
              className="w-6 h-6 md:w-8 md:h-8"
            />
          </>
        )}
      </button>
      {/* {error && <p className="text-red-500 mt-2 text-sm">{error}</p>} */}
    </div>
  );
}
