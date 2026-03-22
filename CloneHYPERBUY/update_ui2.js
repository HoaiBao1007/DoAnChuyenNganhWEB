const fs = require('fs');
const path = require('path');

const dir = __dirname;

// ===== 1. Add admin-back button CSS and JS globally to style.css =====
const cssFile = path.join(dir, 'css', 'style.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const adminBtnCSS = `
/* ============================================================
   ADMIN BACK BUTTON & GLOBAL UI CONSISTENCY FIXES
   ============================================================ */

/* Red-theme breadcrumb override */
.page-banner {
  background: #4338ca !important;
}
.breadcrumb a { color: rgba(255,255,255,0.9) !important; }
.breadcrumb a:hover { color: #fff !important; }

/* Filter sidebar – red accent override */
.filter-sidebar input:focus,
.filter-sidebar select:focus {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 3px rgba(215,0,24,0.1) !important;
}
.filter-sidebar-title i { color: #4f46e5 !important; }
.btn-filter-apply {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
}
.filter-group-label i { color: #4f46e5 !important; }

/* Products topbar count badge – red */
.count-badge {
  background: #e0e7ff !important;
  color: #4f46e5 !important;
}

/* Auth form – red accent */
.auth-form h2 {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
input:focus, select:focus, textarea:focus {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 3px rgba(215,0,24,0.12) !important;
}

/* Admin back button shown on public pages for admin users */
#cp-admin-back-btn {
  display: none;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.35);
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}
#cp-admin-back-btn:hover {
  background: rgba(0,0,0,0.4);
}
#cp-admin-back-btn i { font-size: 1rem; }
`;

if (!cssContent.includes('#cp-admin-back-btn')) {
  fs.appendFileSync(cssFile, adminBtnCSS);
  console.log('✅ Appended admin button CSS + fix CSS to style.css');
}

// ===== 2. Admin back button JS snippet (to be injected before </body>) =====
const adminBtnJS = `
  <script>
    // Auto-show admin back button if user is ADMIN
    (function() {
      try {
        const role = localStorage.getItem('userRole') || '';
        const token = localStorage.getItem('authToken');
        if (token && (role === 'ADMIN' || role === 'admin')) {
          const btn = document.getElementById('cp-admin-back-btn');
          if (btn) btn.style.display = 'flex';
        }
      } catch(e) {}
    })();
  </script>`;

// ===== 3. Admin button HTML snippet to inject INSIDE .cp-header-actions =====
const adminBtnHTML = `
        <!-- Admin Back Button (shown only for ADMIN role) -->
        <a href="admin.html" class="cp-action-item" id="cp-admin-back-btn" style="display:none;">
          <i class="fas fa-cogs"></i>
          <div class="cp-action-text"><span>Quay về</span><span>Quản Trị</span></div>
        </a>`;

// ===== 4. Process all HTML files except admin pages =====
const SKIP_FILES = ['admin.html', 'admin-voucher.html', 'admin-send-notification.html', 'index.html'];
const files = fs.readdirSync(dir).filter(f =>
  f.endsWith('.html') && !SKIP_FILES.includes(f)
);

let count = 0;
for (let file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Inject admin back button HTML before the closing </div> of cp-header-actions
  if (content.includes('cp-header-actions') && !content.includes('cp-admin-back-btn')) {
    content = content.replace(
      /(<\/div>\s*\n\s*<\/div>\s*\n\s*<\/header>)/,
      adminBtnHTML + '\n$1'
    );
    changed = true;
  }

  // Inject the JS before </body>
  if (changed && !content.includes('cp-admin-back-btn')) {
    content = content.replace(/<\/body>/i, adminBtnJS + '\n</body>');
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Updated: ${file}`);
  }
}

// ===== Handle index.html SEPARATELY since it needs the same button =====
const indexPath = path.join(dir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('cp-admin-back-btn')) {
  // Insert before notification bell area
  indexContent = indexContent.replace(
    /<!-- Notification Dropdown -->/,
    `<!-- Admin Back Button (shown only for ADMIN role) -->
        <a href="admin.html" class="cp-action-item" id="cp-admin-back-btn" style="display:none;">
          <i class="fas fa-cogs"></i>
          <div class="cp-action-text"><span>Quay về</span><span>Quản Trị</span></div>
        </a>

        <!-- Notification Dropdown -->`
  );

  // Add JS auto-show logic before closing script
  indexContent = indexContent.replace(
    /\/\/ Handle notification bell toggle manually/,
    `// Auto-show admin back button if user is ADMIN
    (function() {
      try {
        const role = localStorage.getItem('userRole') || '';
        const token = localStorage.getItem('authToken');
        if (token && (role === 'ADMIN' || role === 'admin')) {
          const adminBtn = document.getElementById('cp-admin-back-btn');
          if (adminBtn) adminBtn.style.display = 'flex';
        }
      } catch(e) {}
    })();

    // Handle notification bell toggle manually`
  );

  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Updated: index.html');
  count++;
}

console.log(`\n🎉 SUCCESS: Injected admin back button into ${count} files.`);
