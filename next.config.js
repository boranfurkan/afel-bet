/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını build sırasında yoksay
  },
  images: {
    domains: [
      "bafybeihzoyqffzzygfmsh3omn5qq6mxhfonhhrrqmxvmm72ifz2336lbve.ipfs.w3s.link",
      // Tüm IPFS subdomainlerini kabul etmek için
      "*.ipfs.w3s.link",
      "afel.xyz", // Yeni domain eklendi
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ipfs.w3s.link",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "afel.xyz", // Yeni pattern eklendi
        port: "",
        pathname: "/nft-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
