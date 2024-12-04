/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/customer/accounts",
                permanent: true,
            },
            {
                source: "/customer",
                destination: "/customer/accounts",
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
