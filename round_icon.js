const sharp = require('sharp');
const fs = require('fs');

async function makeRound() {
  const inputPath = 'src/app/icon_source.png';
  
  const width = 256;
  const height = 256;
  const faceSize = 160; 
  
  // 1. Create the face buffer
  const faceBuffer = await sharp(inputPath)
    .resize(faceSize, faceSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. Create a white circle with transparent corners
  const circleSvg = `<svg width="${width}" height="${height}"><circle cx="${width/2}" cy="${height/2}" r="${width/2}" fill="#ffffff"/></svg>`;
  
  // 3. Composite the face over the white circle
  await sharp(Buffer.from(circleSvg))
    .composite([
      { input: faceBuffer, gravity: 'center' }
    ])
    .png()
    .toFile('src/app/icon.png');

  console.log("Done");
}

makeRound().catch(console.error);
