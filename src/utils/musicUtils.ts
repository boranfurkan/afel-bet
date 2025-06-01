import { Song } from "@/types/music";

export const parseSongFileName = (fileName: string): Song | null => {
  const match = fileName.match(/^(\d+)_(.+)_-_(.+)\.mp3$/);
  if (!match) return null;

  return {
    id: parseInt(match[1]),
    artist: match[2].replace(/_/g, " "),
    title: match[3].replace(/_/g, " "),
    file: fileName,
  };
};

export const songs: Song[] = [
  "1_Astrix_-_Deep_Jungle_Walk.mp3",
  "2_Daft_Punk_-_Around_the_World.mp3",
  "3_Kanye_West_-_Bound_2.mp3",
  "4_Kanye_West_-_Runaway.mp3",
  "5_Empire_Of_The_Sun_-_Walking_On_A_Dream.mp3",
  "6_Lupe_Fiasco_-_Superstar.mp3",
  "7_The_Blaze_-_Eyes.mp3",
  "8_The_Blaze_-_RUNAWAY.mp3",
].map((fileName) => parseSongFileName(fileName)!);
