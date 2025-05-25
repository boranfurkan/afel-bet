import { ThumbsUp, MessageCircle, Share } from "lucide-react";

export default function RulesFirst() {
  const pointsData = [
    { points: "+2", Icon: ThumbsUp },
    { points: "+3", Icon: MessageCircle },
    { points: "+10", Icon: Share },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-start items-center self-stretch gap-4 md:gap-8 p-4 md:pl-8 md:pr-6 md:py-6 rounded-xl bg-[#181818]/50 border border-white/80 backdrop-blur-[32px]">
      <div className="flex flex-col justify-start items-start flex-grow relative gap-4">
        <p className="text-2xl md:text-[32px] font-black text-left uppercase text-white">
          COMMUNITY INTERACTION
        </p>
        <p className="text-sm text-left max-w-[346px]">
          <span className="font-medium text-[#eaecec]/80">
            Post on X tagging{" "}
          </span>
          <span className="font-bold text-white">@AfelNFT</span>
          <span className="font-medium text-[#eaecec]/80">
            , Earn points based on the likes, comments and retweets your post
            gets.{" "}
          </span>
        </p>
      </div>
      <div className="flex flex-row md:flex-col justify-start items-start gap-2 w-full md:w-[120px]">
        {pointsData.map(({ points, Icon }) => (
          <div
            key={points}
            className="flex-1 md:flex-none w-full flex justify-center items-center relative gap-2 px-6 py-3 rounded-lg bg-[#181818]/50 border-[0.25px] border-white/80 backdrop-blur-[50px]"
          >
            <Icon className="w-4 h-4 text-[#eaecec]/80" />
            <p className="text-lg font-semibold text-left uppercase text-[#eaecec]/80">
              {points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
