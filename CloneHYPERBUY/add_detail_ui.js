const fs = require('fs');
const path = require('path');

const dir = 'd:\\suaCV\\HyperBuy\\HyperBuy\\CloneHYPERBUY';
const mainJsPath = path.join(dir, 'js', 'main.js');
const cssPath = path.join(dir, 'css', 'style.css');

// --- CSS INJECTION ---
let cssContent = fs.readFileSync(cssPath, 'utf8');
const newCss = `
/* MODERN PRODUCT DETAIL UI */
.modern-layout { display: grid; grid-template-columns: 45% 50%; gap: 5%; margin-bottom: 40px; }
.product-detail-gallery { display: flex; flex-direction: column; gap: 15px; }
.main-image-wrapper { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #efefef; padding: 20px; text-align: center; background: #fff; }
.main-image-wrapper img { max-width: 100%; height: auto; max-height: 400px; object-fit: contain; transition: 0.3s; }
.discount-badge-large { position: absolute; top: 15px; right: 15px; background: #e11d48; color: #fff; font-weight: 800; padding: 5px 12px; border-radius: 20px; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(225,29,72,0.3); }

.thumbnail-list { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
.thumbnail-list img.thumb { width: 80px; height: 80px; object-fit: contain; border: 2px solid #efefef; border-radius: 8px; cursor: pointer; transition: 0.2s; background: #fff; padding: 5px; }
.thumbnail-list img.thumb.active { border-color: #4f46e5; box-shadow: 0 4px 12px rgba(79,70,229,0.2); }
.thumbnail-list img.thumb:hover { border-color: #818cf8; }

.advanced-info { display: flex; flex-direction: column; gap: 15px; }
.pd-title { font-size: 1.8rem; font-weight: 800; color: #111; line-height: 1.3; margin:0; }
.pd-meta { color: #666; font-size: 0.95rem; }

.pd-price-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 5px; }
.original-price-row { display: flex; align-items: center; gap: 15px; }
.old-price { text-decoration: line-through; color: #94a3b8; font-size: 1.1rem; }
.discount-tag { font-size: 0.85rem; color: #0f172a; background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
.current-price-row { display: flex; align-items: baseline; gap: 10px; }
.final-price { font-size: 2.2rem; font-weight: 800; color: #e11d48; }
.vat-info { font-size: 0.85rem; color: #64748b; }

.pd-trust-badges { display: flex; flex-direction: column; gap: 10px; padding: 15px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-top: 5px; }
.badge-item { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; font-weight: 600; color: #374151; }
.badge-item i { color: #10b981; font-size: 1.2rem; width: 20px; text-align: center; }

.pd-variants h4 { margin: 0 0 10px 0; font-size: 1rem; color: #333; }
.variant-options { display: flex; gap: 10px; }
.variant { padding: 8px 15px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: #475569; transition: 0.2s; }
.variant.active { border-color: #4f46e5; background: #e0e7ff; color: #4f46e5; font-weight: 600; }

.modern-actions { display: flex; gap: 15px; margin-top: 10px; }
.btn-buy-now-lg { flex: 2; background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 15px 20px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(225,29,72,0.3); transition: 0.2s; }
.btn-buy-now-lg strong { font-size: 1.2rem; text-transform: uppercase; }
.btn-buy-now-lg span { font-size: 0.8rem; font-weight: 400; opacity: 0.9; margin-top: 4px; }
.btn-buy-now-lg:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(225,29,72,0.4); }

.btn-add-cart-lg { flex: 1; background: #fff; color: #4f46e5; border: 2px solid #4f46e5; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
.btn-add-cart-lg:hover { background: #f5f3ff; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(79,70,229,0.15); }

/* TABS */
.product-detail-tabs { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-top: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.tab-headers { display: flex; border-bottom: 1px solid #e5e7eb; background: #f8fafc; }
.tab-btn { flex: 1; padding: 15px; border: none; background: transparent; font-size: 1.1rem; font-weight: 600; color: #64748b; cursor: pointer; transition: 0.2s; outline: none; border-bottom: 3px solid transparent; }
.tab-btn:hover { color: #4f46e5; }
.tab-btn.active { color: #4f46e5; border-bottom-color: #4f46e5; background: #fff; }
.tab-content { padding: 30px; display: none; line-height: 1.7; color: #4b5563; }
.tab-content.active { display: block; animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
    .modern-layout { grid-template-columns: 1fr; }
    .modern-actions { flex-direction: column; }
}
`;
if (!cssContent.includes('.modern-layout')) {
    fs.appendFileSync(cssPath, '\n' + newCss, 'utf8');
}

// --- JS INJECTION ---
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Replacement logic
const startIndexString = "    // --------- Render HTML ----------";
const endIndexString = "    // --------- Gắn sự kiện seller";

let startIdx = mainJs.indexOf(startIndexString);
let endIdx = mainJs.indexOf(endIndexString);

