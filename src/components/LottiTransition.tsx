"use client";
import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import transitionAnimation from "/public/animations/transition_1.json";

interface LottieTransitionProps {
  isTransitioning: boolean;
}

const LottieTransition: React.FC<LottieTransitionProps> = ({
  isTransitioning,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    // Dynamically import lottie-web
    import("lottie-web").then((Lottie) => {
      if (containerRef.current && !animationRef.current) {
        animationRef.current = Lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: transitionAnimation,
        });
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isTransitioning && animationRef.current) {
      animationRef.current.goToAndStop(0, true);
      animationRef.current.play();
    }
  }, [isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="w-[300vw] md:w-[220vw] lg:w-full h-full"
      style={{ zIndex: 10 }}
    />
  );
};

export default LottieTransition;
