/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/about",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin",
          },
        ],
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
