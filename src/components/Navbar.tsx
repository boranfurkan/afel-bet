"use client";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { StaticImageData } from "next/image";
import ServicesDropdown from "./ServicesDropdown";
import { DiscordLogo, User, X } from "@phosphor-icons/react";
import menuLogo from "/public/images/menu_logo.png";
import MarketplacesDropdown from "./MarketplacesDropdown";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import { SignInModal } from "./auth/SignInModal";
import { useWallet } from "@solana/wallet-adapter-react";

interface NavItem {
  label: string;
  path: string;
  isInternal: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  decoration?: boolean;
}

interface NavbarProps {
  logo: string | StaticImageData;
}

const navItems: NavItem[] = [
  { label: "HOME", path: "/", isInternal: true },
  { label: "STAKING", path: "/stake", isInternal: true },
  { label: "COLLECTIONS", path: "/collections", isInternal: true },
  {
    label: "$WAA↗",
    path: "https://waa.afel.xyz/",
    decoration: true,
    isInternal: false,
  },

  {
    label: "IRONNODE↗",
    path: "https://www.ironnode.io/",
    decoration: true,
    isInternal: false,
  },
  // { label: "AFEL[id]", path: "/afel-id", isInternal: true },
  {
    label: "DISCORD",
    path: "https://discord.com/invite/afel",
    isInternal: false,
    iconOnly: true, // Add this
  },
  //{ label: "AIRDROP", path: "/airdrop", isInternal: true },
];

