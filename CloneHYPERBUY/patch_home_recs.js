const fs = require('fs');
const path = 'js/main.js';
let js = fs.readFileSync(path, 'utf8');

const regex = /function renderGuestRecommendations\(products\) \{[\s\S]*?\}\s*(?=\/\/\s*=== User Recommendations)/;

const newImplementation = `function renderGuestRecommendations(products) {
    const container = document.getElementById("guest-recommend-products");
    if (!container) return;

    if (!products || !products.length) {
        container.innerHTML = "<p style='padding:20px; color:#666; text-align:center;'>Kho dữ liệu Gợi ý hiện đang trống.</p>";
        return;
    }

    container.innerHTML = products.map(p => {
        const px = window.getDiscountInfo ? window.getDiscountInfo(p.price, p.id) : { original: p.price, discounted: p.price, percent: 0 };
        return \`
        <div class="product-card-v2" onclick="window.location.href='product-detail.html?id=\${p.id}'" style="cursor:pointer; display: flex; flex-direction: column;">
            <div class="img-wrap">
                <img src="\${PRODUCT_IMAGE_BASE_URL}\${p.imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/300x200/EFEFEF/AAAAAA?text=\${encodeURIComponent(p.name)}';">
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; flex-grow: 1;">
                <h3 class="card-title" style="flex-grow: 1;">\${p.name}</h3>
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
                <button class="btn-wishlist \${window.isWishlisted && window.isWishlisted(p.id) ? 'active' : ''}" onclick="event.stopPropagation(); if(window.toggleWishlist) window.toggleWishlist('\${p.id}', '\${(p.name || '').replace(/'/g, "&apos;")}', \${p.price}, '\${PRODUCT_IMAGE_BASE_URL}\${p.imageUrl}')" style="background:none; border:none; color: \${window.isWishlisted && window.isWishlisted(p.id) ? '#4f46e5' : '#999'}; cursor:pointer; font-size:1.2rem; transition:0.2s; padding:5px;">
                    <i class="\${window.isWishlisted && window.isWishlisted(p.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        </div>
        \`;
    }).join("");
}
`;

if (regex.test(js)) {
    js = js.replace(regex, newImplementation);
    fs.writeFileSync(path, js, 'utf8');
    console.log("Patched Home Recommendations successfully!");
} else {
    console.log("Regex for Home Recommendations did not match.");
}
