/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/customer/transfer",
                permanent: true,
            },
            {
                source: "/customer",
                destination: "/customer/transfer",
                permanent: true,
            },
            {
                source: "/customer/logout",
                destination: "/customer/login",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
