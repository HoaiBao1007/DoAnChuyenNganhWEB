const fs = require('fs');
const path = require('path');

const dir = 'd:\\suaCV\\HyperBuy\\HyperBuy\\CloneHYPERBUY';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const wishlistHeaderBtn = `
        <a href="wishlist.html" class="cp-action-item" style="position:relative;">
          <i class="fas fa-heart"></i>
          <div class="cp-action-text"><span>Yêu</span><span>thích</span></div>
          <span class="wishlist-count-badge" style="position:absolute; top:-6px; right:-6px; background:#fff; color:#4f46e5; display:none; border-radius:10px; padding:2px 6px; font-weight:700; font-size:0.75rem;"></span>
        </a>`;

for (let file of files) {
    if (file === 'wishlist.html') continue;
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Inject header button before the cart logic
    if (content.includes('Tra cứu</span><span>đơn hàng') && !content.includes('href="wishlist.html"')) {
        content = content.replace(
            /(<a href="my-orders\.html"[\s\S]*?<\/a>)/i,
            '$1\n' + wishlistHeaderBtn
        );
    }

    // Disable CSS fake wishlist icon
    content = content.replace(/\.product-card-v2 \.card-footer::after\s*\{[\s\S]*?\}/g, '.product-card-v2 .card-footer::after { display: none !important; }');

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
}

const stylePath = path.join(dir, 'css', 'style.css');
if (fs.existsSync(stylePath)) {
    let cssContent = fs.readFileSync(stylePath, 'utf8');
    cssContent = cssContent.replace(/\.product-card-v2 \.card-footer::after\s*\{[\s\S]*?\}/g, '.product-card-v2 .card-footer::after { display: none !important; }');
    fs.writeFileSync(stylePath, cssContent, 'utf8');
}

