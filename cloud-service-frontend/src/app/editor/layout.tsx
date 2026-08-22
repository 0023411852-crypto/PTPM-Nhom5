"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'Editor') {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    };

    const navLinks = [
        { name: 'Tổng quan', href: '/editor', icon: 'dashboard' },
        { name: 'Quản lý bài viết', href: '/editor/articles', icon: 'description' },
        { name: 'Trang tĩnh', href: '/editor/pages', icon: 'auto_stories' },
        { name: 'Khuyến mãi', href: '/editor/promotions', icon: 'campaign' },
        { name: 'Thư viện Media', href: '/editor/media', icon: 'perm_media' },
    ];

    const bottomLinks = [
        { name: 'Cài đặt', href: '/editor/settings', icon: 'settings' },
        { name: 'Hỗ trợ', href: '/editor/support', icon: 'help_outline' },
    ];

    return (
        <div className="bg-background text-on-surface font-body-md antialiased overflow-hidden h-screen flex">
            
            <nav className="fixed left-0 top-0 h-full w-[260px] bg-on-secondary-fixed dark:bg-on-background flex flex-col py-lg px-md border-r border-outline-variant/20 z-20">
                <div className="flex items-center gap-3 mb-xl px-sm">
                    <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-surface-container-lowest">
                        <span className="material-symbols-outlined text-[20px]">cloud</span>
                    </div>
                    <div>
                        <h1 className="font-headline-md text-headline-md font-bold text-surface-container-lowest leading-tight">CloudNova</h1>
                        <p className="font-body-sm text-body-sm text-surface-variant/70 leading-tight">Bảng điều khiển Biên tập viên</p>
                    </div>
                </div>

                <Link href="/editor/articles/create" className="w-full bg-primary-container text-on-primary-container font-body-md text-body-md py-2 px-4 rounded-lg flex items-center justify-center gap-2 mb-lg hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                    Bài viết mới
                </Link>

                <ul className="flex flex-col gap-1 flex-1">
                    {navLinks.map((link) => {
                        const isActive = link.href === '/editor' ? pathname === '/editor' : pathname.startsWith(link.href);
                        return (
                            <li key={link.name}>
                                <Link 
                                    href={link.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md transition-all duration-200 ${
                                        isActive 
                                            ? 'text-surface-container-lowest bg-primary-container/20 border-r-4 border-primary-container' 
                                            : 'text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest'
                                    }`}
                                >
                                    <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto pt-lg border-t border-outline-variant/10">
                    <ul className="flex flex-col gap-1">
                        {bottomLinks.map(link => (
                            <li key={link.name}>
                                <Link 
                                    href={link.href}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors"
                                >
                                    <span className="material-symbols-outlined">{link.icon}</span>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-error/10 hover:text-error transition-colors text-left"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="flex-1 ml-[260px] flex flex-col min-w-0">
                <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface dark:bg-surface-dim border-b border-outline-variant flex justify-between items-center px-lg z-10">
                    <div className="flex items-center gap-lg flex-1">
                        <span className="font-headline-md text-headline-md text-on-surface whitespace-nowrap">Tổng quan</span>
                        <div className="relative w-64 hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                            <input className="w-full bg-surface-container-low border border-outline-variant rounded-md pl-10 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Tìm kiếm..." type="text"/>
                        </div>
                    </div>

                    <div className="flex items-center gap-md">
                        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        
                        <div className="w-px h-6 bg-outline-variant mx-2"></div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 hover:bg-surface-container-low p-1 pr-2 rounded-md transition-colors"
                            >
                                <span className="text-primary font-body-sm text-body-sm font-medium ml-1">Hồ sơ</span>
                                <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center text-on-surface">
                                    <span className="material-symbols-outlined">account_circle</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
                            </button>
                            
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-md shadow-lg border border-outline-variant py-2 z-50">
                                    <Link href="/editor/profile" className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low transition-colors font-body-sm text-body-sm">
                                        <span className="material-symbols-outlined text-lg">person</span>
                                        Thông tin cá nhân
                                    </Link>
                                    <div className="h-px bg-outline-variant my-1"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-error hover:bg-error-container hover:text-on-error-container transition-colors font-body-sm text-body-sm text-left"
                                    >
                                        <span className="material-symbols-outlined text-lg">logout</span>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto mt-16 p-lg bg-surface dark:bg-surface-dim">
                    {children}
                </main>
            </div>
        </div>
    );
}
