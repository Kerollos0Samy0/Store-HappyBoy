const sharp = require('sharp');

async function crop() {
  const meta = await sharp('public/logo.png').metadata();
  // crop off the bottom 25% to remove the lines
  await sharp('public/logo.png')
    .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.75) })
    .toFile('public/logo_cropped.png');
  console.log("Done");
}
crop();
