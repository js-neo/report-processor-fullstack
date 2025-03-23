// next.config.mjs

const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/old-page",
                destination: "/new-page",
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                ],
            },
        ];
    },
};

export default nextConfig;