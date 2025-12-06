#!/usr/bin/env node

/**
 * Script para gerar NEXTAUTH_SECRET
 * Uso: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('\n🔐 Gerando secrets para NextAuth...\n');

const nextauthSecret = generateSecret(32);
console.log('NEXTAUTH_SECRET:');
console.log(nextauthSecret);

console.log('\n\n📝 Adicione ao arquivo .env ou Vercel Environment Variables:\n');
console.log(`NEXTAUTH_SECRET=${nextauthSecret}`);

console.log('\n\n💡 Ou use este comando para criar openssl:');
console.log('openssl rand -base64 32\n');
