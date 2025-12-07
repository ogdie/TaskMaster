# 🔧 Configuração de Variáveis de Ambiente na Vercel

## ⚠️ IMPORTANTE

**NÃO** configure variáveis de ambiente no arquivo `vercel.json`. As variáveis devem ser configuradas diretamente no painel da Vercel.

## 📋 Variáveis Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

### 1. Acesse o Painel da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**

### 2. Adicione as Variáveis

Adicione cada uma das seguintes variáveis:

#### NextAuth
```
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=https://seu-dominio.vercel.app
```

**Importante**: `NEXTAUTH_URL` deve ser a URL completa do seu app na Vercel (ex: `https://taskmaster-omega-self.vercel.app`)

#### MongoDB
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### OAuth GitHub
```
GITHUB_ID=seu_github_client_id
GITHUB_SECRET=seu_github_client_secret
```

#### OAuth Google
```
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

**Nota**: O código também aceita `GOOGLE_ID` e `GOOGLE_SECRET` como fallback, mas recomenda-se usar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

### 3. Configurar para Todos os Ambientes

Ao adicionar cada variável, certifique-se de selecionar:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### 4. Redeploy

Após adicionar todas as variáveis:
1. Vá em **Deployments**
2. Clique nos três pontos (⋯) do deployment mais recente
3. Selecione **Redeploy**

## 🔍 Verificação

Após o redeploy, verifique se está funcionando:

1. Acesse: `https://seu-dominio.vercel.app/api/health`
   - Deve retornar `{"status":"healthy",...}`

2. Tente fazer login
   - Deve funcionar tanto com OAuth quanto com credenciais

## ❌ Problemas Comuns

### Erro: "Por favor defina a variável de ambiente MONGODB_URI no .env"

**Causa**: A variável não está configurada no painel da Vercel ou o deployment não foi atualizado.

**Solução**:
1. Verifique se a variável está configurada em **Settings** → **Environment Variables**
2. Faça um novo deploy ou redeploy após adicionar as variáveis

### Erro 500 no /api/health

**Causa**: Variáveis de ambiente não configuradas ou MongoDB URI inválida.

**Solução**:
1. Verifique todas as variáveis no painel da Vercel
2. Teste a conexão MongoDB localmente primeiro
3. Verifique os logs da Vercel: `vercel logs`

### OAuth não funciona

**Causa**: URLs de callback não configuradas corretamente nos provedores OAuth.

**Solução**:
1. **GitHub**: Configure callback URL como `https://seu-dominio.vercel.app/api/auth/callback/github`
2. **Google**: Configure callback URL como `https://seu-dominio.vercel.app/api/auth/callback/google`
3. Certifique-se de que `NEXTAUTH_URL` está configurado corretamente

## 📝 Checklist

Antes de fazer deploy, verifique:

- [ ] Todas as variáveis estão configuradas no painel da Vercel
- [ ] `NEXTAUTH_URL` aponta para a URL correta do seu app
- [ ] `MONGODB_URI` está correta e acessível
- [ ] URLs de callback OAuth estão configuradas nos provedores
- [ ] Foi feito redeploy após adicionar as variáveis

