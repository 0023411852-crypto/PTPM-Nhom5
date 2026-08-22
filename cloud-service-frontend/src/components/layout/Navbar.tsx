"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState<string>("");
  const [cartCount, setCartCount] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Chỉ chạy trên client
    setToken(localStorage.getItem("token"));
    setFullName(localStorage.getItem("fullName") || "User");
    
    // Lấy số lượng giỏ hàng
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);

    // Cập nhật giỏ hàng khi có sự kiện (cần tạo custom event khi add to cart)
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(updatedCart.length);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    router.push("/login");
  };

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
          <Link className={getLinkClass("/top-customers")} href="/top-customers">
            Khách hàng
          </Link>
          <Link className={getLinkClass("/about")} href="/about">
            Về chúng tôi
          </Link>
          <Link className={getLinkClass("/news")} href="/news">
            Tin tức
          </Link>
        </div>
        <div className="flex items-center gap-md relative">
          
          {token ? (
            <div className="flex items-center gap-4">
              <Link href="/checkout" className="relative p-2 text-on-surface hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg hover:shadow-md transition-shadow focus:outline-none"
                >
                  {fullName.charAt(0).toUpperCase()}
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant mb-2">
                      <p className="font-medium text-on-surface truncate">{fullName}</p>
                    </div>
                    <Link href="/client" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[20px]">dashboard</span>
                      Quản lý tài khoản
                    </Link>
                    <button onClick={() => { setShowDropdown(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/50 transition-colors text-left">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:block font-label-caps text-label-caps text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 duration-200">
                Đăng nhập
              </Link>
              <Link href="/register" className="font-label-caps text-label-caps bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-container transition-colors cursor-pointer active:scale-95 duration-200">
                Đăng ký ngay
              </Link>
            </>
          )}
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden material-symbols-outlined text-on-surface ml-2 focus:outline-none">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant shadow-lg py-4 px-6 flex flex-col gap-4 z-40 animate-fade-in">
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/")} href="/">Trang chủ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/services")} href="/services">Dịch vụ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/partners")} href="/partners">Đối tác</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/pricing")} href="/pricing">Bảng giá</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/top-customers")} href="/top-customers">Khách hàng</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/about")} href="/about">Về chúng tôi</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/news")} href="/news">Tin tức</Link>
          
          {!token && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-outline-variant">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="font-label-caps text-label-caps text-primary border border-primary px-4 py-3 rounded-lg text-center hover:bg-surface-container-low transition-colors">Đăng nhập</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="font-label-caps text-label-caps bg-primary text-white px-4 py-3 rounded-lg text-center hover:bg-primary-container transition-colors">Đăng ký ngay</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
