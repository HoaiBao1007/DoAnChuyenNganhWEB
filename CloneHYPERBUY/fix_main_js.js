const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

const anchor = '        console.warn("❌ Lỗi khi load chi tiết sản phẩm:", result);';
const idx = js.indexOf(anchor);

if (idx !== -1) {
    let nextNewline = js.indexOf('\\n', idx);
    if (js.charAt(nextNewline - 1) === '\\r') nextNewline--; // Optional CRLF check
    const insertPosition = js.indexOf('\\n', nextNewline) + 1; // Start of next line

    // The missing block from 1424 to 1580
    const missingBlock = `        contentEl.innerHTML = \`<p class="error-message">
            Lỗi tải chi tiết sản phẩm: \${result.data?.message || result.error || "Không tìm thấy sản phẩm"}.
            <a href="products.html">Quay lại danh sách sản phẩm</a>.
        </p>\`;
        return;
    }

    const p = result.data.result || result.data;
    console.log("🧩 Product object:", p);

    const realProductId = p.id || Number(productIdFromUrl);
    console.log("👉 realProductId =", realProductId);

    const currentUserRole = getUserRole();
    const currentUserId = localStorage.getItem("currentUserId");
    console.log("🔐 currentUserRole =", currentUserRole);
    console.log("🔐 currentUserId =", currentUserId);

    const sellerInfo = p.sellerInfo || {};
    console.log("🧑‍💼 sellerInfo.userId =", sellerInfo.userId);

    document.title = \`\${p.name || "Sản phẩm"} - HyperBuy\`;

    // --------- Xử lý image URL ----------
    let imgUrl =
        p.imageUrl ||
        \`https://placehold.co/400x300/EFEFEF/AAAAAA&text=\${encodeURIComponent(
            p.name || "SP"
        )}\`;

    if (imgUrl.startsWith("http://productservice")) {
        imgUrl = imgUrl.replace(/^http:\\/\\/productservice:\\d+/, PRODUCT_IMAGE_BASE_URL);
    } else if (imgUrl.startsWith("http://localhost:8081")) {
        imgUrl = imgUrl.replace("http://localhost:8081", PRODUCT_IMAGE_BASE_URL);
    } else if (
        !imgUrl.startsWith("http://") &&
        !imgUrl.startsWith("https://") &&
        imgUrl.includes("/")
    ) {
        imgUrl = \`\${PRODUCT_IMAGE_BASE_URL}\${imgUrl}\`;
    } else if (
        !imgUrl.startsWith("http://") &&
        !imgUrl.startsWith("https://") &&
        !imgUrl.includes("/")
    ) {
        imgUrl = \`\${PRODUCT_IMAGE_BASE_URL}/product-images/\${imgUrl}\`;
    }

    const pName = p.name || "Tên SP không rõ";
    const pPriceNum = parseFloat(p.price) || 0;
    const productCategoryName =
        p.category?.name ||
        (p.categoryId && categoryMap.get(String(p.categoryId))) ||
        "Chưa phân loại";

    // --------- Mô tả & thông số kỹ thuật ----------
    let mainDesc = p.description || "Chưa có mô tả.";
    let techSpecsHtml = "";

    const descLines = mainDesc.split("\\n");
    const specsArr = [];
    const generalDescLines = [];

    descLines.forEach((line) => {
        if (line.includes(":") && line.length < 100 && line.length > 3) {
            specsArr.push(line);
        } else {
            generalDescLines.push(line);
        }
    });

    mainDesc = generalDescLines.join("<br>");

    if (specsArr.length > 0) {
        techSpecsHtml =
            '<div class="tech-specs"><h3>Thông số kỹ thuật</h3><div class="tech-specs-columns">';
        specsArr.forEach((spec) => {
            const parts = spec.split(":");
            const label = parts[0]?.trim();
            const value =
                parts.slice(1).join(":")?.trim() || (label ? "" : spec);
            if (label) {
                techSpecsHtml += \`<div class="spec-item"><strong>\${label}:</strong> \${value}</div>\`;
            } else if (value) {
                techSpecsHtml += \`<div class="spec-item spec-value-only">\${value}</div>\`;
            }
        });
        techSpecsHtml += "</div></div>";
    }

    // --------- Thông tin seller + nút xem cửa hàng ----------
    let sellerInfoHtml = "";
    if (sellerInfo && (sellerInfo.userId || sellerInfo.storeId)) {
        const sellerDisplayName = sellerInfo.username || "N/A";
        const sellerIdForButton = sellerInfo.userId;

        sellerInfoHtml = \`
            <div class="seller-info-section" style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
                <p>Được bán bởi: <strong>\${sellerDisplayName}</strong></p>
                <button class="btn btn-secondary btn-sm btn-view-seller"
                        data-seller-id="\${sellerIdForButton}" 
                        data-seller-username="\${sellerInfo.username || ""}" 
                        data-seller-store="\${sellerInfo.storeId || ""}">
                    Xem Chi Tiết Cửa Hàng
                </button>
            </div>\`;
    }

    // --------- Seller được phép quản lý sản phẩm? ----------
    let productManagementControls = "";
    const isSameSeller =
        currentUserRole === "SELLER" &&
        sellerInfo &&
        sellerInfo.userId &&
        currentUserId &&
        sellerInfo.userId === currentUserId;

    if (isSameSeller) {
        const isActive = p.active !== false;
        const statusText = isActive
            ? \`<span style="color:green;font-weight:bold;">Đang bán</span>\`
            : \`<span style="color:orange;font-weight:bold;">Ngưng bán</span>\`;

        productManagementControls = \`
            <div class="seller-product-controls" style="margin-top:20px;padding-top:15px;border-top:1px solid #ddd;">
                <h4>Quản lý sản phẩm của bạn</h4>
                <p>Trạng thái: \${statusText}</p>

                <a href="edit-product.html?id=\${realProductId}" 
                   class="btn btn-info btn-sm" style="margin-right:8px;">
                    ✏️ Sửa sản phẩm
                </a>

                <button class="btn \${
                    isActive ? "btn-warning" : "btn-success"
                } btn-sm seller-toggle-status"
                        data-product-id="\${realProductId}">
                    \${isActive ? "⛔ Ngưng bán" : "🛒 Bán lại"}
                </button>

                <button class="btn btn-danger btn-sm seller-delete-product"
                        data-product-id="\${realProductId}">
                    🗑️ Xóa sản phẩm
                </button>
            </div>
        \`;
    }

`;

    const newJs = js.substring(0, insertPosition) + missingBlock + js.substring(insertPosition);
    fs.writeFileSync('js/main.js', newJs, 'utf8');
    console.log("Restored missing logic successfully!");
} else {
    console.log("Anchor not found.");
}
