const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Regex to find the product card creation block in loadProducts
const targetRegex = /const card = document\.createElement\('div'\);\s*card\.className = 'product-card';[\s\S]*?card\.innerHTML = `[\s\S]*?`;/g;

const replacement = `const card = document.createElement('div');
                card.className = 'product-card-v2';
                
                // ----- Xử lý URL ảnh -----
                let imgUrl = \`https://placehold.co/300x200/EFEFEF/AAAAAA&text=\${encodeURIComponent(p.name || 'SP')}\`;
                const imageUrlFromApi = p.imageUrl;

                if (imageUrlFromApi) {
                    if (imageUrlFromApi.startsWith('http://') || imageUrlFromApi.startsWith('https://')) {
                        imgUrl = imageUrlFromApi.replace('http://localhost:8081', PRODUCT_IMAGE_BASE_URL);
                    } else if (imageUrlFromApi.startsWith('/')) {
                        imgUrl = \`\${PRODUCT_IMAGE_BASE_URL}\${imageUrlFromApi}\`;
                    } else {
                        imgUrl = \`\${PRODUCT_IMAGE_BASE_URL.replace(/\\/$/, '')}/product-images/\${imageUrlFromApi}\`;
                    }
                }

                const px = window.getDiscountInfo ? window.getDiscountInfo(p.price, p.id) : { original: p.price, discounted: p.price, percent: 0 };
                const pLink = \`product-detail.html?id=\${p.id}\`;

                card.innerHTML = \`
                <div class="img-wrap" style="cursor:pointer;" onclick="window.location.href='\${pLink}'">
                    <img src="\${imgUrl}" onerror="this.onerror=null;this.src='https://placehold.co/300x200/EFEFEF/AAAAAA?text=\${encodeURIComponent(p.name)}';">
                </div>
                <div class="card-body" style="display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 class="card-title" style="flex-grow: 1; cursor:pointer;" onclick="window.location.href='\${pLink}'">\${p.name || 'Tên SP không rõ'}</h3>
                    <div class="card-price-wrapper" style="display:flex; flex-direction:column; gap:2px; margin-bottom: 5px;">
                        <div class="original-price" style="text-decoration:line-through; color:#999; font-size:0.85rem;">
                            \${px.original.toLocaleString('vi-VN')} đ 
                            <span class="discount-badge" style="background:#e11d48; color:#fff; padding:2px 4px; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:4px;">-\${px.percent}%</span>
                        </div>
                        <div class="card-price" style="color: #4f46e5; font-size: 1.15rem; font-weight: 700;">
                            \${px.discounted.toLocaleString('vi-VN')} đ
                        </div>
                    </div>
                </div>
                <div class="card-footer" style="margin-top: auto;">
                    <button class="btn-add btn-add-to-cart" data-product-id="\${p.id}" onclick="event.stopPropagation(); addToCartAPI(\${p.id})">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                    <button class="btn-wishlist \${window.isWishlisted && window.isWishlisted(p.id) ? 'active' : ''}" onclick="event.stopPropagation(); if(window.toggleWishlist) window.toggleWishlist('\${p.id}', '\${(p.name || '').replace(/'/g, "&apos;")}', \${p.price}, '\${imgUrl}')" style="background:none; border:none; color: \${window.isWishlisted && window.isWishlisted(p.id) ? '#4f46e5' : '#999'}; cursor:pointer; font-size:1.2rem; transition:0.2s; padding:5px;">
                        <i class="\${window.isWishlisted && window.isWishlisted(p.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>\`;`;

if (targetRegex.test(mainJs)) {
    mainJs = mainJs.replace(targetRegex, replacement);
    fs.writeFileSync(mainJsPath, mainJs, 'utf8');
    console.log('Successfully patched loadProducts grid HTML!');
} else {
    console.error('Failed to find replacement block in main.js. Regex mismatch.');
}
