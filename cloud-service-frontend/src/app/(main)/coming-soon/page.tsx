
"use client";

import React from "react";
import Link from "next/link";

export default function ComingSoonPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-[48px] text-primary">engineering</span>
            </div>
            <h1 className="font-display-md text-display-md text-on-surface mb-sm">
                Tính năng đang được phát triển xin vui lòng quay lại sau
            </h1>
            <p className="text-on-surface-variant max-w-md mx-auto mb-xl">
                Chúng tôi đang nỗ lực hoàn thiện bảng điều khiển (Control Panel) để mang lại trải nghiệm tốt nhất cho bạn.
            </p>
            <Link 
                href="/client" 
                className="px-lg py-md bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm"
            >
                Quay lại trang quản lý
            </Link>
        </div>
    );
}


