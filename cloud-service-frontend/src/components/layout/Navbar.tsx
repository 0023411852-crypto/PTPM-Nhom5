"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState<string>("");
  const [avatarUrl, setAvatarUrl] = React.useState<string>("");
  const [role, setRole] = React.useState<string>("");
  const [cartCount, setCartCount] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    const syncAuthState = () => {
      setToken(localStorage.getItem("token"));
      setFullName(localStorage.getItem("fullName") || "User");
      setAvatarUrl(localStorage.getItem("avatarUrl") || localStorage.getItem("avatar") || "");
      setRole(localStorage.getItem("role") || "");
    };

    const syncCartState = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartCount(0);
      }
    };

    syncAuthState();
    syncCartState();

    window.addEventListener("authChanged", syncAuthState);
    window.addEventListener("profileUpdated", syncAuthState);
    window.addEventListener("storage", syncAuthState);
    document.addEventListener("visibilitychange", syncAuthState);
    window.addEventListener("cartUpdated", syncCartState);

    return () => {
      window.removeEventListener("authChanged", syncAuthState);
      window.removeEventListener("profileUpdated", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
      document.removeEventListener("visibilitychange", syncAuthState);
      window.removeEventListener("cartUpdated", syncCartState);
    };
  }, []);

  const handleLogout = () => {
    ["token", "refreshToken", "role", "fullName", "avatarUrl", "avatar"].forEach((key) => {
      localStorage.removeItem(key);
    });
    window.dispatchEvent(new Event("authChanged"));
    setToken(null);
    router.push("/login");
  };

  const getLinkClass = (path: string) => {
    if (pathname === path) {
      return "site-nav-link text-primary border-b-2 border-primary text-[length:var(--text-label-caps)] font-semibold transition-colors pb-1";
    }
    return "site-nav-link text-on-surface-variant hover:text-primary text-[length:var(--text-label-caps)] font-semibold transition-colors pb-1";
  };

  return (
    <>
    <nav className="site-nav fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant transition-all duration-300">
      <div className="site-nav-inner flex justify-between items-center h-16 px-gutter max-w-[var(--spacing-container-max)] mx-auto">
        <div className="flex items-center gap-md">
          <img
            alt="CloudNova Logo"
            className="h-8 w-auto hidden"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKrfk0eJeszZLwtqDno7rdyXBneiyQM6WsPvsv4bHPfxMXlTylmZic2igXetLUOB4oENHvJrWHHYUrSkhf0-O8_3y-XHCCMoeDPODRovjqq-yBniIDRhUm_4gatrTi3QE-MaRV4srUZl0h6XWQ5Xhwq2nTeaRV56LQ57nT8K4y68V9V5xitmKYQY6rCxne-0X7_4UdyBxLKzLZ54TNUBFKeZbioUrRT2epoyIMI3BRNgDoBPL4VQ"
          />
          <Link href="/" className="brand-lockup text-[length:var(--text-headline-md)] font-bold text-primary flex items-center gap-2">
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
          
          <Link href="/checkout" className="nav-icon-button relative p-2 text-on-surface hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg hover:shadow-md transition-shadow outline-none overflow-hidden"
                >
                  {avatarUrl ? (
                      <img 
                          src={avatarUrl} 
                          alt="User avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
                          }}
                      />
                  ) : (
                      fullName.charAt(0).toUpperCase()
                  )}
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant mb-2">
                      <p className="font-medium text-on-surface overflow-hidden text-ellipsis whitespace-nowrap">{fullName}</p>
                    </div>
                    
                    {(role === 'admin' || role === 'editor') && (
                      <Link href={`/${role}`} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-primary font-medium hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>admin_panel_settings</span>
                        Trang quản trị
                      </Link>
                    )}
                    
                    <Link href="/client" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>dashboard</span>
                      Quản lý tài khoản
                    </Link>
                    <button onClick={() => { setShowDropdown(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/50 transition-colors text-left">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-cta hidden md:block text-[length:var(--text-label-caps)] font-semibold text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 duration-200">
                Đăng nhập
              </Link>
              <Link href="/register" className="nav-cta text-[length:var(--text-label-caps)] font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-container transition-colors cursor-pointer active:scale-95 duration-200">
                Đăng ký ngay
              </Link>
            </>
          )}
          
          <button onClick={() => setIsMobileMenuOpen(true)} className="block md:hidden text-on-surface ml-2 outline-none">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer flex md:hidden fixed top-0 right-0 h-[100dvh] w-64 bg-surface shadow-2xl flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-outline-variant">
          <span className="font-bold text-primary">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface outline-none">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col p-6 gap-4 overflow-y-auto">
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/")} href="/">Trang chủ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/services")} href="/services">Dịch vụ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/partners")} href="/partners">Đối tác</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/pricing")} href="/pricing">Bảng giá</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/top-customers")} href="/top-customers">Khách hàng</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/about")} href="/about">Về chúng tôi</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/news")} href="/news">Tin tức</Link>
          
          {!token && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-outline-variant">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-[length:var(--text-label-caps)] font-semibold text-primary border border-primary px-4 py-3 rounded-lg text-center hover:bg-surface-container-low transition-colors">Đăng nhập</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="text-[length:var(--text-label-caps)] font-semibold bg-primary text-white px-4 py-3 rounded-lg text-center hover:bg-primary-container transition-colors">Đăng ký ngay</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
