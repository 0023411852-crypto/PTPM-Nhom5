import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageNumber = parseInt(searchParams.get("PageNumber") || "1");
    const pageSize = parseInt(searchParams.get("PageSize") || "6");
    const search = (searchParams.get("search") || "").toLowerCase();

    // Dùng RSS của các trang công nghệ
    const urls = [
      "https://vnexpress.net/rss/so-hoa.rss",
      "https://thanhnien.vn/rss/cong-nghe.rss",
      "https://tuoitre.vn/rss/nhip-song-so.rss"
    ];

    const allArticles: any[] = [];
    
    for (const url of urls) {
      try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const xml = await response.text();
        
        // Dùng regex cơ bản để bóc tách RSS
        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
        
        for (const item of items) {
          const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
          const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || item.match(/<link>(.*?)<\/link>/);
          const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
          const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
          
          let title = titleMatch ? titleMatch[1] : "";
          const link = linkMatch ? linkMatch[1] : "";
          let description = descMatch ? descMatch[1] : "";
          const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
          
          let thumbnailUrl = "";
          const imgMatch = description.match(/src=["'](.*?)["']/);
          if (imgMatch) {
            thumbnailUrl = imgMatch[1];
          }
          
          // Loại bỏ HTML tags trong description
          description = description.replace(/<[^>]*>?/gm, '').trim();
          
          const searchContent = (title + " " + description).toLowerCase();
          
          // Ưu tiên các bài viết về cloud, vps, server, bảo mật
          if (searchContent.includes("cloud") || searchContent.includes("vps") || searchContent.includes("server") || searchContent.includes("công nghệ") || searchContent.includes("bảo mật") || searchContent.includes("ai")) {
             allArticles.push({
                id: link,
                title,
                content: description,
                slug: link, // Lưu link gốc vào slug để làm link chuyển hướng
                category: "Tin công nghệ",
                authorName: "Hệ thống",
                thumbnailUrl: thumbnailUrl || null,
                isPublished: true,
                viewCount: Math.floor(Math.random() * 500) + 50,
                createdAt: new Date(pubDate).toISOString(),
             });
          }
        }
      } catch (e) {
         console.error("Error fetching RSS:", url);
      }
    }
    
    // Loại bỏ bài trùng lặp
    const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.id, item])).values());
    
    // Sắp xếp theo ngày mới nhất
    uniqueArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Lọc ra các bài chắc chắn chứa "cloud" hoặc "vps"
    const priorityArticles = uniqueArticles.filter(a => a.title.toLowerCase().includes("cloud") || a.title.toLowerCase().includes("vps") || a.content.toLowerCase().includes("cloud") || a.content.toLowerCase().includes("vps"));
    const otherArticles = uniqueArticles.filter(a => !(a.title.toLowerCase().includes("cloud") || a.title.toLowerCase().includes("vps") || a.content.toLowerCase().includes("cloud") || a.content.toLowerCase().includes("vps")));
    
    // Gom lại và chỉ lấy đúng 10 bài như yêu cầu của user
    let baseArticles = [...priorityArticles, ...otherArticles].slice(0, 10);
    
    // Xử lý tìm kiếm từ Frontend
    if (search) {
        baseArticles = baseArticles.filter(a => a.title.toLowerCase().includes(search) || a.content.toLowerCase().includes(search));
    }

    const totalRecords = baseArticles.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const paginatedArticles = baseArticles.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return NextResponse.json({
        data: paginatedArticles,
        totalPages: totalPages === 0 ? 1 : totalPages,
        totalRecords: totalRecords
    });
    
  } catch (error) {
    console.error("Error scraping news:", error);
    return NextResponse.json({ data: [], totalPages: 0, totalRecords: 0 }, { status: 500 });
  }
}
