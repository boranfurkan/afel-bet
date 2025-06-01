"use client";
import { useEffect, useRef } from "react";

interface DropdownItem {
  label: string;
  path: string;
}

interface MarketplacesDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

const dropdownItems: DropdownItem[] = [
  { label: "ME", path: "https://magiceden.io/marketplace/afel" },
  { label: "TENSOR", path: "https://www.tensor.trade/trade/afel" },
  { label: "SNIPER", path: "https://www.sniper.xyz/collection/fel" },
];

export default function MarketplacesDropdown({
  isOpen,
  setIsOpen,
  buttonRef,
}: MarketplacesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`
      absolute z-50 
      // Mobile styles
      top-0 left-full ml-2
      // Desktop styles
      md:top-0 md:left-full md:ml-2
      w-24
    `}
    >
      <div className="bg-[#181818]/[0.50] rounded-md p-2 flex flex-col gap-0.5">
        {dropdownItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-1 py-1 text-white text-sm md:text-sm font-bold text-center hover:bg-black/20 rounded-md transition-colors duration-200 whitespace-nowrap cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
