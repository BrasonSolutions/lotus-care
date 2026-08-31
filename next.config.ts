import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Human Rights became a section of Model of Care in #91; keep old links alive.
  async redirects() {
    return [
      {
        source: "/quality/human-rights",
        destination: "/quality/model-of-care",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
