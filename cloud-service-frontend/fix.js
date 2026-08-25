const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace text-[var(--text-XYZ)] with text-XYZ
content = content.replace(/text-\[var\(--text-([^)]+)\)\]/g, 'text-$1');

// Replace max-w-[var(--spacing-XYZ)] with max-w-XYZ
content = content.replace(/max-w-\[var\(--spacing-([^)]+)\)\]/g, 'max-w-$1');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Fixed');
