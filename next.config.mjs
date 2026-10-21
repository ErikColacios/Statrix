/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/app/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXTAUTH_URL },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Authorization, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  },
  experimental: {
    serverActions: {
        bodySizeLimit: "12mb",
    },
    // satori loads WebAssembly, which webpack can't bundle (used in getUserShareCard)
    serverComponentsExternalPackages: ["satori"],
  },
  images: {
    domains: ['images.igdb.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.statrix.app",
        pathname: "/**",
      },
    ]
  }
  
};

export default nextConfig;