'use client';

import Image from 'next/image';
import Link from 'next/link';
import waaLogo from '/public/images/waaLogo.png';
import lizardFourth from '/public/images/lizard-4.png';
import { DiscordLogo, XLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <>
      <div className="w-full flex bg-[#6F8C4C] relative ">
        {/* Profil Resmi - Sadece Desktop'ta görünür */}
        <div className="flex justify-between w-1/5 md:w-2/5">
          <div className="w-[100px]"></div>
          <div className="w-[100px] mt-4 md:mt-8 ml-4 md:ml-8">
            <Image src={waaLogo} alt="WAA Logo" width={100} />
          </div>
          <div className="w-[250px] self-end mb-[-30px] z-10 hidden md:block ">
            <Image src={lizardFourth} width={250} alt="Profile" />
          </div>
        </div>
        <div className="container content-center w-4/5 md:w-3/5 mx-auto p-4 md:p-6 lg:px-8 relative z-10">
          {/* Sol Kısım - Menüler */}
          <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
            {/* Menü Grid */}

            <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 md:gap-x-10 lg:gap-x-20 gap-y-6 relative">
              {/* Sol Sütun */}

              <div className="flex flex-col gap-2 relative">
                <div className="hidden lg:block w-[2px] h-full bg-white absolute right-[-35px] h-[365px]" />

                <h3 className="text-white font-bold mb-1">HOME</h3>

                <Link href="/stake" className="text-white hover:opacity-80">
                  STAKING
                </Link>
                <Link href="/afel-id" className="text-white hover:opacity-80">
                  AFEL[ID]
                </Link>
                {/* <Link href="/blog" className="text-white hover:opacity-80">
                  BLOG
                </Link> */}

                <h3 className="text-white font-bold mb-1 mt-6 whitespace-nowrap">
                  FEL COLLECTION
                </h3>
                <Link
                  href="/collections"
                  className="text-white hover:opacity-80 whitespace-nowrap"
                >
                  AFEL SEASON I
                </Link>
                <Link
                  href="/"
                  className="text-[#b2b2b2] pointer-events-none hover:opacity-80 whitespace-nowrap"
                >
                  AFEL SEASON II
                </Link>
              </div>

              <div className="hidden lg:block w-[2px] h-full bg-white absolute right-[-25px] h-[365px]" />

              {/* Sağ Sütun */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold mb-1">SERVICES</h3>
               {/*  <Link
                  href="/waabot"
                  className="text-[#b2b2b2] pointer-events-none"
                >
                  WAABOT(COMING SOON)
                </Link> */}

                <Link
                  href="https://www.ironnode.io/"
                  target="_blank"
                  className="text-white hover:opacity-80"
                >
                  IRONNODE
                </Link>

                <Link
                  href="https://waa.afel.xyz "
                  target="_blank"
                  className="text-white hover:opacity-80"
                >
                  ABOUT
                </Link>
              </div>
            </div>

            {/* Sosyal Medya - Grid dışında */}
            <div className="flex flex-col gap-4">
              {/* AFEL Sosyal Medya */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold">AFEL</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://x.com/afelxyz"
                    target="_blank"
                    className="text-white hover:opacity-80"
                  >
                    <XLogo size={20} weight="fill" />
                  </Link>
                  <Link
                    href="https://discord.com/invite/afel"
                    target="_blank"
                    className="text-white hover:opacity-80"
                  >
                    <DiscordLogo size={20} weight="fill" />
                  </Link>
                </div>
              </div>

              {/* WAA Sosyal Medya */}
              {/* <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold">WAA</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://x.com/waathecoin"
                    target="_blank"
                    className="text-white hover:opacity-80"
                  >
                    <XLogo size={20} weight="fill" />
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-full h-[30px] flex bg-black relative"></div>
    </>
  );
}

// Sosyal medya ikonları için basit SVG bileşenleri
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);

const TiktokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);
