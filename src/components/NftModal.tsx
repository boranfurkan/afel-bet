"use client";

import { X } from "@phosphor-icons/react";
import Image from "next/image";
import { backgroundColors } from "@/constants/colors";

interface ModalProps {
  item: any;
  onClose: () => void;
}

const NftModal = ({ item, onClose }: ModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backgroundTrait = item.attributes?.find(
    (trait: any) => trait.trait_type === "Background"
  );
  const backgroundColor =
    backgroundColors.find((bg: any) => bg.key === backgroundTrait?.value)
      ?.value || "#ffffff";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
      onClick={handleOverlayClick}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl w-[100vw] lg:w-[90vw]  flex flex-col lg:flex-row h-screen lg:h-auto"
        style={{ backgroundColor }}
        onClick={onClose}
      >
        {/* Kapatma Butonu */}

        <X
          size={32}
          className="lg:hidden absolute z-10 text-lg top-5 right-5 text-black font-bold bg-white hover:bg-white/50 rounded-full p-2 "
        />

        {/* İçerik */}
        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* NFT Görseli - Üstte (lg altında), Solda (lg üstü) */}
          <div className="w-full lg:w-1/2 flex justify-center items-center p-0 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none h-[50vh] lg:h-auto">
            <Image
              src={`https://afel.xyz/nft-images/${item?.image}`} //
              alt={""}
              className="w-full h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
              width={500}
              height={500}
              layout="intrinsic"
              priority
            />
          </div>

          {/* NFT Bilgileri - Altta (lg altında), Sağda (lg üstü) */}
          <div className="w-full lg:w-1/2 text-black p-6 flex flex-col h-[50vh] lg:h-auto overflow-y-auto">
            <div className="flex flex-col gap-3">
              <p className="text-sm opacity-80">FEL</p>
              <h2 className="text-3xl font-bold">{item?.name}</h2>
              <p className="text-sm opacity-80">by AFEL</p>
            </div>

            {/* Özellikler */}
            <div className="mt-8 grid grid-cols-2 gap-2">
              {item?.attributes?.map((attr: any) => (
                <div
                  key={attr.trait_type}
                  className="bg-white/40 backdrop-blur-md text-black p-2 rounded-md flex"
                >
                  <Image
                    src={`/icons/${attr?.trait_type.toLowerCase()}-icon.svg`}
                    alt="Stake"
                    width={24}
                    height={24}
                  />
                  <div className="flex flex-col ml-3">
                    <span className="uppercase text-sm opacity-70">
                      {attr.trait_type}
                    </span>
                    <span className="font-semibold">{attr.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftModal;
