/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Required for Docker / Cloud Run deployment
    // Copies all necessary files into .next/standalone (lean production image)
    output: 'standalone',

    // Security & performance
    poweredByHeader: false,
    productionBrowserSourceMaps: false,

    // Suppress noisy hydration warnings from browser extensions
    // (already handled per-element with suppressHydrationWarning)
};

module.exports = nextConfig;
