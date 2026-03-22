const fs = require('fs');
const path = require('path');

const dir = 'd:\\suaCV\\HyperBuy\\HyperBuy\\CloneHYPERBUY';
const filesToProcess = [];

function getFiles(currentPath) {
  const items = fs.readdirSync(currentPath);
  for (let item of items) {
    if (item === 'node_modules' || item.startsWith('.') || item === 'images') continue;
    const itemPath = path.join(currentPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      getFiles(itemPath);
    } else {
      if (item.endsWith('.html') || item.endsWith('.css') || item.endsWith('.js')) {
        filesToProcess.push(itemPath);
      }
    }
  }
}
getFiles(dir);

let count = 0;
const newSearchBox = `<form class="cp-search" action="products.html" method="GET" style="display:flex; position:relative; width:100%;">
        <button type="submit" style="background:transparent; border:none; position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#666; cursor:pointer; padding:0; z-index:10;">
          <i class="fas fa-search" style="position:static; transform:none;"></i>
        </button>
        <input type="text" name="name" placeholder="Bạn cần tìm gì hôm nay?" style="width:100%; padding:10px 15px 10px 40px; border-radius:10px; border:none; font-size:0.9rem; color:#333; box-shadow:inset 0 1px 3px rgba(0,0,0,0.1); outline:none;" />
      </form>`;

for (let file of filesToProcess) {
  // Skip modifying our own script to prevent infinite recursion or corruptions
  if (file.endsWith('fix_ui.js')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Color Replacements (Red to Indigo)
  content = content.replace(/#d70018/gi, '#4f46e5');
  content = content.replace(/#e02027/gi, '#6366f1');
  content = content.replace(/#c10015/gi, '#4338ca');
  content = content.replace(/#fca5a5/gi, '#a5b4fc');
  content = content.replace(/#fce8ea/gi, '#e0e7ff');

  // Change mention of "CELLPHONES" in comments (optional for cleanlyness)
  content = content.replace(/CELLPHONES-INSPIRED/gi, 'HYPERBUY-MODERN');

  // 2. Search Box replacement
  if (file.endsWith('.html') || file.endsWith('.js')) {
    // We regex match the cp-search div specifically
    const searchRegex = /<div class="cp-search">[\s\S]*?<\/div>/ig;
    // We do NOT want to replace it if it's already a form OR if it's not the exact div
    // We can do a string check so we don't ruin things
    if (content.includes('class="cp-search"') && !content.includes('<form class="cp-search"')) {
      content = content.replace(/<div class="cp-search">\s*<i class="fas fa-search"><\/i>\s*<input type="text" placeholder="Bạn cần tìm gì hôm nay\??"[ ]*\/>\s*<\/div>/ig, newSearchBox.trim());
      // Fallback for HTML
      content = content.replace(/<div class="cp-search">[\s\S]*?<\/div>/ig, newSearchBox.trim());
    }
  }

  // 3. Product Card Title Fix (Price alignment)
  // Look for .product-card-v2 .card-title {
  const targetCSS = /\.product-card-v2 \.card-title \{([\s\S]*?)\}/g;
  content = content.replace(targetCSS, (match, p1) => {
    if (!p1.includes('min-height: 2.64rem')) {
      return `.product-card-v2 .card-title {${p1}
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.64rem;
    }`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Fixed', path.basename(file));
  }
}
console.log('Successfully modified ' + count + ' files.');