export default function Navbar({ logo }: NavbarProps) {
  const servicesButtonRef = useRef<HTMLDivElement>(null);
  const marketplacesButtonRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketplacesOpen, setIsMarketplacesOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    // JWT'yi kontrol et
    const jwt = Cookies.get("jwt");
    setIsLoggedIn(!!jwt);
    setToken(jwt);
  }, [pathname]); // pathname değiştiğinde tekrar kontrol et

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleServices = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesOpen(!isServicesOpen);
  };
  const toggleMarketplaces = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMarketplacesOpen(!isMarketplacesOpen);
  };

  const renderMarketplacesButton = () => (
    <div className="relative my-2" ref={marketplacesButtonRef}>
      <button
        onClick={toggleMarketplaces}
        className="flex items-center gap-1 px-4 py-2 rounded-[28px] bg-gradient-to-b from-[#FF8000] to-[#78FF00] hover:opacity-90 transition-all"
      >
        <span className="text-sm font-black uppercase">Buy</span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${
            isMarketplacesOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M9 5L16 12L9 19"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <MarketplacesDropdown
        isOpen={isMarketplacesOpen}
        setIsOpen={setIsMarketplacesOpen}
        buttonRef={marketplacesButtonRef}
      />
    </div>
  );

  const renderSingInButton = () => {
    const isProfilePage = pathname.startsWith("/afel-id");

    return isLoggedIn ? (
      <Link href={`/afel-id`} className="relative">
        <div
          className={`${
            isProfilePage
              ? "bg-[#6C924A] text-white"
              : "bg-white text-black hover:bg-white/90"
          } w-[100px] group relative flex justify-center items-center gap-2 md:gap-3 px-4 py-2 cursor-pointer overflow-hidden rounded-[28px]`}
        >
          <div className="flex items-center gap-2">
            <User
              size={20}
              className={isProfilePage ? "text-white" : "text-black"}
            />
          </div>
        </div>
      </Link>
    ) : (
      <div
        className="divide-solid w-[100px]"
        onClick={() => setIsSignInModalOpen(true)}
      >
        <div className="relative">
          <div
            className="group relative flex justify-center items-center gap-2 md:gap-3 px-4 py-2
      cursor-pointer overflow-hidden hover:opacity-90 rounded-[28px] bg-white"
          >
            <p className="text-sm text-center text-black uppercase tracking-wider relative z-10">
              Sign In
            </p>

            <div className="absolute inset-0 rounded-md ring-white/20 group-hover:ring-white/40  duration-300" />
          </div>
        </div>
      </div>
    );
  };
  const renderServicesButton = () => (
    <div className="relative" ref={servicesButtonRef}>
      <div
        onClick={toggleServices}
        className="flex justify-center items-center relative gap-2 md:gap-3 px-2 py-2 rounded-md hover:bg-white/[0.12] cursor-pointer"
      >
        <p className="text-sm  text-center text-white">SERVICES</p>
        <svg
          width={16}
          height={16}
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`flex-grow mb-1 h-4 md:h-5 relative transition-transform duration-200 ${
            isServicesOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M4.5 5.11696L4.59375 5.21071L10.5 11.1402L16.5 5.14021L16.5 9.35896L11.5545 14.3045L10.5 15.383L9.4455 14.3045L4.5 9.38221L4.5 5.11621L4.5 5.11696Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );

  const renderNavItem = (item: NavItem) => (
    <div
      key={item.path}
      className={`flex justify-center items-center relative p-2 rounded-[28px] ${
        pathname === item.path ? "bg-[#6C924A] " : "hover:bg-white group"
      }`}
    >
      <Link
        href={item.path}
        className={`flex items-center justify-center text-center text-white group-hover:text-black
        ${item.disabled ? "cursor-not-allowed opacity-50" : ""}
        ${!item.isInternal ? "hover:opacity-80" : ""}`}
        target={item.isInternal ? undefined : "_blank"}
        rel={item.isInternal ? undefined : "noopener noreferrer"}
        onClick={(e) => item.disabled && e.preventDefault()}
      >
        {item.iconOnly ? (
          <DiscordLogo size={20} weight="fill" />
        ) : (
          <span className={`text-sm ${item?.decoration ? "underline" : ""}`}>
            {item.label}
          </span>
        )}
      </Link>
    </div>
  );

  return (
    <>
      <nav className="font-sans relative" style={{ zIndex: 50 }}>
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Logo and Menu Button Container */}
          <div className="fixed top-0 left-0 px-8 py-2 flex items-center gap-4 z-50 w-full justify-between bg-black/10 backdrop-blur-sm">
            <Image
              src={menuLogo}
              alt="waa"
              width={60}
              height={60}
              priority
              className="w-auto h-[60px]"
            />
            {/* Two Line Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col gap-2"
            >
              {isMobileMenuOpen ? (
                <X size={24} color="white" />
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="w-6 h-[2px] bg-white"></div>
                  <div className="w-6 h-[2px] bg-white"></div>
                </div>
              )}
            </button>
          </div>
          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 h-full bg-[#181818]/[0.70] backdrop-blur-md border-l border-white/30
            w-[50vw] sm:w-[250px] transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col items-center pt-24 px-8 h-full overflow-y-auto">
              {navItems.slice(0, 2).map((item) => (
                <div key={item.path} className="w-full">
                  {renderNavItem(item)}
                </div>
              ))}
              {navItems.slice(2, -1).map((item) => (
                <div key={item.path} className="w-full">
                  {renderNavItem(item)}
                </div>
              ))}
              <div className="w-full h-[1px] bg-white/30" />{" "}
              {renderSingInButton()}
              {renderMarketplacesButton()} {/* Move BUY button here */}
              {navItems.slice(-1).map((item) => (
                <div key={item.path} className="w-full">
                  {renderNavItem(item)}
                </div>
              ))}
              <div>
                <MusicPlayer />
              </div>
              <div className="flex flex-row justify-center items-center py-[10px] rounded-[72px] mb-4">
                <Image
                  src={menuLogo}
                  alt="waa"
                  width={60}
                  height={60}
                  priority
                  className="w-auto h-[60px] ml-2"
                />
                <p className="text-[20px] text-white">AFEL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block fixed overflow-visible  left-8 top-1/2 -translate-y-1/2">
          <div className="flex flex-col justify-between items-center gap-1 p-1 rounded-[100px] bg-[#181818]/[0.70] backdrop-blur-md">
            <div className="flex flex-col justify-center items-center border border-[#58585842] py-[10px] rounded-[72px] mb-4">
              <Image
                src={menuLogo}
                alt="waa"
                width={60}
                height={60}
                priority
                className="w-auto h-[60px] ml-2"
              />
              <p className="text-[20px] text-white">AFEL</p>
            </div>
            {navItems.slice(0, 2).map(renderNavItem)}
            {navItems.slice(2, -1).map(renderNavItem)}{" "}
            {/* Remove the last item (Discord) */}
            {renderSingInButton()}
            {renderMarketplacesButton()} {/* Move BUY button here */}
            {navItems.slice(-1).map(renderNavItem)}{" "}
            <div>
              <MusicPlayer />
            </div>
            {/* Render Discord button last */}
          </div>
        </div>
      </nav>
      <ServicesDropdown
        isOpen={isServicesOpen}
        setIsOpen={setIsServicesOpen}
        buttonRef={servicesButtonRef}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}
