const sharp = require('sharp');
const fs = require('fs');

async function crop() {
  const meta = await sharp('public/logo.png').metadata();
  // Crop off the bottom 35%
  await sharp('public/logo.png')
    .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.65) })
    .toFile('public/logo_temp.png');
    
  fs.copyFileSync('public/logo_temp.png', 'public/logo.png');
  fs.unlinkSync('public/logo_temp.png');
  console.log("Done");
}
crop();
