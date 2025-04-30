"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
    const pathname = usePathname();
    return (
        <nav className="sm:items-start flex gap-[32px] items-center justify-center font-[family-name:var(--font-geist-sans)] w-full">
            <Link 
            href="/" 
            className={pathname === "/" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                Home
            </Link>
            
            <Link 
            href="/about" 
            className={pathname === "/about" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                About
            </Link>
            
            <Link 
            href="/contact" 
            className={pathname === "/contact" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                Contact
            </Link>
        </nav>
    );
}