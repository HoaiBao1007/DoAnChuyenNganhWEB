const fs = require('fs');
const path = require('path');

const dir = 'd:\\suaCV\\HyperBuy\\HyperBuy\\CloneHYPERBUY';
const mainJsPath = path.join(dir, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

const getDiscountScript = `
window.getDiscountInfo = function(price, productId) {
    const idNum = parseInt(productId) || 0;
    const discountPercent = 5 + (idNum % 6) * 5; 
    const originalPrice = parseFloat(price) || 0;
    let fakeOriginalPrice = Math.round(originalPrice / (1 - discountPercent / 100));
    fakeOriginalPrice = Math.ceil(fakeOriginalPrice / 1000) * 1000;
    return {
        original: fakeOriginalPrice,
        discounted: originalPrice,
        percent: discountPercent
    };
};
`;

if (!mainJs.includes('window.getDiscountInfo')) {
    mainJs += '\n' + getDiscountScript;
}

// 1. In loadProducts
const loadProductsRegex = /card\.innerHTML\s*=\s*`([\s\S]*?)<div class="card-price">\$\{\(\s*parseFloat\(p\.price\)\s*\|\|\s*0\)\.toLocaleString\('vi-VN'\)\}\s*đ<\/div>/;
mainJs = mainJs.replace(loadProductsRegex, `const px = window.getDiscountInfo(p.price, p.id);
                card.innerHTML = \`$1<div class="card-price-wrapper" style="display:flex; flex-direction:column; gap:2px; margin-bottom: 5px;">
                            <div class="original-price" style="text-decoration:line-through; color:#999; font-size:0.85rem;">
                                \${px.original.toLocaleString('vi-VN')} đ 
                                <span class="discount-badge" style="background:#e11d48; color:#fff; padding:2px 4px; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:4px;">-\${px.percent}%</span>
                            </div>
                            <div class="card-price" style="color: #4f46e5; font-size: 1.15rem; font-weight: 700;">
                                \${px.discounted.toLocaleString('vi-VN')} đ
                            </div>
                        </div>`);

// 2. In loadHomeRecommendations
const loadHomeRecsRegex = /return\s*`([\s\S]*?)<div class="card-price">\$\{\(\s*parseFloat\(p\.price\)\s*\|\|\s*0\)\.toLocaleString\('vi-VN'\)\}\s*đ<\/div>/;
mainJs = mainJs.replace(loadHomeRecsRegex, `const px = window.getDiscountInfo(p.price, p.id);
            return \`$1<div class="card-price-wrapper" style="display:flex; flex-direction:column; gap:2px; margin-bottom: 5px;">
                    <div class="original-price" style="text-decoration:line-through; color:#999; font-size:0.85rem;">
                        \${px.original.toLocaleString('vi-VN')} đ 
                        <span class="discount-badge" style="background:#e11d48; color:#fff; padding:2px 4px; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:4px;">-\${px.percent}%</span>
                    </div>
                    <div class="card-price" style="color: #4f46e5; font-size: 1.15rem; font-weight: 700;">
                        \${px.discounted.toLocaleString('vi-VN')} đ
                    </div>
                </div>`);

fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('Fixed main.js prices.');

// 3. In wishlist.html
const wishlistPath = path.join(dir, 'wishlist.html');
if (fs.existsSync(wishlistPath)) {
    let html = fs.readFileSync(wishlistPath, 'utf8');
    html = html.replace(/<div class="card-price">'\s*\+\s*\(parseFloat\(p\.price\)\|\|0\)\.toLocaleString\('vi-VN'\)\s*\+\s*' đ<\/div>/,
        `<div class="card-price-wrapper" style="display:flex; flex-direction:column; gap:2px; margin-bottom: 5px;">' +
        '<div class="original-price" style="text-decoration:line-through; color:#999; font-size:0.85rem;">' + px.original.toLocaleString('vi-VN') + ' đ ' + 
        '<span class="discount-badge" style="background:#e11d48; color:#fff; padding:2px 4px; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:4px;">-' + px.percent + '%</span></div>' +
        '<div class="card-price" style="color: #4f46e5; font-size: 1.15rem; font-weight: 700;">' + px.discounted.toLocaleString('vi-VN') + ' đ</div></div>`
    );
    // ensure px is defined in the loop
    if (!html.includes('const px = window.getDiscountInfo')) {
        html = html.replace(/list\.forEach\(function\(p\) \{/, `list.forEach(function(p) {
        const px = window.getDiscountInfo(p.price, p.id);`);
    }
    fs.writeFileSync(wishlistPath, html, 'utf8');
    console.log('Fixed wishlist.html prices.');
}

console.log('Done!');
