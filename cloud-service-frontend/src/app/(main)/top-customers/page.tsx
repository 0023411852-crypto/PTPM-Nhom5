"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface VipCustomer {
    id: string;
    fullName: string;
    company: string;
    avatarUrl: string;
    totalSpending: number;
    topPlan: string;
}

interface Review {
    id: string;
    reviewerName: string;
    reviewerTitle: string;
    reviewerAvatar: string;
    rating: number;
    content: string;
}

export default function TopCustomersPage() {
    const [vipCustomers, setVipCustomers] = useState<VipCustomer[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingVip, setLoadingVip] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
        // Fetch VIP Customers
        fetch('http://localhost:5154/api/Users/vip?limit=3')
            .then(res => res.json())
            .then(data => {
                setVipCustomers(data);
                setLoadingVip(false);
            })
            .catch(err => {
                console.error("Failed to fetch VIP customers:", err);
                setLoadingVip(false);
            });
    }, []);

    const fetchReviews = (pageToFetch: number) => {
        setLoadingReviews(true);
        fetch(`http://localhost:5154/api/Users/reviews?page=${pageToFetch}&pageSize=3`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.items);
                setTotalPages(Math.ceil(data.totalCount / data.pageSize));
                setLoadingReviews(false);
            })
            .catch(err => {
                console.error("Failed to fetch reviews:", err);
                setLoadingReviews(false);
            });
    };

    useEffect(() => {
        fetchReviews(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (!loadingReviews && newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchReviews(newPage);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="material-symbols-outlined text-yellow-400" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="material-symbols-outlined text-yellow-400" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star_half</span>);
            } else {
                stars.push(<span key={i} className="material-symbols-outlined text-gray-300 dark:text-gray-600" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star</span>);
            }
        }
        return stars;
    };

    return (
        <div className="bg-background min-h-screen">
            <Head>
                <title>Top Khách hàng & Đánh giá | CloudNova</title>
            </Head>
            <main className="flex-grow pt-[104px] pb-10 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
                {/* VIP Leaderboard Section */}
                <section className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">Bảng Xếp Hạng Khách Hàng VIP</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center w-full max-w-[800px] mx-auto mb-10">
                        Vinh danh những doanh nghiệp hàng đầu đã tin tưởng và đồng hành cùng cơ sở hạ tầng đám mây cao cấp của CloudNova.
                    </p>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-4 px-6 w-24 text-center">Hạng</th>
                                    <th className="py-4 px-6">Khách Hàng</th>
                                    <th className="py-4 px-6 hidden md:table-cell">Doanh Nghiệp</th>
                                    <th className="py-4 px-6 hidden lg:table-cell">Gói Dịch Vụ</th>
                                    <th className="py-4 px-6 text-right">Tổng Chi Tiêu</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 dark:text-gray-200">
                                {loadingVip ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : vipCustomers.map((customer, index) => {
                                    // Row styling based on rank
                                    let rowClass = "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors ";
                                    let iconClass = "material-symbols-outlined mx-auto ";
                                    let iconName = "military_tech";
                                    let avatarBorderClass = "border-2 object-cover w-10 h-10 rounded-full ";

                                    if (index === 0) {
                                        rowClass += "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10";
                                        iconClass += "text-yellow-500";
                                        iconName = "emoji_events";
                                        avatarBorderClass += "border-yellow-400";
                                    } else if (index === 1) {
                                        rowClass += "bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/30";
                                        iconClass += "text-gray-400";
                                        avatarBorderClass += "border-gray-300";
                                    } else if (index === 2) {
                                        rowClass += "bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10";
                                        iconClass += "text-orange-400";
                                        avatarBorderClass += "border-orange-300";
                                    }

                                    return (
                                        <tr key={customer.id} className={rowClass}>
                                            <td className="py-4 px-6 text-center">
                                                <span className={iconClass} style={{ fontVariationSettings: "'FILL' 1", fontSize: '24px' }}>{iconName}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img alt={customer.fullName} className={avatarBorderClass} src={customer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName)}&background=random`} />
                                                    <span className="font-semibold">{customer.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 hidden md:table-cell text-gray-600 dark:text-gray-400">{customer.company}</td>
                                            <td className="py-4 px-6 hidden lg:table-cell text-primary dark:text-primary-fixed text-sm font-medium">{customer.topPlan}</td>
                                            <td className="py-4 px-6 text-right text-sm font-semibold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpending)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">Đánh Giá Từ Khách Hàng</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-[280px]">
                                <div className="flex items-center gap-3 mb-4">
                                    <img alt={review.reviewerName} className="w-12 h-12 rounded-full object-cover" src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=random`} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{review.reviewerName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{review.reviewerTitle}</p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {renderStars(review.rating)}
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-gray-600 dark:text-gray-300 italic line-clamp-3">"{review.content}"</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedReview(review)}
                                    className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline text-left self-start"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination / Load More Button */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1 || loadingReviews}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${page === 1 ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'} transition-colors`}
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    disabled={loadingReviews}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${page === p ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'} ${loadingReviews ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages || loadingReviews}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${page === totalPages ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'} transition-colors`}
                            >
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Review Detail Modal */}
            {selectedReview && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm" 
                    onClick={() => setSelectedReview(null)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-[600px] min-w-[300px] sm:min-w-[500px] shadow-2xl relative overflow-hidden" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedReview(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700 w-8 h-8 flex justify-center items-center rounded-full"
                        >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 600" }}>close</span>
                        </button>
                        
                        <div className="flex items-center gap-4 mb-6 pr-8">
                            <img alt={selectedReview.reviewerName} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-indigo-100 dark:border-indigo-900" src={selectedReview.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.reviewerName)}&background=random`} />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReview.reviewerName}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{selectedReview.reviewerTitle}</p>
                            </div>
                        </div>
                        <div className="flex mb-6 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg w-fit">
                            {renderStars(selectedReview.rating)}
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto pr-2 pb-2">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                                "{selectedReview.content}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
