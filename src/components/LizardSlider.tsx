"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import Link from "next/link";

export default function LizardSlider() {
  const [currentNFTs, setCurrentNFTs] = useState<
    { id: string; image: string }[]
  >([]);
  const [startIndex, setStartIndex] = useState(0); // NFT başlangıç noktası

  useEffect(() => {
    if (typeof window === "undefined") return;

    const generateNFTs = (index: number) => {
      const currentTime = new Date();
      const startDate = new Date("2024-03-04");

      // Sadece yıl, ay ve gün kısmını alarak tarihleri karşılaştır
      const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const current = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      );
      // Tarihler arasındaki farkı milisaniye cinsinden al
      const daysPassed =
        Math.floor(
          (current.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
        ) - 365;

      const isFirstHalf = currentTime.getUTCHours() < 12;
      console.log("Geçen gün sayısı: ", daysPassed);
      debugger;
      // Her gün için 100'lük grup, her 12 saatte bir 50'lik alt grup
      const baseIndex = daysPassed * 100; // 0'dan başlayacak
      const dynamicStartIndex = baseIndex + (isFirstHalf ? 0 : 50) + index;
      debugger;
      const nfts = Array.from({ length: 50 }, (_, i) => {
        const nftIndex = (dynamicStartIndex + i) % 3333;
        return {
          id: `#${nftIndex}`,
          image: `https://afel.xyz/nft-images/${nftIndex}.png`,
        };
      });
      console.log("Oluşturulan NFT'ler:", nfts);

      setCurrentNFTs(nfts);
    };

    generateNFTs(startIndex);
    const interval = setInterval(() => generateNFTs(startIndex), 60 * 1000);

    // const interval = setInterval(() => {
    //   setStartIndex((prevIndex) => {
    //     const newIndex = (prevIndex + 50) % 3333;
    //     generateNFTs(newIndex); // Yeni NFT setini oluştur
    //     return newIndex;
    //   });
    // }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  const leftScrollingNFTs = currentNFTs.slice(0, 25);
  const rightScrollingNFTs = currentNFTs.slice(25, 50);

  return (
    <div className="w-full bg-black py-20">
      <div className="flex flex-col gap-8">
        {/* Sola kayan set */}
        <div className="group w-full overflow-hidden">
          <div className="flex w-max animate-infinite-scroll-left hover:pause">
            {/* İlk set kartlar */}
            {leftScrollingNFTs.map((nft, index) => (
              <div key={`first-${index}`} className="relative px-3">
                <div className="w-[145px] h-[145px] md:w-[236px] md:h-[236px] xl:w-[350px] xl:h-[350px] bg-white rounded-[24px]">
                  <Image
                    src={nft.image}
                    alt={`Lizard ${index + 1}`}
                    width={350}
                    height={350}
                    className="w-full h-full object-contain rounded-[24px]"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="flex justify-between items-center p-2 px-4 text-white">
                    <span className="font-bold bg-black px-4 py-1 rounded-bl-[24px] text-[6px] md:text-[12px] xl:text-base">
                      FEL {nft.id}
                    </span>
                    <span className="bg-black px-4 py-1 rounded-br-[24px] text-[6px] md:text-[12px] xl:text-base">
                      by AFEL
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* İkinci set kartlar - Sonsuz döngü için */}
            {leftScrollingNFTs.map((nft, index) => (
              <div key={`second-${index}`} className="relative px-3">
                <div className="w-[145px] h-[145px] md:w-[236px] md:h-[236px] xl:w-[350px] xl:h-[350px] bg-white rounded-[24px]">
                  <Image
                    src={nft.image}
                    alt={`Lizard ${index + 1}`}
                    width={350}
                    height={350}
                    className="w-full h-full object-contain rounded-[24px]"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="flex justify-between items-center p-2 px-4 text-white">
                    <span className="font-bold bg-black px-4 py-1 rounded-bl-[24px] text-[6px] md:text-[12px] xl:text-base">
                      FEL {nft.id}
                    </span>
                    <span className="bg-black px-4 py-1 rounded-br-[24px] text-[6px] md:text-[12px] xl:text-base">
                      by AFEL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağa kayan set */}
        <div className="group w-full overflow-hidden">
          <div className="flex w-max animate-infinite-scroll-right hover:pause">
            {/* İlk set kartlar */}
            {rightScrollingNFTs.map((nft, index) => (
              <div key={`third-${index}`} className="relative px-3">
                <div className="w-[145px] h-[145px] md:w-[236px] md:h-[236px] xl:w-[350px] xl:h-[350px] bg-white rounded-[24px]">
                  <Image
                    src={nft.image}
                    alt={`Lizard ${index + 1}`}
                    width={350}
                    height={350}
                    className="w-full h-full object-contain rounded-[24px]"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="flex justify-between items-center p-2 px-4 text-white">
                    <span className="font-bold bg-black px-4 py-1 rounded-bl-[24px] text-[6px] md:text-[12px] xl:text-base">
                      FEL {nft.id}
                    </span>
                    <span className="bg-black px-4 py-1 rounded-br-[24px] text-[6px] md:text-[12px] xl:text-base">
                      by AFEL
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* İkinci set kartlar - Sonsuz döngü için */}
            {rightScrollingNFTs.map((nft, index) => (
              <div key={`fourth-${index}`} className="relative px-3">
                <div className="w-[145px] h-[145px] md:w-[236px] md:h-[236px] xl:w-[350px] xl:h-[350px] bg-white rounded-[24px]">
                  <Image
                    src={nft.image}
                    alt={`Lizard ${index + 1}`}
                    width={350}
                    height={350}
                    className="w-full h-full object-contain rounded-[24px]"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="flex justify-between items-center p-2 px-4 text-white">
                    <span className="font-bold bg-black px-4 py-1 rounded-bl-[24px] text-[6px] md:text-[12px] xl:text-base">
                      FEL {nft.id}
                    </span>
                    <span className="bg-black px-4 py-1 rounded-br-[24px] text-[6px] md:text-[12px] xl:text-base">
                      by AFEL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MORE butonu */}
        <Link href={"https://magiceden.io/marketplace/afel"} target={"_blank"}>
          <div className="flex justify-center mt-8">
            <button className="text-white text-sm rounded-full px-8 py-2 hover:bg-white/10 transition-colors">
              MORE&gt;
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
