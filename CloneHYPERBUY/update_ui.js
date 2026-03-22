const fs = require('fs');
const path = require('path');

const dir = __dirname;
const cssFile = path.join(dir, 'css', 'style.css');

// 1. Tự động thêm class CSS mới vào style.css để không phải thả <style> inline vào HTML
const extraCSS = `
/* ==============================================================
   HYPERBUY-MODERN LAYOUT OVERRIDE - GLOBAL
   ============================================================== */
.cp-header { background: #4f46e5; color: #fff; padding: 10px 0; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.cp-header-container { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1200px; margin: 0 auto; gap: 15px; padding: 0 10px; }
.cp-logo { font-size: 1.5rem; font-weight: 800; color: #fff !important; text-transform: uppercase; letter-spacing: -0.5px; text-decoration: none; }
.cp-search { flex: 1; max-width: 400px; position: relative; }
.cp-search input { width: 100%; padding: 10px 15px 10px 40px; border-radius: 10px; border: none; font-size: 0.9rem; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); outline: none; }
.cp-search i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #666; }
.cp-header-actions { display: flex; align-items: center; gap: 12px; }
.cp-action-item { display: flex; align-items: center; gap: 6px; color: #fff; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; text-decoration: none; cursor: pointer; }
.cp-action-item:hover { background: rgba(255,255,255,0.2); }
.cp-action-item i { font-size: 1.2rem; }
.cp-action-text { display: flex; flex-direction: column; line-height: 1.2; }
.cp-action-text span:first-child { font-size: 0.7rem; opacity: 0.9; }
#main-nav { display: none; }
.nav-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
.cp-main { width: 100%; max-width: 1200px; margin: 15px auto; padding: 0 10px; }
@media (max-width: 992px) { .cp-action-text { display: none; } .cp-action-item { padding: 8px; } }
@media (max-width: 768px) { .cp-header-container { flex-wrap: wrap; } .cp-search { order: 3; min-width: 100%; margin-top: 10px; max-width: 100%; } .nav-toggle { display: block; } }
`;

let cssContent = fs.readFileSync(cssFile, 'utf8');
if (!cssContent.includes('.cp-header { background: #4f46e5;')) {
  fs.appendFileSync(cssFile, extraCSS);
  console.log('Appended CSS to style.css');
}

