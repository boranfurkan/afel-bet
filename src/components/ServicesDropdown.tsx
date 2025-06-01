"use client";
import { useEffect, useRef } from "react";

interface DropdownItem {
  label: string;
  path: string;
  disabled?: boolean;
}

interface ServicesDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  buttonRef: React.RefObject<HTMLDivElement>; // Add this
}

const dropdownItems: DropdownItem[] = [
  { label: "RACEDOTFUN", path: "https://x.com/racedotfun" },
  {
    label: "SWIPE2EARN",
    path: "https://example.com/swipe2earn",
    disabled: true,
  },
  { label: "WAABOT", path: "https://www.ironnode.io/", disabled: true },
  { label: "IRONNODE", path: "https://www.ironnode.io/" },
];

export default function ServicesDropdown({
  isOpen,
  setIsOpen,
  buttonRef,
}: ServicesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full" style={{ zIndex: 50 }}>
      <div
        ref={dropdownRef}
        className={`
          // Mobile styles
          absolute w-48 left-1/2 -translate-x-1/2 top-[120px]
          // Desktop styles
          md:translate-x-0 md:w-[200px]
        `}
        style={
          window.innerWidth >= 768
            ? {
                top: buttonRef.current
                  ? buttonRef.current.getBoundingClientRect().bottom + 4
                  : 0,
                left: buttonRef.current
                  ? buttonRef.current.getBoundingClientRect().left
                  : 0,
              }
            : undefined
        }
      >
        <div className="bg-[#181818]/[0.90] rounded-md backdrop-blur-[32px] p-2 flex flex-col gap-0.5 shadow-lg">
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
    </div>
  );
}
