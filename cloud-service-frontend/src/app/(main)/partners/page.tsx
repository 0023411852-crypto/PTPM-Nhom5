"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/admin/Modal';

export default function PartnersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promotionMethod, setPromotionMethod] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: '1900 xxxx', email: 'contact@cloudnova.vn' });
    const [promotionDetails, setPromotionDetails] = useState('');

    useEffect(() => {
        fetch('http://localhost:5154/api/SiteSettings/public')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const phoneSetting = data.find(s => s.key === 'PhoneNumber');
                    const emailSetting = data.find(s => s.key === 'ContactEmail');
                    
                    setContactInfo({
                        phone: phoneSetting ? phoneSetting.value : '1900 xxxx',
                        email: emailSetting ? emailSetting.value : 'contact@cloudnova.vn'
                    });
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:5154/api/PartnerRequests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    websiteUrl,
                    promotionMethod,
                    promotionDetails
                })
            });

            if (res.ok) {
                alert('Đăng ký đối tác thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
                setIsModalOpen(false);
                setFullName('');
                setEmail('');
                setWebsiteUrl('');
                setPromotionMethod('');
                setPromotionDetails('');
            } else {
                const data = await res.json();
                alert(`Lỗi: ${data.message || 'Không thể đăng ký.'}`);
            }
        } catch (error) {
            alert('Lỗi kết nối đến server.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative pt-3xl pb-2xl px-gutter overflow-hidden bg-surface">
                <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-container-max mx-auto relative z-10 pt-16">
                    <div className="glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-xl md:p-3xl max-w-[48rem] mx-auto text-center border border-outline-variant/30">
                        <h1 className="font-display-lg text-display-lg text-on-background mb-md hidden md:block">
                            Trở thành Đối tác của CloudNova
                        </h1>
                        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md md:hidden">
                            Trở thành Đối tác của CloudNova
                        </h1>
                        <p className="font-body-lg text-body-lg text-secondary mb-xl">
                            Mở rộng kinh doanh và gia tăng lợi nhuận cùng hệ sinh thái Cloud hàng đầu khu vực.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-md">
                            <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary font-body-md text-body-md font-semibold px-lg py-md rounded-lg shadow-sm hover:bg-primary/90 transition-all hover:shadow-md">
                                Đăng ký ngay
                            </button>
                            <a href="#policies" className="inline-flex items-center justify-center bg-transparent border border-primary text-primary font-body-md text-body-md font-semibold px-lg py-md rounded-lg hover:bg-primary/5 transition-all">
                                Xem chính sách
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-xl bg-surface-container-lowest border-y border-outline-variant/30">
                <div className="max-w-container-max mx-auto px-gutter text-center mb-lg">
                    <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
                        Được tin tưởng bởi các đối tác hàng đầu
                    </p>
                </div>
                <div className="marquee-container py-md">
                    <div className="marquee-content flex gap-3xl items-center text-secondary opacity-60">
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">VNG</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">Viettel IDC</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">FPT</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">CMC</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">Google Cloud</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">AWS</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">VNG</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">Viettel IDC</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">FPT</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">CMC</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">Google Cloud</span>
                        <span className="font-headline-md text-headline-md font-bold tracking-tighter">AWS</span>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-3xl px-gutter bg-background">
                <div className="max-w-container-max mx-auto">
                    <div className="text-center mb-2xl">
                        <h2 className="font-headline-lg text-headline-lg text-on-background hidden md:block">Lợi ích hợp tác</h2>
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background md:hidden">Lợi ích hợp tác</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        {/* Card 1 */}
                        <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-md group-hover:bg-primary-container/20 transition-colors">
                                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-background mb-sm">Hoa hồng hấp dẫn</h3>
                            <p className="font-body-md text-body-md text-secondary">
                                Nhận mức chiết khấu lên đến 30% cho mỗi giao dịch thành công và duy trì dài hạn.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-md group-hover:bg-primary-container/20 transition-colors">
                                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-background mb-sm">Hỗ trợ kỹ thuật 24/7</h3>
                            <p className="font-body-md text-body-md text-secondary">
                                Đội ngũ chuyên gia cloud sẵn sàng hỗ trợ bạn và khách hàng của bạn mọi lúc.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-md group-hover:bg-primary-container/20 transition-colors">
                                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-background mb-sm">Đào tạo độc quyền</h3>
                            <p className="font-body-md text-body-md text-secondary">
                                Truy cập tài nguyên đào tạo, chứng chỉ kỹ thuật và sales enablement miễn phí.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Tiers Section */}
            <section id="policies" className="py-3xl px-gutter bg-surface">
                <div className="max-w-container-max mx-auto">
                    <div className="text-center mb-2xl">
                        <h2 className="font-headline-lg text-headline-lg text-on-background mb-sm hidden md:block">Cấp độ Đối tác</h2>
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-sm md:hidden">Cấp độ Đối tác</h2>
                        <p className="font-body-md text-body-md text-secondary">Chính sách linh hoạt phù hợp với quy mô doanh nghiệp của bạn.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        {/* Silver */}
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl flex flex-col">
                            <div className="mb-lg">
                                <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase tracking-wider mb-md">Silver</span>
                                <div className="font-display-lg text-display-lg text-on-background">10%</div>
                                <div className="font-body-sm text-body-sm text-secondary">Hoa hồng cơ bản</div>
                            </div>
                            <ul className="space-y-md font-body-md text-body-md text-on-surface flex-grow mb-xl">
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span>Chiết khấu 10% trọn đời</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span>Tài liệu marketing chuẩn</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span>Hỗ trợ qua ticket (SLA 24h)</span>
                                </li>
                            </ul>
                            <button className="w-full bg-transparent border border-primary text-primary font-semibold py-2 rounded-lg hover:bg-primary/5 transition-colors mt-auto">
                                Bắt đầu ngay
                            </button>
                        </div>

                        {/* Gold */}
                        <div className="bg-surface-container-lowest rounded-xl border-2 border-primary p-xl flex flex-col relative shadow-[0_4px_20px_rgba(0,0,0,0.05)] transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                                Phổ biến nhất
                            </div>
                            <div className="mb-lg mt-sm">
                                <span className="inline-block px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider mb-md">Gold</span>
                                <div className="font-display-lg text-display-lg text-primary">20%</div>
                                <div className="font-body-sm text-body-sm text-secondary">Hoa hồng nâng cao</div>
                            </div>
                            <ul className="space-y-md font-body-md text-body-md text-on-surface flex-grow mb-xl">
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span className="font-medium">Chiết khấu 20% trọn đời</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span className="font-medium text-primary">Chuyên viên hỗ trợ riêng (1-1)</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span>Đào tạo kỹ thuật miễn phí</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    <span>Hỗ trợ qua Phone/Chat (SLA 4h)</span>
                                </li>
                            </ul>
                            <button className="w-full bg-primary text-on-primary font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors mt-auto">
                                Đăng ký Gold
                            </button>
                        </div>

                        {/* Platinum */}
                        <div className="bg-inverse-surface text-on-primary rounded-xl border border-inverse-surface p-xl flex flex-col">
                            <div className="mb-lg">
                                <span className="inline-block px-3 py-1 rounded-full bg-surface-tint text-on-primary font-label-caps text-label-caps uppercase tracking-wider mb-md">Platinum</span>
                                <div className="font-display-lg text-display-lg">30%</div>
                                <div className="font-body-sm text-body-sm text-inverse-on-surface">Hoa hồng tối đa</div>
                            </div>
                            <ul className="space-y-md font-body-md text-body-md flex-grow mb-xl">
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-tertiary-fixed text-xl">check_circle</span>
                                    <span>Chiết khấu 30% trọn đời</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-tertiary-fixed text-xl">check_circle</span>
                                    <span className="text-tertiary-fixed font-medium">Cung cấp giải pháp White-label</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-tertiary-fixed text-xl">check_circle</span>
                                    <span>Quỹ Marketing đồng hành (MDF)</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-tertiary-fixed text-xl">check_circle</span>
                                    <span>Hỗ trợ cấp VIP 24/7 (SLA 1h)</span>
                                </li>
                            </ul>
                            <button onClick={() => setIsContactModalOpen(true)} className="w-full bg-surface-container-lowest text-primary font-semibold py-2 rounded-lg hover:bg-surface-container-lowest/90 transition-colors mt-auto">
                                Liên hệ Kinh doanh
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-primary-container text-on-primary-container py-24 px-gutter">
                <div className="max-w-container-max mx-auto flex flex-col items-center text-center gap-xl">
                    <h2 className="font-display-lg text-display-lg hidden md:block">Sẵn sàng phát triển cùng CloudNova?</h2>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:hidden">Sẵn sàng phát triển cùng CloudNova?</h2>
                    <p className="font-body-lg text-body-lg max-w-[42rem] text-on-primary-container/80">
                        Tham gia mạng lưới đối tác của chúng tôi ngay hôm nay để nhận được những ưu đãi tốt nhất và hỗ trợ tận tình từ đội ngũ chuyên gia.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-md">
                        <button onClick={() => setIsModalOpen(true)} className="bg-surface-container-lowest text-primary font-semibold px-xl py-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                            Đăng ký Đối tác ngay
                        </button>
                        <button onClick={() => setIsContactModalOpen(true)} className="bg-transparent border border-surface-container-lowest text-surface-container-lowest font-semibold px-xl py-3 rounded-lg hover:bg-surface-container-lowest/10 transition-all">
                            Liên hệ tư vấn
                        </button>
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Đăng ký Đối tác CloudNova"
                maxWidth="max-w-[40rem]"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium text-on-surface">Hủy</button>
                        <button onClick={(e) => {
                            const form = document.getElementById('partner-form') as HTMLFormElement;
                            if (form.checkValidity()) {
                                document.getElementById('hidden-partner-submit')?.click();
                            } else {
                                form.reportValidity();
                            }
                        }} disabled={isSubmitting} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Đang gửi...' : 'Xác nhận Đăng ký'}
                        </button>
                    </>
                }
            >
                <form id="partner-form" onSubmit={handleSubmit} className="space-y-4">
                    <button type="submit" id="hidden-partner-submit" className="hidden"></button>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Họ và tên / Tên doanh nghiệp</label>
                        <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Nhập tên của bạn hoặc doanh nghiệp..." />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Email liên hệ</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="contact@example.com" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Website (Nếu có)</label>
                        <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="https://" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Hình thức quảng bá (Promotion Method)</label>
                        <select 
                            required 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={promotionMethod}
                            onChange={(e) => setPromotionMethod(e.target.value)}
                        >
                            <option value="">Chọn hình thức quảng bá</option>
                            <option value="blog">Viết Blog / Review</option>
                            <option value="social">Mạng xã hội (Facebook, YouTube...)</option>
                            <option value="agency">Agency / System Integrator</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    {promotionMethod === 'other' && (
                        <div className="animate-fade-in">
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Vui lòng mô tả rõ hơn</label>
                            <input type="text" required value={promotionDetails} onChange={e => setPromotionDetails(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Nhập hình thức quảng bá của bạn..." />
                        </div>
                    )}
                </form>
            </Modal>

            {/* Contact Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Thông tin liên hệ"
                maxWidth="max-w-[30rem]"
                footer={
                    <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm w-full">
                        Đóng
                    </button>
                }
            >
                <div className="space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                    </div>
                    <p className="font-body-lg text-on-surface">Vui lòng liên hệ với chúng tôi qua các kênh sau để được tư vấn chi tiết:</p>
                    
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant inline-block w-full mt-4">
                        <div className="flex items-center gap-3 justify-center mb-3">
                            <span className="material-symbols-outlined text-primary">call</span>
                            <span className="font-headline-md text-on-surface font-semibold">{contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            <a href={`mailto:${contactInfo.email}`} className="font-body-md text-primary hover:underline">{contactInfo.email}</a>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