// 2. Định dạng mới cho Header & Footer
const headerContent = `  <!-- Hidden dummy items to satisfy main.js DOM bindings -->
  <ul id="main-nav">
    <li><a href="index.html" id="nav-home">Home</a></li>
    <li><a href="products.html" id="nav-products">Products</a></li>
    <li id="nav-profile" style="display:none;"><a href="profile.html">Profile</a></li>
    <li id="nav-admin-dashboard-li" style="display:none;"><a href="admin.html">Admin</a></li>
    <li id="nav-login"><a href="login.html">Login</a></li>
    <li id="nav-register"><a href="register.html">Register</a></li>
    <li id="nav-logout" style="display:none;"><a href="#">Logout</a></li>
  </ul>

  <!-- ----- CELLPHONES INSPIRED HEADER ----- -->
  <header class="cp-header">
    <div class="cp-header-container">
      <button class="nav-toggle" id="nav-toggle"><i class="fas fa-bars"></i></button>
      
      <a href="index.html" class="cp-logo">HYPERBUY</a>
      
      <form class="cp-search" action="products.html" method="GET" style="display:flex; position:relative; width:100%;">
        <button type="submit" style="background:transparent; border:none; position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#666; cursor:pointer; padding:0; z-index:10;">
          <i class="fas fa-search" style="position:static; transform:none;"></i>
        </button>
        <input type="text" name="name" placeholder="Bạn cần tìm gì hôm nay?" style="width:100%; padding:10px 15px 10px 40px; border-radius:10px; border:none; font-size:0.9rem; color:#333; box-shadow:inset 0 1px 3px rgba(0,0,0,0.1); outline:none;" />
      </form>

      <div class="cp-header-actions">
        <a href="tel:19001234" class="cp-action-item" style="background: transparent;">
          <i class="fas fa-phone-volume"></i>
          <div class="cp-action-text"><span>Gọi mua hàng</span><span>1900.1234</span></div>
        </a>
        <a href="#" class="cp-action-item">
          <i class="fas fa-map-marked-alt"></i>
          <div class="cp-action-text"><span>Cửa hàng</span><span>gần bạn</span></div>
        </a>
        <a href="my-orders.html" class="cp-action-item" id="nav-my-orders">
          <i class="fas fa-shipping-fast"></i>
          <div class="cp-action-text"><span>Tra cứu</span><span>đơn hàng</span></div>
        </a>
        <a href="cart.html" class="cp-action-item" id="nav-cart-link-li" style="position:relative;">
          <i class="fas fa-shopping-bag"></i>
          <div class="cp-action-text"><span>Giỏ</span><span>hàng</span></div>
          <span class="cart-item-count-nav" style="position:absolute; top:-6px; right:-6px; background:#fff; color:#4f46e5; display:none; border-radius:10px; padding:2px 6px; font-weight:700; font-size:0.75rem;"></span>
        </a>

        <!-- JS Dynamic Auth Button -->
        <a href="login.html" class="cp-action-item" id="cp-auth-btn">
          <i class="fas fa-user-circle"></i>
          <div class="cp-action-text"><span id="cp-auth-l1">Đăng</span><span id="cp-auth-l2">nhập</span></div>
        </a>
        
        <!-- Notification Dropdown -->
        <div id="nav-notification-bell" style="display:none; position:relative;">
           <a href="#" id="notification-bell-link" class="cp-action-item" style="padding-left:0;">
             <i class="fas fa-bell"></i>
             <span id="notification-count" class="notification-badge" style="display:none;"></span>
           </a>
           <div id="notification-dropdown" class="notification-list-dropdown" style="position:absolute; right:0; top:40px; background:#fff; color:#333; width:300px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:none;">
              <ul id="notification-list-items" style="list-style:none; padding:10px; margin:0; max-height:300px; overflow-y:auto;"></ul>
           </div>
        </div>
      </div>
    </div>
  </header>`;

