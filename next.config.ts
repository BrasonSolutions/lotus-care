import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // YouTube's thumbnail CDN, used as the click-to-play poster for embedded
    // videos (VideoTestimonialCard) so we don't have to host our own stills.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
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

initOpenNextCloudflareForDev();
