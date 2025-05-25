import Image from "next/image";
import menuLogo from "/public/images/menu_logo.png";

export default function AboutSection() {
  return (
    <div className="relative w-full bg-[#6C924A] py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-center">
          {/* İçerik Container */}
          <div className="bg-white rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-10 relative w-[1150px]">
            {/* Sol taraf - Metin */}
            <div className="w-full  text-black">
              {/* Başlık */}
              <div>
                <h2 className="text-[30px] font-bold mb-12">
                  We Dream, We Build, We Grow
                </h2>

                <div className="space-y-6">
                  <p className="text-[14px]">
                    At AFEL, we believe in building together. We aren’t just
                    another project; we’re a living, breathing ecosystem shaped
                    by the community. Everything we do, every dApp we launch,
                    every pivot we make, starts and ends with you. Your voice
                    matters here, and your ideas guide our future.
                  </p>

                  <p className="text-[14px]">
                    <b>Ever-Evolving & Community-Driven</b>
                    <br />
                    We follow the hype, but never lose sight of our mission. If
                    a dApp’s spark dims, we set it aside until you’re ready to
                    reignite it. Meanwhile, we rally around what excites us
                    right now, building new utilities that empower everyone
                    involved.
                  </p>

                  <p className="text-[14px]">
                    <b>Stake & Grow Together</b> <br /> By staking your FEL NFT,
                    you earn points that unlock exclusive external and internal
                    airdrops, rewards for your commitment to our shared vision.
                    Here, we don’t just innovate; we lift each other up every
                    step of the way. Join us, and let’s shape the future of
                    Web3, together.
                  </p>

                  <p className="text-[14px]">
                    We rise together. We build together. We grow together.
                  </p>
                </div>
              </div>
              <div className="bottom-8 left-8">
                <div className="relative w-full">
                  <Image
                    src={menuLogo}
                    className="relative"
                    alt="WAA Logo"
                    width={85}
                    height={85}
                  />
                </div>
              </div>
            </div>

            {/* Sağ taraf - Banner Resim */}
            <div className="relative w-full max-w-[640px]">
              <Image
                src="/images/building-feature-banner.jpg"
                alt="WAA Banner"
                className="w-full h-full object-cover rounded-[16px]"
                width={500}
                height={500}
                layout="intrinsic"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
