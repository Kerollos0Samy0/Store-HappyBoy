const sharp = require('sharp');
const fs = require('fs');

async function makeRound() {
  const inputPath = 'src/app/icon.png';
  const outputPath = 'src/app/icon_round.png';
  
  // Create a circular SVG mask
  const width = 256;
  const height = 256;
  const circleSvg = `<svg width="${width}" height="${height}"><circle cx="${width/2}" cy="${height/2}" r="${width/2}" fill="#ffffff"/></svg>`;
  
  await sharp(inputPath)
    .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .composite([{ input: Buffer.from(circleSvg), blend: 'dest-in' }])
    .toFile(outputPath);
    
  // Also add a white background under the circle so it's a solid white circle
  await sharp({ create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } })
    .composite([
      { input: Buffer.from(`<svg width="${width}" height="${height}"><circle cx="${width/2}" cy="${height/2}" r="${width/2}" fill="#ffffff"/></svg>`) },
      { input: outputPath, blend: 'over' }
    ])
    .toFile('src/app/icon_final.png');

  fs.copyFileSync('src/app/icon_final.png', 'src/app/icon.png');
  fs.unlinkSync(outputPath);
  fs.unlinkSync('src/app/icon_final.png');
  console.log("Done");
}

makeRound().catch(console.error);
