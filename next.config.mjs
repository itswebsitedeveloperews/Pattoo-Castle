/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deliver the existing styles with the first response, avoiding a blocking
  // stylesheet round trip. Next retains stylesheet loading for navigation.
  experimental: { inlineCss: true },
};

export default nextConfig;
