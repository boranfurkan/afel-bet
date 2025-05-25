"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "/public/images/slider1.jpg";
import slide2 from "/public/images/slider2.jpg";
import slide3 from "/public/images/slider3.jpg";
import slide4 from "/public/images/slider4.jpg";
import slide5 from "/public/images/slider5.png";
import Link from "next/link";
const projects = [
  {
    title: "Staking",
    subtitle: "Stake your FELs, earn points and prizes",
    link: "/stake",
    image: slide1,
  },
  {
    title: "Collection",
    subtitle: "See your grails",
    link: "/collections",
    image: slide2,
  },
  {
    title: "Ironnode",
    subtitle: "Our web3 security & auditing firm",
    image: slide3,
    link: "https://x.com/ironnodesec",
  },
  {
    title: "AFEL-ID",
    subtitle: "Manage your assets and claim prizes",
    link: "/afel-id",
    image: slide4,
  },
  {
    title: "$Waa",
    subtitle: "",
    image: slide5,
    link: "https://waa.afel.xyz/",
  },
  {
    title: "Staking",
    subtitle: "Stake your FELs, earn points and prizes",
    link: "/stake",
    image: slide1,
  },
  {
    title: "Collection",
    subtitle: "See your grails",
    link: "/collections",
    image: slide2,
  },
  {
    title: "Ironnode",
    subtitle: "Our web3 security & auditing firm",
    image: slide3,
    link: "https://x.com/ironnodesec",
  },
  {
    title: "AFEL-ID",
    subtitle: "Manage your assets and claim prizes",
    link: "/afel-id",
    image: slide4,
  },
  {
    title: "$waa",
    subtitle: "",
    image: slide5,
    link: "https://waa.afel.xyz/",
  },
];

export default function CardSlider() {
  // Breakpoint kontrolü için state
  const [isMobile, setIsMobile] = React.useState(false);

  // Ekran genişliğini kontrol et
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    startIndex: 0,
    slidesToScroll: isMobile ? 1 : 4, // Mobilde 1, desktop'ta 4 slide
  });

  const [dotPosition, setDotPosition] = React.useState(1); // Ortadaki dot aktif başlasın

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      // Dot pozisyonunu döngüsel olarak güncelle
      setDotPosition((prev) => (prev === 0 ? 2 : prev - 1));
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      // Dot pozisyonunu döngüsel olarak güncelle
      setDotPosition((prev) => (prev === 2 ? 0 : prev + 1));
    }
  };

  // Carousel yeniden başlatma
  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, isMobile]);

  return (
    <div className="w-full z-30 md:pl-[100px]">
      <div className="relative w-full bg-black/50 backdrop-blur-sm py-10">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 md:ml-20">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex-[0_0_300px] min-w-0 relative group cursor-pointer"
              >
                <Link href={project.link} target="_blank">
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                    <Image
                      priority
                      src={project.image}
                      alt={project.title}
                      width={300}
                      height={400}
                      className="object-cover h-[400px] transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                      <h3 className="text-[20px] font-bold text-center">
                        {project.title}
                      </h3>
                      <p className="text-[16px] font-medium opacity-80 text-center">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Yeni Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-2xl p-2">
            <button
              className="p-1.5 rounded-full hover:bg-black/50 transition-all"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-2 rounded-full transition-all duration-300 ${
                  dotPosition === 0 ? "bg-[#6C924A] w-5 h-3" : "bg-white/30"
                }`}
              />
              <div
                className={`w-4 h-2 rounded-full transition-all duration-300 ${
                  dotPosition === 1 ? "bg-[#6C924A] w-5 h-3" : "bg-white/30"
                }`}
              />
              <div
                className={`w-4 h-2 rounded-full transition-all duration-300 ${
                  dotPosition === 2 ? "bg-[#6C924A] w-5 h-3" : "bg-white/30"
                }`}
              />
            </div>

            <button
              className="p-1.5 rounded-full hover:bg-black/50 transition-all"
              onClick={scrollNext}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
