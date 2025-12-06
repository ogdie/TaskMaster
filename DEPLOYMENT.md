# 🚀 Guia de Deploy em Vercel

## Pré-requisitos

- [ ] Conta no Vercel (https://vercel.com)
- [ ] Projeto no GitHub/GitLab/Bitbucket
- [ ] MongoDB Atlas cluster criado (https://www.mongodb.com/cloud/atlas)
- [ ] GitHub/Google OAuth apps criados (opcional)

---

## Passo 1: Preparar o Repositório

### 1.1 Inicializar Git (se não tiver)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Fazer Push para GitHub
```bash
# Criar repositório em https://github.com/new
git remote add origin https://github.com/seu-usuario/projeto01.git
git branch -M main
git push -u origin main
```

---

## Passo 2: Configurar Variáveis de Ambiente

### 2.1 Gerar NEXTAUTH_SECRET
```bash
node scripts/generate-secrets.js
# ou
openssl rand -base64 32
```

### 2.2 Obter Credenciais MongoDB
1. Acesse https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Copie a connection string
4. Formato: `mongodb+srv://user:password@cluster.mongodb.net/projeto01?retryWrites=true&w=majority`

### 2.3 OAuth Apps (opcional)

**GitHub:**
1. Acesse https://github.com/settings/developers
2. New OAuth App
3. Authorization callback URL: `https://seu-app.vercel.app/api/auth/callback/github`
4. Copie Client ID e Client Secret

**Google:**
1. Acesse https://console.cloud.google.com
2. Create new project
3. Enable OAuth consent screen
4. Create OAuth 2.0 Client IDs
5. Authorized redirect URIs: `https://seu-app.vercel.app/api/auth/callback/google`
6. Copie Client ID e Client Secret

---

## Passo 3: Deploy no Vercel

### 3.1 Conectar ao Vercel
```bash
npm install -g vercel
vercel
```

Ou via UI em https://vercel.com/new

### 3.2 Configurar Environment Variables

No Vercel Dashboard → Settings → Environment Variables:

| Variável | Valor | Segredo? |
|----------|-------|---------|
| `MONGODB_URI` | Sua connection string | ✅ Sim |
| `NEXTAUTH_SECRET` | Gerado no passo 2.1 | ✅ Sim |
| `NEXTAUTH_URL` | https://seu-app.vercel.app | ❌ Não |
| `GITHUB_ID` | Seu GitHub ID | ❌ Não |
| `GITHUB_SECRET` | Seu GitHub Secret | ✅ Sim |
| `GOOGLE_ID` | Seu Google ID | ❌ Não |
| `GOOGLE_SECRET` | Seu Google Secret | ✅ Sim |

### 3.3 Deploy

```bash
# Deploy automático (branch main)
git push origin main

# Ou deploy manual
vercel --prod
```

---

## Passo 4: Validar Deploy

### 4.1 Verificar Health Check
```bash
curl https://seu-app.vercel.app/api/health
# Resposta esperada: { "status": "healthy", ... }
```

### 4.2 Verificar Service Worker
1. Abra https://seu-app.vercel.app
2. DevTools (F12) → Application → Service Workers
3. Deve estar "activated"

### 4.3 Testar Offline Mode
1. DevTools → Network → Offline
2. Recarregue a página
3. Deve carregar do cache

### 4.4 Verificar PWA
1. DevTools → Application → Manifest
2. Deve ter nome, ícones, cores configurados

---

## Passo 5: Configurações Pós-Deploy

### 5.1 Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add Domain
3. Seguir instruções de DNS

### 5.2 SSL/TLS
- ✅ Automático (Let's Encrypt)
- Verificar: Settings → SSL/TLS

### 5.3 Analytics
1. Vercel Dashboard → Analytics
2. Monitorar Core Web Vitals

### 5.4 Monitoring
```bash
# Chamar health check periodicamente
curl -X GET https://seu-app.vercel.app/api/health

# Alertar se status !== "healthy"
```

---

## Edge Caching em Vercel

### Estratégia de Cache Implementada

```
/_next/static/*         → 1 ano (immutable)
/api/health            → 30s cache, 60s edge
/api/tasks/*           → 0s cache, 30s edge (private)
/public/*              → 1 hora cache, 1 dia edge
/manifest.json         → 1 hora cache, 1 dia edge
/service-worker.js     → Sempre revalidar (must-revalidate)
```

### Como Funciona

1. **First Request**: Próximo ao origin (MongoDB)
2. **Subsequent Requests**: Servido do edge (próximo ao usuário)
3. **Revalidation**: Automático após TTL
4. **Invalidation**: Deploy automático invalida /_next/static

---

## Troubleshooting

### ❌ "MONGODB_URI is required"
- [ ] Verificar se variável foi adicionada no Vercel
- [ ] Redeploy após adicionar variável
- [ ] Verificar formato da string

### ❌ "Service Worker not registered"
- [ ] Verificar vercel.json headers para /service-worker.js
- [ ] Cache-Control não deve ter immutable
- [ ] Limpar cache do navegador

### ❌ "OAuth callback failed"
- [ ] Verificar NEXTAUTH_URL corresponde ao domínio
- [ ] Verificar NEXTAUTH_SECRET é diferente entre envs
- [ ] Verificar redirect URIs nas OAuth apps

### ❌ "Offline mode não funciona"
- [ ] Verificar PWA_ENABLED=true
- [ ] Verificar manifest.json está sendo servido
- [ ] Verificar service-worker.js não está sendo cacheado indefinidamente

---

## Performance

### Expected Performance
- FCP (First Contentful Paint): ~1.2s
- LCP (Largest Contentful Paint): ~2.5s
- CLS (Cumulative Layout Shift): <0.1
- TTFB (Time to First Byte): ~200ms (edge) vs ~500ms (origin)

### Monitorar Web Vitals
```javascript
// Adicionado automaticamente em next.config.mjs
import { withPWA } from 'next-pwa';
export const nextConfig = withPWA({...});
```

---

## Suporte

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Versão**: 1.0
**Data**: Dezembro 6, 2025
