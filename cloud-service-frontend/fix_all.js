const fs = require('fs');
const files = ['src/app/page.tsx', 'src/app/services/page.tsx'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix max-w classes (since Tailwind v4 spacing overrides max-w)
    // Only replace whole words so we don't accidentally replace max-w-md inside a longer class
    content = content.replace(/\bmax-w-md\b/g, 'max-w-[28rem]');
    content = content.replace(/\bmax-w-lg\b/g, 'max-w-[32rem]');
    content = content.replace(/\bmax-w-xl\b/g, 'max-w-[36rem]');
    content = content.replace(/\bmax-w-2xl\b/g, 'max-w-[42rem]');
    content = content.replace(/\bmax-w-3xl\b/g, 'max-w-[48rem]');
    
    // Fix Links in Navbar
    content = content.replace(/"#">Trang chủ<\/a>/g, '"/">Trang chủ</a>');
    content = content.replace(/"#">Dịch vụ<\/a>/g, '"/services">Dịch vụ</a>');
    
    // In React we should really use Link component, but <a> is fine for now. 
    // Let's replace <a with <Link and import Link if not present, but simple <a> is enough for linking between pages (Next.js just does a full page load with <a>, but the user just asked why it's not linked).
    // Let's use Next.js <Link>!
    if (!content.includes('import Link from')) {
        content = content.replace(/import React/, 'import Link from "next/link";\nimport React');
    }
    
    // Replace <a> with <Link> for internal links (basic replace)
    content = content.replace(/<a ([^>]*)href="\/"([^>]*)>(.*?)<\/a>/g, '<Link $1href="/"$2>$3</Link>');
    content = content.replace(/<a ([^>]*)href="\/services"([^>]*)>(.*?)<\/a>/g, '<Link $1href="/services"$2>$3</Link>');

    fs.writeFileSync(file, content);
});
console.log('Fixed links and max-w classes');
