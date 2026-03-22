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

for (let file of filesToProcess) {
  if (file.endsWith('fix_ui.js') || file.endsWith('fix_ui2.js')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We are undoing the line-clamp and using Flex-grow instead for product titles
  const badCSSRegex = /display: -webkit-box;\s*-webkit-line-clamp: 2;\s*-webkit-box-orient: vertical;\s*overflow: hidden;\s*min-height: 2.64rem;/g;
  content = content.replace(badCSSRegex, 'flex-grow: 1;');

  // Also `.card-body` needs to be flex-grow
  const cardBodyTarget = /\.product-card-v2 \.card-body \{([\s\S]*?padding: 0 !important;[\s\S]*?)\}/g;
  content = content.replace(cardBodyTarget, (match, p1) => {
    if (!p1.includes('display: flex')) {
      return `.product-card-v2 .card-body {${p1}
      display: flex !important;
      flex-direction: column;
      flex-grow: 1;
    }`;
    }
    return match;
  });

  // product-card-v2 needs height: 100%
  const cardRootTarget = /\.product-card-v2 \{([\s\S]*?overflow: visible !important;)[\s\S]*?\}/g;
  content = content.replace(cardRootTarget, (match, p1) => {
    if (!match.includes('height: 100%')) {
      return match.replace('{', '{\n      height: 100% !important;');
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Fixed Flexbox on', path.basename(file));
  }
}
console.log('Successfully applied flexbox to ' + count + ' files.');
