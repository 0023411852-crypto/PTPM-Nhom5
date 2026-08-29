import React from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="public-content flex-grow pt-24 pb-20 bg-background min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-6 text-center animate-fade-in">
        <span className="material-symbols-outlined text-[64px] text-primary mb-6 inline-block bg-primary-container/30 p-6 rounded-full">
          support_agent
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-6 tracking-tight">
          Liên hệ tư vấn
        </h1>
        <p className="text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Đội ngũ chuyên gia của CloudNova luôn sẵn sàng hỗ trợ bạn xây dựng hạ tầng Cloud tối ưu, an toàn và tiết kiệm nhất.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="bg-surface p-8 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-[32px] text-primary mb-4">call</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Gọi trực tiếp</h3>
            <p className="text-on-surface-variant mb-4">Hỗ trợ kỹ thuật và tư vấn dịch vụ 24/7.</p>
            <a href="tel:1900xxxx" className="text-primary font-bold text-xl hover:underline">
              1900 xxxx
            </a>
          </div>

          <div className="bg-surface p-8 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-[32px] text-primary mb-4">mail</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Gửi Email</h3>
            <p className="text-on-surface-variant mb-4">Chúng tôi sẽ phản hồi trong vòng 30 phút.</p>
            <a href="mailto:contact@cloudnova.vn" className="text-primary font-bold text-lg hover:underline break-all">
              contact@cloudnova.vn
            </a>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-outline-variant/30">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
