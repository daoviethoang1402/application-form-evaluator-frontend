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
                Resume Parser
            </Link>
            
            <Link 
            href="/JD_Quantifier" 
            className={pathname === "/JD_Quantifier" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                JD Quantifier
            </Link>
            
            <Link 
            href="/Grader_Summarizer" 
            className={pathname === "/Grader_Summarizer" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                Grader & Summarizer
            </Link>

            <Link 
            href="/Decision_Maker" 
            className={pathname === "/Decision_Maker" ? "font-bold mr-4" : "mr-4 text-blue-500"}>
                Decision Maker
            </Link>
        </nav>
    );
}