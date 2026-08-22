"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    };

    const navGroups = [
        {
            title: "Hệ thống",
            links: [
                { name: 'Tổng quan', href: '/admin', icon: 'dashboard' },
                { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: 'settings' }
            ]
        },
        {
            title: "Khách hàng & Dịch vụ",
            links: [
                { name: 'Quản lý người dùng', href: '/admin/users', icon: 'group' },
                { name: 'Quản lý Đối tác', href: '/admin/partner-requests', icon: 'handshake' },
                { name: 'Quản lý Máy chủ/VPS', href: '/admin/services', icon: 'dns' },
                { name: 'Đơn hàng & Thanh toán', href: '/admin/orders', icon: 'receipt_long' },
                { name: 'Báo cáo doanh thu', href: '/admin/reports', icon: 'payments' },
            ]
        },
        {
            title: "Nội dung & Truyền thông",
            links: [
                { name: 'Quản lý bài viết', href: '/admin/articles', icon: 'description' },
                { name: 'Trang tĩnh', href: '/admin/pages', icon: 'auto_stories' },
                { name: 'Khuyến mãi', href: '/admin/promotions', icon: 'campaign' },
                { name: 'Thư viện Media', href: '/admin/media', icon: 'perm_media' }
            ]
        }
    ];

    return (
        <AdminGuard>
            <div className="bg-background text-on-background font-body-md text-body-md overflow-hidden h-screen flex">
                
                {/* Sidebar */}
                <aside className="bg-inverse-surface text-on-secondary fixed left-0 top-0 h-full w-[260px] flex flex-col py-lg z-20">
                    <div className="px-lg mb-lg">
                        <h1 className="font-headline-md text-headline-md font-bold text-surface">CloudAdmin</h1>
                        <p className="font-body-sm text-body-sm text-on-secondary/70">Hạ tầng v2.4</p>
                    </div>
                    <nav className="flex-1 flex flex-col gap-unit overflow-y-auto custom-scrollbar">
                        {navGroups.map((group, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="px-lg mb-2 font-label-caps text-label-caps text-on-secondary/50 uppercase tracking-wider">
                                    {group.title}
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {group.links.map((link) => {
                                        const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
                                        return (
                                            <Link 
                                                key={link.name}
                                                href={link.href}
                                                className={`flex items-center gap-md px-md py-sm mx-sm rounded-lg transition-colors duration-200 ${
                                                    isActive 
                                                        ? 'bg-primary-container text-on-primary-container' 
                                                        : 'text-surface-variant hover:text-surface hover:bg-primary-fixed-variant/10'
                                                }`}
                                            >
                                                <span className={`material-symbols-outlined ${isActive ? 'filled-icon' : ''}`} data-icon={link.icon}>{link.icon}</span>
                                                <span className="font-body-md text-body-md">{link.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                    <div className="px-md mt-auto">
                        <div className="flex items-center justify-between gap-2 p-sm rounded-lg hover:bg-primary-fixed-variant/10 transition-colors group">
                            <Link href="/admin/profile" className="flex items-center gap-sm flex-1 min-w-0 cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0">
                                    <img className="w-full h-full object-cover" alt="Admin Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOCaM618_L8wvckuuCRwIbLO4YBhcpgXtfvuSOxdu3Lsy6-cIP571uAixRrdTAnwZla5y-64mDh2ur749axxvDTLvvbHHd2FupknF4oOJhxp0iVlQsV6O1iAzH4e1kNCD-M6nfkm93BzVXXobmtOFA3hiKlGjViAYgJbRTZ2wVQGEBGbZowvIO3VrwudODWirTKqJlb_89NXVGiHHRru0N8Srz3HfOhwttucCEBk0xz3Eol2w3VQ"/>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-body-sm text-body-sm font-medium truncate text-on-secondary group-hover:text-primary-fixed transition-colors">Admin User</p>
                                    <p className="font-body-sm text-body-sm text-on-secondary/70 text-[12px] truncate">admin@cloudnova.com</p>
                                </div>
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="p-1.5 text-error hover:bg-error/20 rounded-md transition-colors shrink-0" 
                                title="Đăng xuất"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col ml-[260px] h-full">
                    
                    {/* Header */}
                    <header className="bg-surface fixed top-0 right-0 left-[260px] h-16 border-b border-outline-variant shadow-sm z-10 flex justify-between items-center px-lg transition-all duration-150">
                        <div className="flex-1 max-w-[28rem] relative">
                            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
                            <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm pl-[36px] pr-sm font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="Tìm kiếm tài nguyên, máy chủ, người dùng..." type="text"/>
                        </div>
                        <div className="flex items-center gap-md">
                            <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
                            </button>
                            <button className="text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
                            </button>
                            <div className="h-8 w-px bg-outline-variant mx-sm"></div>
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 hover:bg-surface-container-low p-1 pr-2 rounded-md transition-colors"
                                >
                                    <span className="text-primary font-body-sm text-body-sm font-medium ml-1">Hồ sơ</span>
                                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 border border-outline-variant">
                                        <img className="w-full h-full object-cover" alt="Admin Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbMEgEupdtqeNJbFCWOuVqd_GjuaVKzdIHU0ql9HU2j1MEyenAXeRddJMIGE7MUcNS8Uck3AfqjloPJhuk4ydEGDAKK_o-bKFfIqpmYJEQUj3Kypy0bk7ZsmbyI7ViTfVBTNqQLK0mEI48pStNag4v7FXjZXJrTd63vPNF2u_p8HRihk1UdYfhcGYFhAPZ2pyqal6y4Oqa5Ql-LGFPchxDabNPkIE5qw3ZXM0WSUwt8WSLwTip1w"/>
                                    </div>
                                    <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
                                </button>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-md shadow-lg border border-outline-variant py-2 z-50">
                                        <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low transition-colors font-body-sm text-body-sm">
                                            <span className="material-symbols-outlined text-lg">person</span>
                                            Thông tin cá nhân
                                        </Link>
                                        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low transition-colors font-body-sm text-body-sm">
                                            <span className="material-symbols-outlined text-lg">settings</span>
                                            Cài đặt
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

                    <main className="flex-1 overflow-y-auto mt-16 p-lg bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