const mainJsPath = path.join(dir, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

const replacementBtn = `<button class="btn-add btn-add-to-cart" data-product-id="\${p.id}" onclick="event.stopPropagation(); addToCartAPI(\${p.id})">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                        <button class="btn-wishlist \${isWishlisted(p.id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('\${p.id}', '\${(p.name || '').replace(/'/g, "&apos;")}', \${p.price}, '\${imgUrl}')" style="background:none; border:none; color: \${isWishlisted(p.id) ? '#4f46e5' : '#999'}; cursor:pointer; font-size:1.2rem; transition:0.2s; padding:5px;">
                            <i class="\${isWishlisted(p.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>`;

const regexCartOnly = /<button class="btn-add btn-add-to-cart" data-product-id="\$\{p\.id\}" onclick="event\.stopPropagation\(\); addToCartAPI\(\$\{p\.id\}\)">[\s\S]*?<\/button>/g;
if (!mainJs.includes('toggleWishlist')) {
    mainJs = mainJs.replace(regexCartOnly, replacementBtn);
}


const wishlistLogic = `
window.getWishlist = function() {
    return JSON.parse(localStorage.getItem('hyperbuy_wishlist') || '[]');
};
window.saveWishlist = function(list) {
    localStorage.setItem('hyperbuy_wishlist', JSON.stringify(list));
    window.updateWishlistBadge();
};
window.isWishlisted = function(id) {
    return window.getWishlist().some(item => String(item.id) === String(id));
};
window.toggleWishlist = function(id, name, price, imgUrl) {
    let list = window.getWishlist();
    const idx = list.findIndex(item => String(item.id) === String(id));
    let isActive = false;
    if (idx > -1) {
        list.splice(idx, 1);
        showToast('Đã bỏ sản phẩm khỏi yêu thích', 'info');
    } else {
        list.push({ id, name, price, imgUrl });
        isActive = true;
        showToast('Đã thêm sản phẩm vào yêu thích', 'success');
    }
    window.saveWishlist(list);
    
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr.includes("toggleWishlist('" + id + "'") || onclickAttr.includes("toggleWishlist(" + id + ",")) {
            btn.style.color = isActive ? '#4f46e5' : '#999';
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';
            }
        }
    });

    if (window.location.pathname.includes('wishlist.html') && typeof loadWishlistPage === 'function') {
        loadWishlistPage();
    }
};
window.updateWishlistBadge = function() {
    const list = window.getWishlist();
    document.querySelectorAll('.wishlist-count-badge').forEach(b => {
        if(list.length > 0) {
            b.textContent = list.length;
            b.style.display = 'inline-block';
        } else {
            b.style.display = 'none';
        }
    });
};
function showToast(msg, type='info') {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 20px';
    toast.style.background = type === 'success' ? '#4f46e5' : '#333';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
document.addEventListener('DOMContentLoaded', window.updateWishlistBadge);
`;
if (!mainJs.includes('window.getWishlist')) {
    mainJs += '\n' + wishlistLogic;
}
fs.writeFileSync(mainJsPath, mainJs, 'utf8');

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const parts = indexHtml.split(/<div class="cp-main">[\s\S]*?<\/div>\s*<!-- \/.*?\.cp-main -->/i);

if (parts.length >= 2 || indexHtml.includes('cp-main')) {
    const headTop = indexHtml.substring(0, indexHtml.indexOf('<div class="cp-main">'));
    let tailBottom = indexHtml.substring(indexHtml.lastIndexOf('</div> <!-- /.cp-main -->'));
    if (!tailBottom.includes('</footer>')) {
        tailBottom = indexHtml.substring(indexHtml.indexOf('<!-- ----- FOOTER ----- -->'));
    }

    const wishlistBody = `
<div class="cp-main">
  <div class="cp-section">
    <div class="cp-section-title"><span>★ DANH SÁCH YÊU THÍCH</span></div>
    <div id="wishlist-grid" class="product-grid-enhanced">
       <p style="padding: 20px; text-align: center; width: 100%; color: #777;">Bạn chưa xếp sản phẩm nào vào danh sách yêu thích.</p>
    </div>
  </div>
</div>
<script>
function loadWishlistPage() {
    const list = window.getWishlist();
    const container = document.getElementById('wishlist-grid');
    if (!container) return;
    if (!list.length) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%; font-size:1.1rem; color: #777;">Bạn chưa có sản phẩm yêu thích nào. <a href="products.html" style="color:#4f46e5; text-decoration:underline;">Khám phá ngay!</a></p>';
        return;
    }
    
    let html = '';
    list.forEach(function(p) {
        html += '<div class="product-card-v2" onclick="window.location.href=\\'product-detail.html?id=' + p.id + '\\'" style="cursor:pointer; height: 100% !important;">';
        html += '<div class="img-wrap"><img src="' + p.imgUrl + '" onerror="this.onerror=null;this.src=\\'https://placehold.co/300x200/EFEFEF/AAAAAA&text=Anh loi\\';"></div>';
        html += '<div class="card-body" style="display: flex !important; flex-direction: column; flex-grow: 1;">';
        html += '<h3 class="card-title" style="flex-grow: 1;">' + p.name + '</h3>';
        html += '<div class="card-price">' + (parseFloat(p.price)||0).toLocaleString('vi-VN') + ' đ</div>';
        html += '</div>';
        html += '<div class="card-footer">';
        html += '<button class="btn-add btn-add-to-cart" data-product-id="' + p.id + '" onclick="event.stopPropagation(); addToCartAPI(' + p.id + ')"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>';
        const safeName = (p.name || '').replace(/'/g, "\\\\'");
        html += '<button class="btn-wishlist" onclick="event.stopPropagation(); toggleWishlist(\\'' + p.id + '\\', \\'' + safeName + '\\', ' + p.price + ', \\'' + p.imgUrl + '\\')" style="background:none; border:none; color: #4f46e5; cursor:pointer; font-size:1.2rem; transition:0.2s; padding:5px;"><i class="fas fa-heart"></i></button>';
        html += '</div></div>';
    });
    container.innerHTML = html;
}
document.addEventListener('DOMContentLoaded', loadWishlistPage);
</script>
`;

    fs.writeFileSync(path.join(dir, 'wishlist.html'), headTop + wishlistBody + tailBottom, 'utf8');
    console.log("Created wishlist.html");
}
console.log("Done adding wishlist.");
