"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const username = localStorage.getItem("email");

        if (!username) {
            router.replace("/staff/login");
        } else {
            setIsChecking(false);
        }
    }, [router]);

    if (isChecking) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
