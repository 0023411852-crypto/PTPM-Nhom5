import { notFound } from 'next/navigation';

async function getStaticPage(slug: string) {
    try {
        const res = await fetch(`http://localhost:5154/api/StaticPages/slug/${slug}`, {
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

export default async function StaticPageRender({ params }: { params: { slug: string } }) {
    const page = await getStaticPage(params.slug);

    if (!page) {
        notFound();
    }

    return (
        <main className="pt-24 pb-3xl flex-grow">
            <section className="px-gutter max-w-container-md mx-auto pt-xl pb-3xl">
                <h1 className="font-display-md text-display-md text-on-surface mb-md">
                    {page.title}
                </h1>
                
                {/* Render HTML content safely */}
                <div 
                    className="prose prose-blue max-w-none prose-headings:font-semibold prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </section>
        </main>
    );
}
