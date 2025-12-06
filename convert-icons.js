
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512, 96];
const publicDir = path.join(__dirname, 'public');

async function convertIcons() {
  try {
    // Converter ícones normais
    for (const size of sizes) {
      await sharp(path.join(publicDir, `icon-${size}x${size}.svg`))
        .png()
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
      console.log(`✅ icon-${size}x${size}.png criado`);
    }

    // Converter ícones maskable
    for (const size of [192, 512]) {
      await sharp(path.join(publicDir, `icon-maskable-${size}x${size}.svg`))
        .png()
        .toFile(path.join(publicDir, `icon-maskable-${size}x${size}.png`));
      console.log(`✅ icon-maskable-${size}x${size}.png criado`);
    }

    // Limpar SVGs
    sizes.forEach(size => fs.unlinkSync(path.join(publicDir, `icon-${size}x${size}.svg`)));
    [192, 512].forEach(size => fs.unlinkSync(path.join(publicDir, `icon-maskable-${size}x${size}.svg`)));
    
    console.log('✅ SVGs convertidos e removidos!');
  } catch (error) {
    console.error('❌ Erro na conversão:', error);
  }
}

convertIcons();
