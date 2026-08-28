import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-blue-50 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto">
        <span className="material-symbols-outlined text-5xl">search_off</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
        404 - Không tìm thấy trang
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không truy cập được.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/25"
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        Trở về trang chủ
      </Link>
    </main>
  );
}
