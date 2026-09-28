// Swap the default once lotuscare.ie is the deployed custom domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://lotus-care.brasonsolutions.com").replace(/\/$/, "");
