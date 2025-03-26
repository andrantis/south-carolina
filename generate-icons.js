const sharp = require("sharp");
const fs = require("fs");

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp("icon.svg").resize(size, size).png().toFile(`icon-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);
