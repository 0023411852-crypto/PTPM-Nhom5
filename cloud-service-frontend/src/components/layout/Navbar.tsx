"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { css } from "styled-system/css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState<string>("");
  const [avatarUrl, setAvatarUrl] = React.useState<string>("");
  const [cartCount, setCartCount] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const syncAuthState = () => {
      setToken(localStorage.getItem("token"));
      setFullName(localStorage.getItem("fullName") || "User");
      setAvatarUrl(localStorage.getItem("avatarUrl") || localStorage.getItem("avatar") || "");
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
      return css({
        color: "primary",
        borderBottom: "2px solid",
        borderColor: "primary",
        fontSize: "label-caps",
        fontWeight: "label-caps",
        transition: "colors",
        paddingBottom: "1",
      });
    }
    return css({
      color: "on-surface-variant",
      _hover: { color: "primary" },
      fontSize: "label-caps",
      fontWeight: "label-caps",
      transition: "colors",
      paddingBottom: "1",
    });
  };

  return (
    <nav className={`nova-nav ${css({
      position: "fixed",
      top: "0",
      width: "full",
      zIndex: "50",
      backgroundColor: "surface/80",
      backdropBlur: "md",
      boxShadow: "sm",
      borderBottom: "1px solid",
      borderColor: "outline-variant",
      transition: "all 0.3s",
    })}`}>
      <div className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "16",
        paddingX: "gutter",
        maxWidth: "container-max",
        marginX: "auto",
      })}>
      <div className={css({ display: "flex", alignItems: "center", gap: "md" })}>
          <img
            alt="CloudNova Logo"
            className={css({ height: "8", width: "auto", display: "none" })}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKrfk0eJeszZLwtqDno7rdyXBneiyQM6WsPvsv4bHPfxMXlTylmZic2igXetLUOB4oENHvJrWHHYUrSkhf0-O8_3y-XHCCMoeDPODRovjqq-yBniIDRhUm_4gatrTi3QE-MaRV4srUZl0h6XWQ5Xhwq2nTeaRV56LQ57nT8K4y68V9V5xitmKYQY6rCxne-0X7_4UdyBxLKzLZ54TNUBFKeZbioUrRT2epoyIMI3BRNgDoBPL4VQ"
          />
          <Link href="/" className={`nova-brand ${css({
            fontSize: "headline-md",
            fontWeight: "bold",
            color: "primary",
            display: "flex",
            alignItems: "center",
            gap: "2",
          })}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud
            </span>
            CloudNova
          </Link>
        </div>
        <div className={css({ display: { base: "none", md: "flex" }, alignItems: "center", gap: "lg" })}>
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
        <div className={css({ display: "flex", alignItems: "center", gap: "md", position: "relative" })}>
          
          <Link href="/checkout" className={css({
            position: "relative",
            padding: "2",
            color: "on-surface",
            _hover: { backgroundColor: "surface-container" },
            borderRadius: "full",
            transition: "colors",
          })}>
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_cart</span>
            {cartCount > 0 && (
              <span className={css({
                position: "absolute",
                top: "0",
                right: "0",
                backgroundColor: "error",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                width: "4",
                height: "4",
                borderRadius: "full",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}>
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className={css({ display: "flex", alignItems: "center", gap: "4" })}>
              <div className={css({ position: "relative" })}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "10",
                    height: "10",
                    borderRadius: "full",
                    backgroundColor: "primary",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "lg",
                    _hover: { boxShadow: "md" },
                    transition: "shadow",
                    outline: "none",
                    overflow: "hidden",
                  })}
                >
                  {avatarUrl ? (
                      <img 
                          src={avatarUrl} 
                          alt="User avatar" 
                          className={css({ width: "full", height: "full", objectFit: "cover" })}
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
                  <div className={css({
                    position: "absolute",
                    right: "0",
                    marginTop: "2",
                    width: "48",
                    backgroundColor: "surface",
                    border: "1px solid",
                    borderColor: "outline-variant",
                    borderRadius: "xl",
                    boxShadow: "lg",
                    paddingY: "2",
                    zIndex: "50",
                  })}>
                    <div className={css({
                      paddingX: "4",
                      paddingY: "2",
                      borderBottom: "1px solid",
                      borderColor: "outline-variant",
                      marginBottom: "2",
                    })}>
                      <p className={css({ fontWeight: "medium", color: "on-surface", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{fullName}</p>
                    </div>
                    <Link href="/client" onClick={() => setShowDropdown(false)} className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "3",
                      paddingX: "4",
                      paddingY: "2",
                      color: "on-surface",
                      _hover: { backgroundColor: "surface-container" },
                      transition: "colors",
                    })}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>dashboard</span>
                      Quản lý tài khoản
                    </Link>
                    <button onClick={() => { setShowDropdown(false); handleLogout(); }} className={css({
                      width: "full",
                      display: "flex",
                      alignItems: "center",
                      gap: "3",
                      paddingX: "4",
                      paddingY: "2",
                      color: "error",
                      _hover: { backgroundColor: "error-container/50" },
                      transition: "colors",
                      textAlign: "left",
                    })}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className={css({
                display: { base: "none", md: "block" },
                fontSize: "label-caps",
                fontWeight: "label-caps",
                color: "primary",
                border: "1px solid",
                borderColor: "primary",
                paddingX: "4",
                paddingY: "2",
                borderRadius: "lg",
                _hover: { backgroundColor: "surface-container-low" },
                transition: "colors",
                cursor: "pointer",
                _active: { scale: "0.95" },
                transitionDuration: "200ms",
              })}>
                Đăng nhập
              </Link>
              <Link href="/register" className={`nova-header-register ${css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
                backgroundColor: "primary",
                color: "white",
                paddingX: "4",
                paddingY: "2",
                borderRadius: "lg",
                _hover: { backgroundColor: "primary-container" },
                transition: "colors",
                cursor: "pointer",
                _active: { scale: "0.95" },
                transitionDuration: "200ms",
              })}`}>
                Đăng ký ngay
              </Link>
            </>
          )}
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={css({
            display: { base: "block", md: "none" },
            color: "on-surface",
            marginLeft: "2",
            outline: "none",
          })}>
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={css({
          display: { base: "flex", md: "none" },
          position: "absolute",
          top: "full",
          left: "0",
          width: "full",
          backgroundColor: "surface",
          borderBottom: "1px solid",
          borderColor: "outline-variant",
          boxShadow: "lg",
          paddingY: "4",
          paddingX: "6",
          flexDirection: "column",
          gap: "4",
          zIndex: "40",
        })}>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/")} href="/">Trang chủ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/services")} href="/services">Dịch vụ</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/partners")} href="/partners">Đối tác</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/pricing")} href="/pricing">Bảng giá</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/top-customers")} href="/top-customers">Khách hàng</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/about")} href="/about">Về chúng tôi</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass("/news")} href="/news">Tin tức</Link>
          
          {!token && (
            <div className={css({
              display: "flex",
              flexDirection: "column",
              gap: "2",
              marginTop: "4",
              paddingTop: "4",
              borderTop: "1px solid",
              borderColor: "outline-variant",
            })}>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
                color: "primary",
                border: "1px solid",
                borderColor: "primary",
                paddingX: "4",
                paddingY: "3",
                borderRadius: "lg",
                textAlign: "center",
                _hover: { backgroundColor: "surface-container-low" },
                transition: "colors",
              })}>Đăng nhập</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
                backgroundColor: "primary",
                color: "white",
                paddingX: "4",
                paddingY: "3",
                borderRadius: "lg",
                textAlign: "center",
                _hover: { backgroundColor: "primary-container" },
                transition: "colors",
              })}>Đăng ký ngay</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
