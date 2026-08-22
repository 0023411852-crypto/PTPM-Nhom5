"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Article } from '../page'; // Import type

function EditorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Cloud');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (editId) {
            const stored = localStorage.getItem('editor_articles');
            if (stored) {
                const articles: Article[] = JSON.parse(stored);
                const article = articles.find(a => a.id === editId);
                if (article) {
                    setTitle(article.title);
                    setContent(article.content || '');
                    setCategory(article.category);
                    setThumbnailUrl(article.thumbnailUrl || '');
                }
            }
        }
        setIsLoaded(true);
    }, [editId]);

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5154/api/Upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setThumbnailUrl('http://localhost:5154' + data.url);
            } else {
                alert('Tải ảnh thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi tải ảnh.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = (status: 'Bản nháp' | 'Đã xuất bản') => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề bài viết!');
            return;
        }

        const stored = localStorage.getItem('editor_articles');
        let articles: Article[] = stored ? JSON.parse(stored) : [];

        if (editId) {
            // Update
            articles = articles.map(a => 
                a.id === editId 
                    ? { ...a, title, content, category, status, thumbnailUrl } 
                    : a
            );
        } else {
            // Create
            const newArticle: Article = {
                id: Date.now().toString(),
                title,
                content,
                category,
                thumbnailUrl,
                authorName: 'Admin', // Giả lập user hiện tại
                viewCount: 0,
                isPublished: status === 'Đã xuất bản',
                createdAt: new Date().toISOString()
            };
            articles = [newArticle, ...articles];
        }

        localStorage.setItem('editor_articles', JSON.stringify(articles));
        router.push(`${basePath}/articles`);
    };

    if (!isLoaded) return null;

    return (
        <div className="max-w-[1000px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex items-center gap-sm mb-lg">
                <Link href={`${basePath}/articles`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                        {editId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {editId ? 'Cập nhật lại nội dung của bạn.' : 'Tạo nội dung mới để xuất bản lên website.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-2 space-y-lg">
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <input 
                            type="text" 
                            placeholder="Nhập tiêu đề bài viết..." 
                            className="w-full bg-transparent border-none font-headline-lg text-[24px] font-semibold text-on-surface placeholder:text-outline focus:outline-none mb-md"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
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
                                <span className="font-medium text-on-surface">{editId ? 'Đang sửa' : 'Bài mới'}</span>
                            </p>
                            <p className="font-body-sm text-on-surface-variant flex items-center justify-between">
                                <span>Hiển thị:</span>
                                <span className="font-medium text-on-surface">Công khai</span>
                            </p>
                        </div>
                        <div className="flex gap-sm">
                            <button onClick={() => handleSave('Bản nháp')} className="flex-1 py-2 rounded-lg border border-outline-variant font-body-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">Lưu nháp</button>
                            <button onClick={() => handleSave('Đã xuất bản')} className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm">Đăng bài</button>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-sm">Chuyên mục</h3>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                            {['Cloud', 'VPS', 'Web Hosting', 'Tên miền', 'Bảo mật', 'Kỹ thuật'].map(cat => (
                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="category"
                                        checked={category === cat}
                                        onChange={() => setCategory(cat)}
                                        className="w-4 h-4 rounded-full border-outline-variant text-primary focus:ring-primary/20 accent-primary" 
                                    />
                                    <span className="font-body-sm text-on-surface">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-sm">Ảnh đại diện</h3>
                        <div className="relative w-full aspect-video border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center text-on-surface-variant overflow-hidden group hover:border-primary transition-colors cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleUploadImage}
                                disabled={isUploading}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[32px] mb-2 group-hover:text-primary transition-colors">add_photo_alternate</span>
                                    <span className="font-body-sm group-hover:text-primary transition-colors">{isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}</span>
                                </>
                            )}
                        </div>
                        {thumbnailUrl && (
                            <button 
                                onClick={() => setThumbnailUrl('')}
                                className="mt-2 text-[13px] text-error hover:underline w-full text-center"
                            >
                                Gỡ ảnh
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateArticlePage() {
    return (
        <Suspense fallback={<div className="p-xl text-center">Đang tải bộ soạn thảo...</div>}>
            <EditorForm />
        </Suspense>
    );
}
