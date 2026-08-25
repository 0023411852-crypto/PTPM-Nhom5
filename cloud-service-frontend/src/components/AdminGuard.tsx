"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Retrieve role from localStorage (set during login)
        const role = localStorage.getItem("role");

        if (role !== "Admin") {
            alert("Bạn không có quyền truy cập trang Quản trị!");
            router.replace("/");
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

    // Prevent flashing of admin content before redirect
    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-on-background">Đang xác thực quyền truy cập...</div>;
    }

    return <>{children}</>;
}
