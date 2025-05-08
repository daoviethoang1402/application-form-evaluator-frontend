"use client";
import { useRouter } from "next/navigation";

export default function About() {
    const router = useRouter();
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-3xl font-bold">Thông báo</h1>
            <p className="text-lg">Chức năng đang được phát triển và sẽ hoàn thiện sớm thôi.</p>
            <p className="text-lg">Cảm ơn bạn đã tin tưởng sử dụng sản phẩm của chúng mình nhé</p>
            <p className="text-lg">Hi vọng bạn sẽ tiếp tục đồng hành cùng chúng mình.</p>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                onClick={() => router.push("/")}
            >
                Go to Home
            </button>
        </main>
        </div>
    );
}