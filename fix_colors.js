const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('ProductCard.tsx') && content.startsWith('// I will write a script')) {
    content = content.replace('// I will write a script to replace them all at once since there are multiple files.', '"use client";');
  }
  
  content = content.replace(/brand-teal/g, '[#4B9B9E]');
  content = content.replace(/brand-red/g, '[#A3292E]');
  
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/ProductCard.tsx',
  'src/components/Header.tsx',
  'src/app/page.tsx',
  'src/app/layout.tsx'
];

files.forEach(f => replaceInFile(path.join('e:/Files/store-happyboy', f)));
console.log('Done');
