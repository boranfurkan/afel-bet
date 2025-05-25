import Image from "next/image";
import banner1 from "/public/images/section3-banner1.jpg";
import banner2 from "/public/images/section3-banner2.jpg";
import banner3 from "/public/images/section3-banner3.jpg";

export default function StaySection() {
  return (
    <div className="w-full bg-[#171717] py-[8vh]">
      <div className=" px-[11vw] mx-auto">
        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Sol Banner */}
            <div className="w-full lg:w-4/5">
              <Image
                src={banner1}
                className="rounded-[40px] h-full w-full"
                alt=""
              />
            </div>

            {/* Orta Alan */}
            <div className=" h-full flex flex-col justify-between w-full">
              <div className="p-2 md:px-20">
                <h2 className="text-[32px] xl:text-[64px] text-white mb-6">
                  The Powerhouse
                </h2>
                <p className="text-[12px] xl:text-[16px] text-white uppercase">
                  At AFEL, we harness our collective united strength. We do not
                  just follow trends; we shape them. When hype shifts, we pivot,
                  adapt, and come back stronger. That is our alpha mindset.
                  Holding a FEL NFT places you at the heart of a brotherhood, a
                  steadfast network that stands shoulder to shoulder.
                </p>
              </div>

              <div className="flex p-2 md:px-20 gap-10 text-white">
                <div className="text-center">
                  <p className="text-[40px] font-bold">40%</p>
                  <p className="text-[12px] xl:text-[12px]">ORIGINAL OWNERS!</p>
                </div>
                <div className="text-center">
                  <p className="text-[40px] font-bold">100%</p>
                  <p className="text-[12px] xl:text-[12px]">SOLD OUT!</p>
                </div>
              </div>
            </div>

            {/* Sağ Banner */}
            <div className=" h-full w-full lg:w-2/5">
              <div className="flex flex-row md:flex-col gap-5 h-full">
                <div className="w-full md:w-full h-full">
                  <Image
                    src={banner2}
                    className="h-full w-full object-cover rounded-[40px]"
                    alt=""
                  />
                </div>
                <div className="w-full md:w-full h-full">
                  <Image
                    src={banner3}
                    className="h-full w-full object-cover rounded-[40px]"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
