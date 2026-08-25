"use client";

import React from 'react';

export default function EditorSettingsPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Cài đặt Biên tập viên</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Tuỳ chỉnh cách hiển thị nội dung và quản lý bình luận.</p>
                </div>
                <button className="bg-primary text-on-primary font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto">
                    <span className="material-symbols-outlined">save</span>
                    Lưu cấu hình
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-1">
                    <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">Quản lý Bình luận</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Cấu hình việc duyệt và hiển thị bình luận trên các bài viết blog.</p>
                </div>
                <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg space-y-md">
                    <div className="flex items-center justify-between p-md border border-outline-variant rounded-lg">
                        <div>
                            <p className="font-body-md text-body-md text-on-surface font-medium">Bật hệ thống bình luận</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Cho phép người dùng để lại bình luận dưới bài viết.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-md border border-outline-variant rounded-lg">
                        <div>
                            <p className="font-body-md text-body-md text-on-surface font-medium">Duyệt bình luận thủ công</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Bình luận phải được biên tập viên duyệt trước khi hiển thị.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <div className="lg:col-span-1 mt-lg lg:mt-0">
                    <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">Hiển thị Blog</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Số lượng bài viết trên mỗi trang và định dạng ngày tháng.</p>
                </div>
                <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg space-y-md">
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-[8px] uppercase">Số bài viết trên 1 trang</label>
                        <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[8px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-[8px] uppercase">Định dạng ngày tháng</label>
                        <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[8px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
