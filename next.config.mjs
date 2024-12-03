/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/customer",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
