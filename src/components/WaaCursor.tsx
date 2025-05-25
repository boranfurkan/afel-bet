"use client";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  lifeSpan: number;
  text: string;
}

const WaaCursor: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastAddTime, setLastAddTime] = useState<number>(0);
  const [letterIndex, setLetterIndex] = useState<number>(0);

  useEffect(() => {
    const pattern: string[] = ["w", "a", "a"];

    const addParticle = (x: number, y: number): void => {
      const now = Date.now();
      if (now - lastAddTime < 32) return;

      const letter = pattern[letterIndex];

      const particle: Particle = {
        id: Math.random(),
        x,
        y,
        lifeSpan: 100,
        text: letter,
      };

      setParticles((prev) => [...prev, particle]);
      setLastAddTime(now);
      setLetterIndex((prev) => (prev + 1) % pattern.length);
    };

    const updateParticles = (): void => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            lifeSpan: particle.lifeSpan - 1.5,
            y: particle.y + 0.5,
            x: particle.x + (Math.random() < 0.5 ? -0.3 : 0.3),
          }))
          .filter((particle) => particle.lifeSpan > 0)
      );
    };

    const handleMouseMove = (e: MouseEvent): void => {
      addParticle(e.clientX, e.clientY);
    };

    const animationFrame = setInterval(updateParticles, 16);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastAddTime, letterIndex]);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none select-none hidden md:block font-sans"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.lifeSpan / 100,
            transform: `translate(-50%, -50%) scale(${
              particle.lifeSpan / 100
            })`,
            zIndex: 10000,
            fontSize: "24px",
            fontWeight: 700, // Using the bold weight
            willChange: "transform",
            color: "#fff",
            textShadow: "0px 0px 1px rgba(0, 0, 0, 0.5)",
            mixBlendMode: "difference",
          }}
        >
          {particle.text}
        </div>
      ))}
    </>
  );
};

export default WaaCursor;
