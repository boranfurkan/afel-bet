"use client";
import AboutSection from "@/components/AboutSection";
import CardSlider from "@/components/CardSlider";
import LizardSlider from "@/components/LizardSlider";
import StaySection from "@/components/StaySection";
import WaaSection from "@/components/WaaSection";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import bannerText from "/public/images/banner-text.svg";
import homebg2 from "/public/images/home-page-bannerQ.jpg";

// Separate component for referral handling
function ReferralHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Referral link handling
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Store referral code for later use
      localStorage.setItem('referralCode', refCode);
      
      // Redirect to casino with referral code
      router.push(`/play?ref=${refCode}`);
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}

export default function Home() {
  // const lizardImages = [
  //   lizardFirst,
  //   lizardSecond,
  //   lizardThird,
  //   lizardFourth,
  //   lizardFifth,
  //   lizardSixth,
  //   lizardSeventh,
  //   lizardEighth,
  // ];
  // const backgrounds = [
  //   { bg: homebg1, text: hometext1 },
  //   { bg: homebg2, text: hometext2 },
  //   { bg: homebg3, text: hometext3 },
  //   { bg: homebg4, text: hometext4 },
  //   { bg: homebg5, text: hometext5 },
  //   { bg: homebg6, text: hometext6 },
  //   { bg: homebg7, text: hometext7 },
  // ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLizardIndex, setCurrentLizardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLizardTransitioning, setIsLizardTransitioning] = useState(false);

  // const handleBackgroundClick = (e: React.MouseEvent) => {
  //   if ((e.target as Element).closest('[data-navbar="true"]')) {
  //     return;
  //   }

  //   if (isTransitioning) return;

  //   // First start the transition animations
  //   setIsTransitioning(true);
  //   setIsLizardTransitioning(true);

  //   // Wait for half the animation duration before changing images...
  //   setTimeout(() => {
  //     setCurrentIndex((prev) =>
  //       prev === backgrounds.length - 1 ? 0 : prev + 1
  //     );
  //     setCurrentLizardIndex((prev) =>
  //       prev === lizardImages.length - 1 ? 0 : prev + 1
  //     );
  //   }, 600); // Half of the total transition time

  //   // Reset transition states after full duration
  //   setTimeout(() => {
  //     setIsTransitioning(false);
  //     setIsLizardTransitioning(false);
  //   }, 1000);
  // };

  return (
    <>
      {/* Referral Handler with Suspense */}
      <Suspense fallback={null}>
        <ReferralHandler />
      </Suspense>

      {/* Hero Section - İlk ekran */}
      <div className="w-full h-screen relative">
        <Image
          src={homebg2}
          fill
          alt="Background"
          className="object-cover"
          quality={100}
          priority
          sizes="100vw"
          placeholder="blur"
        />

        {/* Text SVG */}
        <div className="absolute inset-0 w-full h-full flex items-start lg:items-center justify-center lg:justify-end lg:pr-20 mt-8 md:mt-0 z-20">
          <Image
            src={bannerText}
            alt="Text"
            width={300}
            height={300}
            priority
            className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] mt-40 lg:mt-0 lg:mr-10 transition-all duration-1000 ease-in-out transform"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: `translateY(${isTransitioning ? "20px" : "0"})`,
            }}
          />
        </div>
      </div>

      {/* Diğer Sections */}
      <div className="relative">
        {/* Slider Section */}
        <CardSlider />

        {/* About Section */}
        <AboutSection />

        {/* Stay Section */}
        <StaySection />

        {/* WAA Section */}
        <WaaSection />

        {/* Lizard Slider */}
        <LizardSlider />
      </div>
    </>
  );
}
