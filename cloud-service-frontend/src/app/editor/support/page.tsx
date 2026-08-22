"use client";

import React from 'react';

export default function EditorSupportPage() {
    return (
        <div className="max-w-[1000px] mx-auto w-full space-y-lg pb-xl">
            <div className="text-center mb-xl">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Trung tâm Hỗ trợ</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[672px] mx-auto">Tài liệu hướng dẫn sử dụng và giải đáp các thắc mắc thường gặp dành cho đội ngũ Biên tập viên.</p>
                
                <div className="relative max-w-[576px] mx-auto mt-lg">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input className="w-full bg-surface border border-outline-variant rounded-full pl-12 pr-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary shadow-sm transition-all" placeholder="Tìm kiếm câu hỏi, ví dụ: 'Làm sao để chèn ảnh?'" type="text"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-md">
                    <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-md">Câu hỏi thường gặp (FAQ)</h3>
                    
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-md cursor-pointer hover:border-primary transition-colors">
                        <h4 className="font-body-md font-semibold text-on-surface mb-1 flex items-center justify-between">
                            Làm sao để xuất bản một bài viết?
                            <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                        </h4>
                    </div>

                    <div className="bg-surface rounded-xl border border-primary shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-md">
                        <h4 className="font-body-md font-semibold text-primary mb-2 flex items-center justify-between">
                            Kích thước ảnh thumbnail chuẩn là bao nhiêu?
                            <span className="material-symbols-outlined text-primary">expand_less</span>
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Để hiển thị đẹp nhất trên tất cả các thiết bị, bạn nên tải lên ảnh Thumbnail có kích thước chuẩn là <strong>1200x630 pixel</strong>, tỷ lệ 16:9 và dung lượng không vượt quá 2MB.</p>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-md cursor-pointer hover:border-primary transition-colors">
                        <h4 className="font-body-md font-semibold text-on-surface mb-1 flex items-center justify-between">
                            Có thể khôi phục bài viết đã xóa không?
                            <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                        </h4>
                    </div>
                </div>

                <div className="space-y-lg">
                    <div className="bg-primary-container/30 rounded-xl p-lg border border-primary/20 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-md">
                            <span className="material-symbols-outlined text-[32px]">support_agent</span>
                        </div>
                        <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Cần hỗ trợ trực tiếp?</h3>
                        <p className="font-body-sm text-on-surface-variant mb-lg">Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn 24/7 qua hệ thống Ticket.</p>
                        <button className="bg-primary text-on-primary font-body-md px-6 py-2 rounded-lg font-medium hover:bg-primary-container transition-colors w-full sm:w-auto">
                            Tạo Ticket Hỗ Trợ
                        </button>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-body-md font-semibold text-on-surface mb-md">Tài nguyên hữu ích</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary">menu_book</span>
                                    <span className="font-body-sm">Cẩm nang hướng dẫn sử dụng Editor</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary">play_circle</span>
                                    <span className="font-body-sm">Video hướng dẫn cơ bản</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary">policy</span>
                                    <span className="font-body-sm">Chính sách xuất bản nội dung</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