if (startIdx !== -1 && endIdx !== -1) {
    // Inject the helper functions if not present
    const helperFunctions = `
window.changeMainImg = function(el) {
    document.getElementById('main-viewer-img').src = el.src;
    document.querySelectorAll('.thumbnail-list .thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
};
window.switchPdTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
};
`;
    if (!mainJs.includes('window.changeMainImg')) {
        mainJs += '\n' + helperFunctions;
    }

    // Now construct the massive UI template replacement
    const newHtmlBlock = "const px = window.getDiscountInfo ? window.getDiscountInfo(p.price, p.id) : { original: parseFloat(p.price)||0, discounted: parseFloat(p.price)||0, percent: 0 };\n    contentEl.innerHTML = `\n" +
        `        <div class="product-detail-container modern-layout">
            <!-- Left: Gallery -->
            <div class="product-detail-gallery">
                <div class="main-image-wrapper">
                    <img id="main-viewer-img" src="\${imgUrl}" alt="\${encodeURIComponent(pName)}">
                    <div class="discount-badge-large">-\${px.percent}%</div>
                </div>
                <div class="thumbnail-list">
                    <img class="thumb active" src="\${imgUrl}" onclick="changeMainImg(this)">
                    <img class="thumb" src="https://placehold.co/400x400/F8F9FA/4f46e5?text=\${encodeURIComponent('Góc 2')}" onclick="changeMainImg(this)">
                    <img class="thumb" src="https://placehold.co/400x400/E9ECEF/4f46e5?text=\${encodeURIComponent('Góc 3')}" onclick="changeMainImg(this)">
                    <img class="thumb" src="https://placehold.co/400x400/DEE2E6/4f46e5?text=\${encodeURIComponent('Thực tế')}" onclick="changeMainImg(this)">
                </div>
            </div>
            
            <!-- Right: Info -->
            <div class="product-detail-info advanced-info">
                <h1 class="pd-title">\${pName}</h1>
                <div class="pd-meta">
                    <span class="sku">SKU: \${p.sku || "N/A"}</span> | 
                    <span class="category">Danh mục: \${productCategoryName}</span>
                </div>
                
                <div id="product-rating-summary" class="product-rating-summary" style="margin:0;"></div>

                <div class="pd-price-box">
                    <div class="original-price-row">
                        <span class="old-price">\${px.original.toLocaleString('vi-VN')} đ</span>
                        <span class="discount-tag">Tiết kiệm \${ (px.original - px.discounted).toLocaleString('vi-VN') } đ</span>
                    </div>
                    <div class="current-price-row">
                        <span class="final-price">\${px.discounted.toLocaleString('vi-VN')} đ</span>
                        <span class="vat-info">Đã bao gồm VAT</span>
                    </div>
                </div>

                <div class="pd-trust-badges">
                    <div class="badge-item"><i class="fas fa-shield-alt"></i> Bảo hành chính hãng 12-24 tháng</div>
                    <div class="badge-item"><i class="fas fa-shipping-fast"></i> Giao hàng Hỏa Tốc trong 2H</div>
                    <div class="badge-item"><i class="fas fa-undo"></i> 1 đổi 1 trong 30 ngày nếu lỗi NSX</div>
                </div>

                <div class="pd-variants">
                    <h4>Lựa chọn phiên bản</h4>
                    <div class="variant-options">
                        <div class="variant active" onclick="document.querySelectorAll('.variant').forEach(v=>v.classList.remove('active'));this.classList.add('active');">Tiêu chuẩn</div>
                        <div class="variant" onclick="document.querySelectorAll('.variant').forEach(v=>v.classList.remove('active'));this.classList.add('active');">Cao cấp</div>
                    </div>
                </div>
                
                \${sellerInfoHtml}
                
                <div class="product-actions modern-actions">
                    \${
                      p.active ? 
                      \`<button class="btn-buy-now-lg" onclick="alert('Chức năng mua ngay đang bảo trì. Vui lòng thêm vào giỏ hàng để tiếp tục.'); event.stopPropagation(); window.scrollTo(0, 0);">
                         <strong>MUA NGAY</strong>
                         <span>Giao tận nơi hoặc nhận tại cửa hàng</span>
                       </button>
                       <button class="btn-add-cart-lg" data-product-id="\${realProductId}" onclick="addToCartAPI(\${realProductId})">
                         <i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ
                       </button>\`
                       : '<p class="status-inactive" style="color:orange; font-weight:bold;">Sản phẩm này hiện đang ngưng bán.</p>'
                    }
                </div>
                \${productManagementControls}
            </div>
        </div>

        <!-- Bottom: Tabs -->
        <div class="product-detail-tabs">
            <div class="tab-headers">
                <button class="tab-btn active" onclick="switchPdTab('desc')">Mô tả sản phẩm</button>
                <button class="tab-btn" onclick="switchPdTab('specs')">Thông số kỹ thuật</button>
            </div>
            <div class="tab-content active" id="tab-desc">
                \${mainDesc}
            </div>
            <div class="tab-content" id="tab-specs">
                \${techSpecsHtml || '<p>Đang cập nhật...</p>'}
            </div>
        </div>
    \`;\n\n` + "    // --------- Gắn sự kiện seller";

    // Split at the exact loc to preserve the surrounding logic
    const part1 = mainJs.substring(0, startIdx);
    const part2 = mainJs.substring(endIdx + "    // --------- Gắn sự kiện seller".length);
    mainJs = part1 + newHtmlBlock + part2;

    fs.writeFileSync(mainJsPath, mainJs, 'utf8');
    console.log("Successfully replaced product-detail template in main.js");
} else {
    console.log("Could not find insertion points in main.js. Start/End mismatched.");
}
