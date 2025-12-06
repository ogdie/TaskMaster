const fs = require('fs');
const path = require('path');

// Simples SVG para PNG converter usando canvas
// Para produção, considere usar sharp ou similar

const createSvgIcon = (size, isMaskable = false) => {
  const bgColor = isMaskable ? 'ffffff' : '1f2937'; // branco para maskable, cinza escuro para normal
  const textColor = isMaskable ? '000000' : 'ffffff';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#${bgColor}"/>
  <text x="50%" y="50%" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#${textColor}" font-family="Arial, sans-serif">
    TM
  </text>
  <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.15}" fill="#10b981" opacity="0.8"/>
</svg>`;
};

// Criar SVGs temporários
const sizes = [
  { size: 192, name: 'icon-192x192' },
  { size: 512, name: 'icon-512x512' },
  { size: 96, name: 'icon-96x96' },
  { size: 192, name: 'icon-maskable-192x192', maskable: true },
  { size: 512, name: 'icon-maskable-512x512', maskable: true }
];

// Como não temos sharp/canvas nativo, vamos criar SVGs e avisar ao user
const publicDir = path.join(__dirname, 'public');

console.log('📦 Criando ícones SVG para PWA...\n');

sizes.forEach(({ size, name, maskable }) => {
  const svg = createSvgIcon(size, maskable);
  const svgPath = path.join(publicDir, `${name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ ${name}.svg criado (${size}x${size})`);
});

console.log('\n⚠️  Próximo passo: Converter SVGs para PNG');
console.log('Instale sharp: npm install sharp');
console.log('Ou use uma ferramenta online: https://convertio.co/svg-png/\n');

// Criar scripts de conversão
const convertScript = `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512, 96];
const publicDir = path.join(__dirname, 'public');

async function convertIcons() {
  try {
    // Converter ícones normais
    for (const size of sizes) {
      await sharp(path.join(publicDir, \`icon-\${size}x\${size}.svg\`))
        .png()
        .toFile(path.join(publicDir, \`icon-\${size}x\${size}.png\`));
      console.log(\`✅ icon-\${size}x\${size}.png criado\`);
    }

    // Converter ícones maskable
    for (const size of [192, 512]) {
      await sharp(path.join(publicDir, \`icon-maskable-\${size}x\${size}.svg\`))
        .png()
        .toFile(path.join(publicDir, \`icon-maskable-\${size}x\${size}.png\`));
      console.log(\`✅ icon-maskable-\${size}x\${size}.png criado\`);
    }

    // Limpar SVGs
    sizes.forEach(size => fs.unlinkSync(path.join(publicDir, \`icon-\${size}x\${size}.svg\`)));
    [192, 512].forEach(size => fs.unlinkSync(path.join(publicDir, \`icon-maskable-\${size}x\${size}.svg\`)));
    
    console.log('✅ SVGs convertidos e removidos!');
  } catch (error) {
    console.error('❌ Erro na conversão:', error);
  }
}

convertIcons();
`;

fs.writeFileSync(path.join(__dirname, 'convert-icons.js'), convertScript);
console.log('💾 Arquivo convert-icons.js criado para conversão posterior');
