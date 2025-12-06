This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🎯 Sobre o Projeto

**TaskMaster** é um aplicativo web moderno de gerenciamento de tarefas, desenvolvido com Next.js, React, Redux e NextAuth.js. O aplicativo oferece autenticação de usuários via credenciais, GitHub e Google, com interface responsiva otimizada para smartphones.

### ✨ Principais Características

- 🔐 Autenticação com NextAuth.js (Credenciais, GitHub, Google)
- ✅ CRUD completo de tarefas
- 🎨 Interface moderna com tema neon preto e verde fluorescente
- 📱 Design totalmente responsivo para mobile
- 🌐 Redux para gerenciamento de estado global
- 💾 Integração com MongoDB
- 🔄 Atualizações em tempo real com RTK Query
- 📱 Progressive Web App (PWA) com suporte offline
- 🔍 Error tracking e performance monitoring com Sentry
- 📊 Rastreamento de Web Vitals (FCP, LCP, CLS, TTFB, INP)
- ⚡ React Compiler para otimizações automáticas
- 🎯 Service Workers para cache e funcionalidade offline

## 🚀 Getting Started

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MongoDB

### Instalação

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
projeto01/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globais com gradiente neon
│   │   ├── layout.js            # Layout raiz com Providers
│   │   ├── page.js              # Página inicial
│   │   ├── error.jsx            # Error boundary customizado (Sentry)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── options.js    # Configurações NextAuth
│   │       │   ├── signup/       # Rota de registro
│   │       │   └── [...nextauth]/ # Dinâmica NextAuth
│   │       └── tasks/            # Rota de tarefas
│   ├── components/
│   │   ├── Header.jsx            # Cabeçalho com tema neon
│   │   ├── LoginForm.jsx         # Formulário de login
│   │   ├── SignUpModal.jsx       # Modal de cadastro
│   │   ├── TaskForm.jsx          # Formulário de tarefa
│   │   ├── TaskList.jsx          # Lista de tarefas
│   │   ├── Providers.jsx         # SessionProvider e ReduxProvider
│   │   ├── ReduxProvider.jsx     # Provedor Redux
│   │   └── WebVitalsTracker.jsx  # Rastreamento de Web Vitals
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js     # Slice de autenticação
│   │   ├── tasks/
│   │   │   └── tasksApi.js      # RTK Query API
│   │   └── ui/
│   │       └── uiSlice.js       # Slice de UI
│   ├── hooks/
│   │   └── useErrorTracking.js  # Hook para capturar erros (Sentry)
│   ├── lib/
│   │   ├── mongodb.js           # Conexão MongoDB
│   │   ├── sentry.config.js     # Configuração Sentry
│   │   └── sentry-examples.js   # Exemplos de uso Sentry
│   ├── models/
│   │   ├── Task.js              # Schema Mongoose Task
│   │   └── User.js              # Schema Mongoose User
│   ├── instrumentation.ts       # Inicialização Sentry server-side
│   └── store.js                 # Configuração Redux
├── public/
│   ├── manifest.json            # Manifest PWA
│   └── service-worker.js        # Service Worker (gerado automaticamente)
├── package.json
├── tailwind.config.js           # Configuração Tailwind
├── next.config.mjs              # Configuração Next.js + PWA
├── DEPLOYMENT.md                # Guia de deploy em Vercel
├── SENTRY_SETUP.md             # Guia de configuração Sentry
└── README.md
```

## 🎨 Design & Responsividade

### Tema Visual
- **Paleta de Cores**: Preto + Verde Fluorescente (#00ff00)
- **Gradiente de Fundo**: Linear gradient (135deg) preto → verde → preto
- **Bordas Destacadas**: Verde fluorescente (2px) em modais e cards
- **Texto em Destaque**: Verde fluorescente para títulos e labels

### Breakpoints Responsivos
- **Mobile**: < 640px
- **Tablet/Desktop**: ≥ 640px

Classes responsivas utilizadas:
- `sm:` para breakpoint tablet
- Padding e margin ajustados para cada tamanho
- Fontes responsivas (text-xs/sm/base)
- Layouts flexíveis (flex-col/sm:flex-row)

## 🔧 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Next.js** | 16.0.6 | Framework React com SSR |
| **React** | 19.2.0 | Biblioteca UI |
| **Tailwind CSS** | 4 | Utility-first CSS |
| **Redux Toolkit** | 2.11.0 | Gerenciamento de estado |
| **RTK Query** | - | Data fetching |
| **NextAuth.js** | 4.24.13 | Autenticação |
| **MongoDB** | - | Banco de dados NoSQL |
| **Mongoose** | 9.0.0 | ODM para MongoDB |
| **React Hook Form** | 7.67.0 | Gerenciamento de formulários |
| **bcryptjs** | 3.0.3 | Hash de senhas |
| **Sentry** | 10.29.0 | Error tracking e performance monitoring |
| **next-pwa** | 5.6.0 | Progressive Web App |
| **web-vitals** | 3.5.2 | Métricas de performance web |
| **workbox-window** | 7.4.0 | Service Workers |
| **React Icons** | 5.5.0 | Biblioteca de ícones |
| **React Compiler** | 1.0.0 | Otimizações automáticas |
| **Sharp** | 0.34.5 | Otimização de imagens |

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# NextAuth
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://seu_mongodb_uri

# OAuth GitHub
GITHUB_ID=seu_github_id
GITHUB_SECRET=seu_github_secret

# OAuth Google
GOOGLE_ID=seu_google_id
GOOGLE_SECRET=seu_google_secret

# Sentry (Opcional - para error tracking)
NEXT_PUBLIC_SENTRY_DSN=https://seu-dsn@sentry.io/projeto-id
NEXT_PUBLIC_SENTRY_ENV=development
NEXT_PUBLIC_APP_VERSION=1.0.0

# PWA (Opcional)
PWA_ENABLED=true
```

