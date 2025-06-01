"use client";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { songs } from "@/utils/musicUtils";
import lizardFirst from "/public/images/lizard-1.png";
import Image from "next/image";
export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  const togglePlay = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `/musics/${currentSong.file}`;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentSong.file, isPlaying]);

  return (
    <div className="relative max-w-[120px] h-[150px]">
      {!isExpanded ? (
        // Collapsed state
        <div className="  flex flex-col justify-start items-center relative gap-3 px-4 py-2 rounded-lg overflow-hidden">
          {/* Lizard Image - Collapsed State */}
          <div className="flex flex-col justify-center items-center relative ">
            <p className="text-[10px] font-medium text-center text-white">
              please don&apos;t stop the
            </p>
            <p className="text-2xl font-black text-center text-white">MUSIC</p>
          </div>
          <button
            onClick={togglePlay}
            className="p-2 border border-white bg-white hover:bg-white/10 rounded-full"
          >
            <Play
              className="text-black fill-black"
              size={24}
              strokeWidth={2.25}
            />
          </button>
        </div>
      ) : (
        // Expanded state
        <div className=" flex flex-col justify-start items-center relative gap-3 px-4 py-2 rounded-lg overflow-hidden">
          {/* Lizard Image - Expanded State */}
          <div className="flex flex-col justify-center items-start flex-grow relative pt-1 overflow-hidden">
            <div className="w-full overflow-hidden">
              <p className="text-[14px] font-black text-white whitespace-nowrap animate-marquee">
                {currentSong.title}
              </p>
            </div>
            <p className="text-xs font-medium text-white">
              {currentSong.artist}
            </p>
          </div>
          <div className="flex justify-start items-center flex-shrink-0 relative gap-[3px] md:gap-1">
            <button
              onClick={playPrevious}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <SkipBack className="text-white" size={20} strokeWidth={2.25} />
            </button>
            <button
              onClick={togglePlay}
              className="p-2  border border-white bg-white hover:bg-white/10 rounded-full"
            >
              {isPlaying ? (
                <Pause
                  className="text-black fill-black"
                  size={24}
                  strokeWidth={2.25}
                />
              ) : (
                <Play
                  className="text-black fill-black"
                  size={24}
                  strokeWidth={2.25}
                />
              )}
            </button>
            <button
              onClick={playNext}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <SkipForward
                className="text-white"
                size={20}
                strokeWidth={2.25}
              />
            </button>
          </div>
        </div>
      )}
      <audio ref={audioRef} onEnded={playNext} />
    </div>
  );
}
