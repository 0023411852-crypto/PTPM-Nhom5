import { notFound } from 'next/navigation';

async function getStaticPage(slug: string) {
    try {
        const API_URL = process.env.API_PROXY_URL || "http://localhost:5154";
        const res = await fetch(`${API_URL}/api/StaticPages/slug/${slug}`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        return null;
    }
}

export default async function StaticPageRender({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getStaticPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 pt-32 pb-16 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        {page.title}
                    </h1>
                    <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                </div>
            </div>
            
            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-6 w-full -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 md:p-12 min-h-[400px]">
                    {/* Render HTML content safely */}
                    <div 
                        className="prose prose-lg prose-slate max-w-none 
                                   prose-headings:font-bold prose-headings:text-slate-900 
                                   prose-p:text-slate-600 prose-p:leading-relaxed
                                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                   prose-li:text-slate-600"
                        dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br />') }}
                    />
                </div>
            </section>
        </main>
    );
}