const footerContent = `  <!-- ----- FOOTER ----- -->
  <footer style="background: #fff; padding: 40px 0 20px; border-top: 1px solid #e5e7eb; color: #4b5563;">
    <div class="cp-main" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 10px;">
        <div>
            <h4 style="font-size: 1.05rem; font-weight:700; color:#111; margin-bottom: 18px;">Tổng đài hỗ trợ miễn phí</h4>
            <p style="font-size: 0.9rem; margin-bottom: 8px;">Gọi mua hàng: <strong style="color:#4f46e5;">1800.2097</strong> (7h30 - 22h00)</p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;">Gọi khiếu nại: <strong style="color:#4f46e5;">1800.2063</strong> (8h00 - 21h30)</p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;">Gọi bảo hành: <strong style="color:#4f46e5;">1800.2064</strong> (8h00 - 21h00)</p>
        </div>
        <div>
            <h4 style="font-size: 1.05rem; font-weight:700; color:#111; margin-bottom: 18px;">Thông tin và chính sách</h4>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Mua hàng và thanh toán Online</a></p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Mua hàng trả góp Online</a></p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Chính sách giao hàng</a></p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Đổi trả & Bảo hành</a></p>
        </div>
        <div>
            <h4 style="font-size: 1.05rem; font-weight:700; color:#111; margin-bottom: 18px;">Dịch vụ và thông tin khác</h4>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Khách hàng doanh nghiệp (B2B)</a></p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Quy chế hoạt động</a></p>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><a href="#" style="color:#4b5563; text-decoration:none;">Chính sách bảo mật</a></p>
        </div>
        <div>
            <h4 style="font-size: 1.05rem; font-weight:700; color:#111; margin-bottom: 18px;">Kết nối với HyperBuy</h4>
            <div style="font-size: 1.8rem; display: flex; gap: 15px; color: #4f46e5;">
                <a href="#" style="color:#4f46e5;"><i class="fab fa-facebook"></i></a>
                <a href="#" style="color:#4f46e5;"><i class="fab fa-youtube"></i></a>
                <a href="#" style="color:#4f46e5;"><i class="fab fa-instagram"></i></a>
                <a href="#" style="color:#4f46e5;"><i class="fab fa-tiktok"></i></a>
            </div>
            <div style="margin-top:20px;">
                <h4 style="font-size: 1.05rem; font-weight:700; color:#111; margin-bottom: 10px;">Thanh toán miễn phí</h4>
                <div style="display:flex; gap:10px;">
                   <i class="fab fa-cc-visa" style="font-size:2rem; color:#1434CB;"></i>
                   <i class="fab fa-cc-mastercard" style="font-size:2rem; color:#EB001B;"></i>
                   <i class="fab fa-cc-paypal" style="font-size:2rem; color:#003087;"></i>
                </div>
            </div>
        </div>
    </div>
    <div style="text-align: center; margin-top: 40px; padding-top:20px; border-top:1px solid #eee; font-size: 0.85rem; color: #888;">
        © <span id="current-year">2026</span> Công ty TNHH HyperBuy. Địa chỉ: Khu Công Nghệ Cao. Mọi quyền được bảo lưu.
    </div>
  </footer>`;

const jsSync = `
  <script>
    // Handle Authentication UI toggle manually since we overwrote the default nav
    document.addEventListener("DOMContentLoaded", () => {
      const token = localStorage.getItem("authToken");
      const cpAuthBtn = document.getElementById('cp-auth-btn');
      const cpAuthL1 = document.getElementById('cp-auth-l1');
      const cpAuthL2 = document.getElementById('cp-auth-l2');
      if(token && cpAuthBtn && cpAuthL1 && cpAuthL2) {
          cpAuthL1.innerText = 'Smember';
          cpAuthL2.innerText = 'Tài khoản';
          cpAuthBtn.href = window.location.pathname.includes('my-store') || window.location.pathname.includes('seller') ? 'my-store.html' : 'profile.html';
      }

      // Handle notification bell toggle
      const bellLink = document.getElementById('notification-bell-link');
      if(bellLink) {
          bellLink.addEventListener('click', (e) => {
              e.preventDefault();
              const drop = document.getElementById('notification-dropdown');
              if(drop) drop.style.display = drop.style.display === 'none' ? 'block' : 'none';
          });
      }
    });
  </script>`;

// Đọc tất cả file .html (trừ index.html vì đã làm bằng tay)
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

let count = 0;
for (let file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Header: Replace only if it contains the old header markup, to avoid blowing up admin custom headers.
  if (/<header class="main-header"/i.test(content) || (/<header>/i.test(content) && !content.includes('admin-header'))) {
    if (!content.includes('cp-header')) {
      content = content.replace(/<header[\s\S]*?<\/header>/ig, headerContent);
      changed = true;
    }
  }

  // Footer: Replace the generic footer
  if (/<footer/i.test(content)) {
    if (!content.includes('Tổng đài hỗ trợ miễn phí')) {
      content = content.replace(/<footer[\s\S]*?<\/footer>/ig, footerContent);
      changed = true;
    }
  }

  // Inject logic for the new header to work if not already injected
  if (changed && !content.includes('cp-auth-l1')) {
    content = content.replace(/<\/body>/i, jsSync + '\n</body>');
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log('Synchronized UI on: ' + file);
  }
}

console.log('SUCCESS: Updated ' + count + ' files with the new Cellphones UI sync.');