## 🔐 Autenticação

- **Credenciais**: Email e senha (registrados no MongoDB com hash bcrypt)
- **OAuth GitHub**: Integração via NextAuth
- **OAuth Google**: Integração via NextAuth

## 📱 Funcionalidades Mobile

✅ Header responsivo com menu adaptado
✅ Formulários com campos visíveis e placeholders
✅ Modais otimizados para telas pequenas
✅ Inputs com bordas destacadas
✅ Botões com tamanho adequado para touch
✅ Scroll suave implementado
✅ Sem scroll horizontal (overflow-x: hidden)

## 📱 Progressive Web App (PWA)

O TaskMaster é um **Progressive Web App** completo, oferecendo experiência similar a aplicativos nativos:

- ✅ **Instalável**: Pode ser instalado na tela inicial do dispositivo
- ✅ **Offline-first**: Funciona sem conexão à internet
- ✅ **Service Workers**: Cache inteligente de recursos
- ✅ **Manifest**: Configuração completa com ícones e temas
- ✅ **Atalhos**: Acesso rápido a funcionalidades principais
- ✅ **Share Target**: Compartilhamento de conteúdo para o app

### Como Instalar

1. Acesse o app no navegador mobile
2. Toque no menu do navegador (⋮ ou ⋯)
3. Selecione "Adicionar à tela inicial" ou "Install App"
4. O app será instalado como um aplicativo nativo

## 🔍 Monitoring & Error Tracking

### Sentry Integration

O projeto está integrado com **Sentry** para monitoramento completo:

- ✅ **Error Tracking**: Captura automática de erros React e JavaScript
- ✅ **Performance Monitoring**: Rastreamento de Web Vitals (FCP, LCP, CLS, TTFB, INP)
- ✅ **Session Replay**: Gravação de sessões quando ocorrem erros
- ✅ **Breadcrumbs**: Rastreamento de ações do usuário e requisições HTTP
- ✅ **Error Boundary**: Tratamento elegante de erros na UI

### Web Vitals Tracked

- **FCP** (First Contentful Paint): Tempo até primeiro conteúdo renderizado
- **LCP** (Largest Contentful Paint): Tempo do maior elemento visível
- **CLS** (Cumulative Layout Shift): Instabilidade de layout
- **TTFB** (Time to First Byte): Tempo até primeira resposta do servidor
- **INP** (Interaction to Next Paint): Tempo de resposta a interações do usuário

### Configuração

Veja o guia completo em [SENTRY_SETUP.md](./SENTRY_SETUP.md)

## 🚀 Deploy

O projeto está otimizado para deploy na **Vercel** com:

- ✅ Edge caching configurado
- ✅ Headers de cache otimizados
- ✅ Service Workers funcionando em produção
- ✅ Build otimizado com React Compiler
- ✅ Imagens otimizadas com Sharp

Veja o guia completo de deploy em [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Documentação Adicional

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia completo de deploy em Vercel
- [SENTRY_SETUP.md](./SENTRY_SETUP.md) - Configuração e uso do Sentry
