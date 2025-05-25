/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pbs.twimg.com"], // Add Twitter's image domain
  },
  webpack: (config, { isServer, dev }) => {
    // Only run in production client-side builds
    if (!dev && !isServer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === "TerserPlugin") {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions.compress,
              drop_console: true, // Remove console.* statements
              drop_debugger: true, // Remove debugger statements
              pure_funcs: [
                "console.info",
                "console.debug",
                "console.warn",
                "console.log",
                "console.error",
              ],
            },
          };
        }
      });
    }
    return config;
  },
};

export default nextConfig;
