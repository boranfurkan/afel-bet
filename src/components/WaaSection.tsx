import Image from "next/image";
import waaGif from "/public/images/waaGIF.gif";

export default function WaaSection() {
  return (
    <div className="w-full bg-black py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center">
          {/* GIF Container */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-20">
            {/* Sol GIF */}
            <div>
              <Image
                src={waaGif}
                alt="WAA GIF"
                width={430}
                height={430}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              {/* Üst Text */}
              <p className="text-white text-xl whitespace-nowrap text-center lg:text-left">
                it is
              </p>

              {/* WAA Text */}
              <h2 className="text-white text-xl md:text-4xl lg:text-6xl font-bold whitespace-nowrap text-center">
                WAA
              </h2>

              {/* Alt Text */}
              <p className="text-white text-xl whitespace-nowrap text-center lg:text-right">
                it is
              </p>
            </div>
            <div>
              <Image
                src={waaGif}
                alt="WAA GIF"
                width={430}
                height={430}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
