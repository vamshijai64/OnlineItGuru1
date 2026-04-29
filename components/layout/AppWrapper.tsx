"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Check if current path is admin-related
    const isAdminPath = pathname.startsWith("/admin");
    const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/admin-login");

    return (
        <>
            {!isAdminPath && <Navbar />}
            <main>{children}</main>
            {!isAdminPath && !isAuthPath && <Footer />}
        </>
    );
}
