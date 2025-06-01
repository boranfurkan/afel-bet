"use client";
import { useCollections } from "@/hooks/useCollections";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../Spinner";
import { useEffect, useState } from "react";
import NftModal from "../NftModal";

export default function CollectionList() {
  const { hasMore, setPage, collections } = useCollections();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleItemClick = (item: any) => {
    setSelectedItem(item); // Tıklanan item'ı selectedItem olarak ayarla
  };

  const closeModal = () => {
    setSelectedItem(null); // Modal'ı kapat
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden"; // Modal açıkken kaydırmayı engelle
    } else {
      document.body.style.overflow = "auto"; // Modal kapandığında kaydırmayı aç
    }

    return () => {
      document.body.style.overflow = "auto"; // Temizleme
    };
  }, [selectedItem]);

  return (
    <>
      <InfiniteScroll
        dataLength={collections.length}
        next={() => hasMore && setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        }
        style={{ overflow: "visible" }}
        endMessage={<p style={{ textAlign: "center" }}>-</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {collections.map((item) => (
            <div
              key={item.id}
              className="relative w-full cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {!item?.image && (
                <div className="w-full h-[300px] bg-gray-200 rounded-[24px] flex items-center justify-center">
                  <span className="text-gray-500">Görsel Bulunamadı</span>
                </div>
              )}
              <div className="rounded-[24px] overflow-hidden">
                <Image
                  src={`https://afel.xyz/nft-images/${item?.image}`} //
                  alt={""}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                  layout="intrinsic"
                  priority
                />
              </div>

              <div className="px-4 pt-2 ">
                <div className="flex justify-center items-center text-black">
                  <span className="text-sm">{item?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {/* Modal bileşeni */}
      {selectedItem && <NftModal item={selectedItem} onClose={closeModal} />}
    </>
  );
}
