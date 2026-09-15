const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  'import Link from "next/link";',
  'import Link from "next/link";\nimport Image from "next/image";'
);

code = code.replace(
  `{/* eslint-disable-next-line @next/next/no-img-element */}\n            <img src={images[currentImgIndex]?.url} alt={product.name} className="object-cover w-full h-full" />`,
  `<Image src={images[currentImgIndex]?.url} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover" />`
);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
