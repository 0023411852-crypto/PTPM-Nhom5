"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const baseClass = "font-label-caps text-label-caps transition-colors pb-1 ";
    if (pathname === path) {
      return baseClass + "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed";
    }
    return baseClass + "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-md shadow-sm dark:shadow-none border-b border-outline-variant dark:border-outline transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
        <div className="flex items-center gap-md">
          <img
            alt="CloudNova Logo"
            className="h-8 w-auto hidden"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKrfk0eJeszZLwtqDno7rdyXBneiyQM6WsPvsv4bHPfxMXlTylmZic2igXetLUOB4oENHvJrWHHYUrSkhf0-O8_3y-XHCCMoeDPODRovjqq-yBniIDRhUm_4gatrTi3QE-MaRV4srUZl0h6XWQ5Xhwq2nTeaRV56LQ57nT8K4y68V9V5xitmKYQY6rCxne-0X7_4UdyBxLKzLZ54TNUBFKeZbioUrRT2epoyIMI3BRNgDoBPL4VQ"
          />
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud
            </span>
            CloudNova
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-lg">
          <Link className={getLinkClass("/")} href="/">
            Trang chủ
          </Link>
          <Link className={getLinkClass("/services")} href="/services">
            Dịch vụ
          </Link>
          <Link className={getLinkClass("/partners")} href="/partners">
            Đối tác
          </Link>
          <Link className={getLinkClass("/pricing")} href="/pricing">
            Bảng giá
          </Link>
          <Link className={getLinkClass("/promotions")} href="/promotions">
            Khuyến mãi
          </Link>
          <Link className={getLinkClass("/about")} href="/about">
            Về chúng tôi
          </Link>
          <Link className={getLinkClass("/news")} href="/news">
            Tin tức
          </Link>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/login" className="hidden md:block font-label-caps text-label-caps text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 duration-200">
            Đăng nhập
          </Link>
          <Link href="/register" className="font-label-caps text-label-caps bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-container transition-colors cursor-pointer active:scale-95 duration-200">
            Đăng ký ngay
          </Link>
          <button className="md:hidden material-symbols-outlined text-on-surface">menu</button>
        </div>
      </div>
    </nav>
  );
}
