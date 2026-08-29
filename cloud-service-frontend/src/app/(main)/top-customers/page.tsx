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
 createdAt: string;
}

interface ServicePlanQr {
 id: string;
 name: string;
 description: string;
 isActive: boolean;
 qrCodeBase64?: string | null;
 category?: { name?: string } | null;
}

function resolveQrImage(value?: string | null) {
 if (!value) return null;
 return value.startsWith('data:image/') ? value : `data:image/png;base64,${value}`;
}

export default function TopCustomersPage() {
 const [vipCustomers, setVipCustomers] = useState<VipCustomer[]>([]);
 const [reviews, setReviews] = useState<Review[]>([]);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [loadingVip, setLoadingVip] = useState(true);
 const [loadingReviews, setLoadingReviews] = useState(false);
 const [selectedReview, setSelectedReview] = useState<Review | null>(null);
 const [servicePlans, setServicePlans] = useState<ServicePlanQr[]>([]);
 const [loadingPlans, setLoadingPlans] = useState(true);
 const [reviewRating, setReviewRating] = useState(5);
 const [reviewContent, setReviewContent] = useState('');
 const [reviewSubmitting, setReviewSubmitting] = useState(false);
 const [reviewMessage, setReviewMessage] = useState('');
 const [reviewError, setReviewError] = useState('');

 useEffect(() => {
 fetch('/api/ServicePlans?PageNumber=1&PageSize=50')
 .then(res => res.ok ? res.json() : Promise.reject(new Error('Không thể tải gói dịch vụ')))
 .then(data => setServicePlans((data.data || []).filter((plan: ServicePlanQr) => plan.isActive)))
 .catch(err => console.error("Failed to fetch service plans:", err))
 .finally(() => setLoadingPlans(false));
 }, []);

 useEffect(() => {
 // Fetch VIP Customers
 fetch('/api/Users/vip?limit=3')
 .then(res => {
 if (!res.ok) throw new Error("HTTP error " + res.status);
 return res.json();
 })
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
 fetch(`/api/Reviews?page=${pageToFetch}&pageSize=3`)
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
 // Use setTimeout to avoid setState in effect warning
 setTimeout(() => fetchReviews(1), 0);
 }, []);

 const handlePageChange = (newPage: number) => {
 if (!loadingReviews && newPage >= 1 && newPage <= totalPages) {
 setPage(newPage);
 fetchReviews(newPage);
 }
 };

 const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setReviewMessage('');
 setReviewError('');

 const content = reviewContent.trim();
 if (!content) {
 setReviewError('Vui lòng nhập nội dung đánh giá.');
 return;
 }
 if (content.length > 1000) {
 setReviewError('Nội dung đánh giá không được vượt quá 1000 ký tự.');
 return;
 }

 const token = window.localStorage.getItem('token');
 if (!token) {
 setReviewError('Vui lòng đăng nhập để gửi đánh giá.');
 return;
 }

 setReviewSubmitting(true);
 try {
 const response = await fetch('/api/Reviews', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({ rating: reviewRating, content }),
 });
 const data = await response.json().catch(() => null);
 if (!response.ok) {
 throw new Error(data?.message || data || 'Không thể gửi đánh giá.');
 }

 setReviewContent('');
 setReviewRating(5);
 setReviewMessage('Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận.');
 fetchReviews(1);
 setPage(1);
 } catch (error) {
 setReviewError(error instanceof Error ? error.message : 'Không thể gửi đánh giá.');
 } finally {
 setReviewSubmitting(false);
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
 stars.push(<span key={i} className="material-symbols-outlined text-gray-300 " style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star</span>);
 }
 }
 return stars;
 };

 return (
 <div className="public-content bg-background min-h-screen route-fade-in">
 <Head>
 <title>Top Khách hàng & Đánh giá | CloudNova</title>
 </Head>
 <main className="flex-grow pt-[104px] pb-10 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
 {/* VIP Leaderboard Section */}
 <section className="mb-16">
 <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Bảng Xếp Hạng Khách Hàng VIP</h1>
 <p className="text-lg text-gray-600 text-center w-full max-w-[800px] mx-auto mb-10">
 Vinh danh những doanh nghiệp hàng đầu đã tin tưởng và đồng hành cùng cơ sở hạ tầng đám mây cao cấp của CloudNova.
 </p>
 <div className="interactive-card bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-xl overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[500px]">
 <thead>
 <tr className="bg-gray-50 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 ">
 <th className="py-4 px-6 w-24 text-center">Hạng</th>
 <th className="py-4 px-6">Khách Hàng</th>
 <th className="py-4 px-6 hidden md:table-cell">Doanh Nghiệp</th>
 <th className="py-4 px-6 hidden lg:table-cell">Gói Dịch Vụ</th>
 <th className="py-4 px-6 text-right">Tổng Chi Tiêu</th>
 </tr>
 </thead>
 <tbody className="text-gray-800 ">
 {loadingVip ? (
 <tr>
 <td colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
 </tr>
 ) : vipCustomers.map((customer, index) => {
 // Row styling based on rank
 let rowClass = "hover:bg-indigo-50 border-b border-gray-200 transition-colors ";
 let iconClass = "material-symbols-outlined mx-auto ";
 let iconName = "military_tech";
 let avatarBorderClass = "border-2 object-cover w-10 h-10 rounded-full ";

 if (index === 0) {
 rowClass += "bg-gradient-to-r from-yellow-50 to-transparent ";
 iconClass += "text-yellow-500";
 iconName = "emoji_events";
 avatarBorderClass += "border-yellow-400";
 } else if (index === 1) {
 rowClass += "bg-gradient-to-r from-gray-50 to-transparent ";
 iconClass += "text-gray-400";
 avatarBorderClass += "border-gray-300";
 } else if (index === 2) {
 rowClass += "bg-gradient-to-r from-orange-50 to-transparent ";
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
 <td className="py-4 px-6 hidden md:table-cell text-gray-600 ">{customer.company}</td>
 <td className="py-4 px-6 hidden lg:table-cell text-primary text-sm font-medium">{customer.topPlan}</td>
 <td className="py-4 px-6 text-right text-sm font-semibold">
 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpending)}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 
 {/* Service Plans and QR Section */}
 <section className="mb-16">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
 <div className="md:flex-1">
 <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Dịch vụ nổi bật</p>
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Mã QR theo từng gói dịch vụ</h2>
 </div>
 <p className="text-sm text-gray-500 md:w-80 md:text-right">Quét mã để xem nhanh thông tin gói và mức giá hiện có.</p>
 </div>
 {loadingPlans ? (
 <p className="text-gray-500 ">Đang tải gói dịch vụ...</p>
 ) : servicePlans.length === 0 ? (
 <p className="text-gray-500 ">Chưa có gói dịch vụ khả dụng.</p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {servicePlans.map(plan => (
 <article key={plan.id} className="interactive-card bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex gap-4 items-center">
 <div className="w-28 h-28 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-2">
 {plan.qrCodeBase64 ? (
 <img src={resolveQrImage(plan.qrCodeBase64) || ''} alt={`Mã QR gói ${plan.name}`} className="w-full h-full object-contain" />
 ) : (
 <span className="text-center text-xs text-gray-500">Chưa có mã QR</span>
 )}
 </div>
 <div className="min-w-0">
 <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 ">{plan.category?.name || 'Cloud'}</p>
 <h3 className="font-bold text-gray-900 mt-1">{plan.name}</h3>
 <p className="text-sm text-gray-500 line-clamp-3 mt-1">{plan.description}</p>
 </div>
 </article>
 ))}
 </div>
 )}
 </section>
 {/* Customer Review Form */}
 <section className="interactive-card mb-16 rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm md:p-8">
 <div className="mb-6">
 <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Chia sẻ trải nghiệm</p>
 <h2 className="mt-2 text-2xl font-bold text-gray-900">Đánh giá dịch vụ CloudNova</h2>
 <p className="mt-2 text-gray-600">Đăng nhập để gửi đánh giá và chia sẻ trải nghiệm của bạn với cộng đồng.</p>
 </div>
 <form onSubmit={handleReviewSubmit} className="space-y-5">
 <div>
 <label className="mb-2 block text-sm font-semibold text-gray-800 ">Mức độ hài lòng</label>
 <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
 {[1, 2, 3, 4, 5].map(star => (
 <button
 key={star}
 type="button"
 onClick={() => setReviewRating(star)}
 aria-label={`${star} sao`}
 aria-pressed={reviewRating === star}
 className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 <span className={`material-symbols-outlined text-3xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300 '}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
 </button>
 ))}
 <span className="ml-2 text-sm text-gray-500 ">{reviewRating}/5</span>
 </div>
 </div>
 <div>
 <label htmlFor="customer-review-content" className="mb-2 block text-sm font-semibold text-gray-800 ">Nội dung đánh giá</label>
 <textarea
 id="customer-review-content"
 value={reviewContent}
 onChange={event => setReviewContent(event.target.value)}
 maxLength={1000}
 rows={4}
 required
 placeholder="Hãy chia sẻ trải nghiệm của bạn..."
 className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 "
 />
 <p className="mt-1 text-right text-xs text-gray-500 ">{reviewContent.length}/1000</p>
 </div>
 {reviewError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ">{reviewError}</p>}
 {reviewMessage && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ">{reviewMessage}</p>}
 <button type="submit" disabled={reviewSubmitting} className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
 {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
 </button>
 </form>
 </section>

 {/* Testimonials Section */}
 <section>
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Đánh Giá Từ Khách Hàng</h2>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {reviews.map(review => (
 <div key={review.id} className="interactive-card bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-[280px]">
 <div className="flex items-center gap-3 mb-4">
 <img alt={review.reviewerName} className="w-12 h-12 rounded-full object-cover" src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=random`} />
 <div>
 <h3 className="font-semibold text-gray-900 ">{review.reviewerName}</h3>
 <p className="text-sm text-gray-500 line-clamp-1">{review.reviewerTitle}</p>
 {review.createdAt && (
 <p className="text-xs text-gray-400 mt-0.5">
 {new Date(review.createdAt).toLocaleDateString('vi-VN')}
 </p>
 )}
 </div>
 </div>
 <div className="flex mb-3">
 {renderStars(review.rating)}
 </div>
 <div className="flex-grow overflow-hidden">
 <p className="text-gray-600 italic line-clamp-3">&ldquo;{review.content}&rdquo;</p>
 </div>
 <button 
 onClick={() => setSelectedReview(review)}
 className="mt-2 text-indigo-600 font-medium text-sm hover:underline text-left self-start"
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
 className={`w-10 h-10 flex items-center justify-center rounded-lg border ${page === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 '} transition-colors`}
 >
 <span className="material-symbols-outlined text-sm">arrow_back</span>
 </button>
 
 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
 <button
 key={p}
 onClick={() => handlePageChange(p)}
 disabled={loadingReviews}
 className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${page === p ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50 '} ${loadingReviews ? 'opacity-70 cursor-wait' : ''}`}
 >
 {p}
 </button>
 ))}

 <button 
 onClick={() => handlePageChange(page + 1)}
 disabled={page === totalPages || loadingReviews}
 className={`w-10 h-10 flex items-center justify-center rounded-lg border ${page === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 '} transition-colors`}
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
 className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-[600px] min-w-[300px] sm:min-w-[500px] shadow-2xl relative overflow-hidden" 
 onClick={e => e.stopPropagation()}
 >
 <button 
 onClick={() => setSelectedReview(null)}
 className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 w-8 h-8 flex justify-center items-center rounded-full"
 >
 <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 600" }}>close</span>
 </button>
 
 <div className="flex items-center gap-4 mb-6 pr-8">
 <img alt={selectedReview.reviewerName} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-indigo-100 " src={selectedReview.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.reviewerName)}&background=random`} />
 <div>
 <h3 className="text-xl font-bold text-gray-900 ">{selectedReview.reviewerName}</h3>
 <p className="text-gray-500 ">{selectedReview.reviewerTitle}</p>
 {selectedReview.createdAt && (
 <p className="text-sm text-gray-400 mt-1">
 {new Date(selectedReview.createdAt).toLocaleDateString('vi-VN')}
 </p>
 )}
 </div>
 </div>
 <div className="flex mb-6 bg-yellow-50 p-3 rounded-lg w-fit">
 {renderStars(selectedReview.rating)}
 </div>
 <div className="max-h-[50vh] overflow-y-auto pr-2 pb-2">
 <p className="text-gray-700 text-lg leading-relaxed italic">
 &ldquo;{selectedReview.content}&rdquo;
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
