const fs = require('fs');
const files = ['index.html', 'product-detail.html', 'products.html', 'cart.html'];

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/href="css\/style\.css(\?v=\d+)?"/g, 'href="css/style.css?v=' + Date.now() + '"');
    fs.writeFileSync(f, html, 'utf8');
});
console.log("Cache successfully busted!");
