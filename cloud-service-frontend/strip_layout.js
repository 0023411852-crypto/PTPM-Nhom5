const fs = require('fs');

const files = ['src/app/page.tsx', 'src/app/services/page.tsx'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove <nav>
    content = content.replace(/<nav[\s\S]*?<\/nav>\s*/, '');
    
    // Remove <footer>
    content = content.replace(/<footer[\s\S]*?<\/footer>\s*/, '');

    fs.writeFileSync(file, content);
});

console.log('Removed nav and footer from pages');
