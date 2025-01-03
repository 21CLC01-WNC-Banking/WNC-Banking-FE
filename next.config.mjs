/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/customer/home",
                permanent: true,
            },
            {
                source: "/customer",
                destination: "/customer/home",
                permanent: true,
            },
            {
                source: "/customer/transfer",
                destination: "/customer/transfer/internal",
                permanent: true,
            },
            {
                source: "/customer/logout",
                destination: "/customer/login",
                permanent: true,
            },
            {
                source: "/staff",
                destination: "/staff/employee/create-account",
                permanent: true,
            },
            {
                source: "/staff/logout",
                destination: "/staff/login",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
