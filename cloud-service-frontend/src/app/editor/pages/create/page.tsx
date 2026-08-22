"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

function StaticPageForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (editId) {
            const fetchPage = async () => {
                try {
                    const res = await fetch(`http://localhost:5154/api/StaticPages/${editId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setTitle(data.title);
                        setSlug(data.slug);
                        setContent(data.content || '');
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchPage();
        }
        setIsLoaded(true);
    }, [editId]);

    const handleSave = async (isPublished: boolean) => {
        if (!title.trim() || !slug.trim()) {
            alert('Vui lòng nhập tiêu đề và đường dẫn (slug) cho trang!');
            return;
        }

        setIsSaving(true);
        try {
            const url = editId 
                ? `http://localhost:5154/api/StaticPages/${editId}` 
                : 'http://localhost:5154/api/StaticPages';
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                    isPublished
                })
            });

            if (res.ok) {
                router.push(`${basePath}/pages`);
            } else {
                alert('Có lỗi xảy ra khi lưu trang.');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi mạng khi lưu trang.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="max-w-[1000px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex items-center gap-sm mb-lg">
                <Link href={`${basePath}/pages`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Tạo trang tĩnh mới</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tạo nội dung cho trang Giới thiệu, Điều khoản...</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-2 space-y-lg">
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="Nhập tiêu đề trang..." 
                                className="w-full bg-transparent border-none font-headline-lg text-[24px] font-semibold text-on-surface placeholder:text-outline focus:outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-md">
                            <div className="flex items-center text-on-surface-variant font-body-sm bg-surface-container-low px-3 py-2 rounded">
                                <span className="opacity-70">http://localhost:3000/</span>
                                <input 
                                    type="text" 
                                    placeholder="duong-dan-cua-ban" 
                                    className="bg-transparent border-none focus:outline-none flex-grow ml-1 text-primary"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-md border-y border-outline-variant py-2">
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                            <div className="w-px h-6 bg-outline-variant mx-1"></div>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                            <div className="w-px h-6 bg-outline-variant mx-1"></div>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">link</span></button>
                            <button className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">image</span></button>
                        </div>
                        <textarea 
                            className="w-full h-[400px] bg-transparent border-none font-body-md text-body-md text-on-surface focus:outline-none resize-none"
                            placeholder="Bắt đầu viết nội dung của bạn tại đây..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-md">
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-md">Xuất bản</h3>
                        <div className="space-y-sm mb-md">
                            <p className="font-body-sm text-on-surface-variant flex items-center justify-between">
                                <span>Trạng thái:</span>
                                <span className="font-medium text-on-surface">Bài mới</span>
                            </p>
                            <p className="font-body-sm text-on-surface-variant flex items-center justify-between">
                                <span>Hiển thị:</span>
                                <span className="font-medium text-on-surface">Công khai</span>
                            </p>
                        </div>
                        <div className="flex gap-sm">
                            <button 
                                onClick={() => handleSave(false)} 
                                disabled={isSaving}
                                className="flex-1 py-2 rounded-lg border border-outline-variant font-body-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50">
                                Lưu nháp
                            </button>
                            <button 
                                onClick={() => handleSave(true)} 
                                disabled={isSaving}
                                className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
                                Đăng trang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateStaticPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StaticPageForm />
        </Suspense>
    );
}
