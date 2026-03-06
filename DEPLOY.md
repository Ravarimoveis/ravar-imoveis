# 🚀 Guia de Deploy - RAVAR Vercel

## ⚡ Deploy Rápido (5 minutos)

### PASSO 1: GitHub

1. **Criar repositório no GitHub:**
   - Acesse: https://github.com/new
   - Nome: `ravar-imoveis`
   - Privado ou Público (sua escolha)
   - **NÃO** adicione README, .gitignore ou licença (já temos)
   - Clique "Create repository"

2. **Fazer upload do código:**
   
   **Opção A - Via GitHub Desktop (Recomendado):**
   - Baixe: https://desktop.github.com
   - Instale e faça login
   - File → Add Local Repository
   - Selecione a pasta do projeto
   - Commit inicial: "Initial commit - RAVAR System"
   - Publish repository

   **Opção B - Via Terminal:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - RAVAR System"
   git branch -M main
   git remote add origin https://github.com/RavatImoveis/ravar-imoveis.git
   git push -u origin main
   ```

   **Opção C - Via GitHub Web (Upload direto):**
   - No repositório criado, clique "uploading an existing file"
   - Arraste TODOS os arquivos da pasta do projeto
   - Commit: "Initial commit - RAVAR System"
   - Clique "Commit changes"

---

### PASSO 2: Vercel

1. **Criar conta/Login na Vercel:**
   - Acesse: https://vercel.com
   - Clique "Sign Up" ou "Log In"
   - Escolha "Continue with GitHub"
   - Autorize a Vercel no GitHub

2. **Importar Projeto:**
   - Na dashboard Vercel, clique "Add New..." → "Project"
   - Selecione "Import Git Repository"
   - Encontre `ravar-imoveis` e clique "Import"

3. **Configurar Deploy:**
   - **Framework Preset:** Vite (detecta automaticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **⚠️ IMPORTANTE - Variáveis de Ambiente:**
   
   Clique em **"Environment Variables"** e adicione:

   ```
   SUPABASE_URL = [seu-supabase-url]
   SUPABASE_ANON_KEY = [sua-supabase-anon-key]
   SUPABASE_SERVICE_ROLE_KEY = [sua-service-role-key]
   ```

   **Onde encontrar essas chaves:**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto
   - Settings → API
   - Copie:
     - `URL` → SUPABASE_URL
     - `anon public` → SUPABASE_ANON_KEY
     - `service_role` (⚠️ SECRET!) → SUPABASE_SERVICE_ROLE_KEY

5. **Deploy:**
   - Clique "Deploy"
   - Aguarde 2-3 minutos
   - 🎉 Site no ar!

---

### PASSO 3: Testar

Após deploy:

1. **Acesse seu site:**
   - URL: `https://ravar-imoveis.vercel.app`
   - Ou o domínio personalizado que a Vercel gerou

2. **Teste as páginas:**
   - ✅ Homepage: `https://seu-site.vercel.app/`
   - ✅ Explorar: `https://seu-site.vercel.app/explorar`
   - ✅ Setup: `https://seu-site.vercel.app/setup`
   - ✅ Admin: `https://seu-site.vercel.app/admin`

3. **Migre os dados:**
   - Acesse `/setup`
   - Clique "Iniciar Migração"
   - Aguarde completar

4. **Gerencie imóveis:**
   - Acesse `/admin`
   - Adicione, edite ou remova imóveis
   - Faça upload das fotos reais

---

## 🌐 Domínio Personalizado (Opcional)

### Usar seu próprio domínio:

1. **Na Vercel:**
   - Vá para Settings → Domains
   - Clique "Add Domain"
   - Digite: `www.ravarimoveis.com.br`

2. **No seu provedor de domínio:**
   - Adicione registro CNAME:
     - Name: `www`
     - Value: `cname.vercel-dns.com`
   - Ou siga instruções da Vercel

3. **Aguarde propagação (5-30 minutos)**

---

## 🔄 Deploy Automático

A partir de agora, **cada push no GitHub = deploy automático**:

```bash
# Fazer alterações no código
git add .
git commit -m "Nova feature"
git push

# Vercel faz deploy automaticamente!
```

---

## 📊 Monitoramento

**Dashboard Vercel:**
- Analytics de visitantes
- Logs de erro
- Performance metrics
- Deploy history

**Acesse:** https://vercel.com/dashboard

---

## 🆘 Problemas Comuns

### "Build failed"
- Verifique se as variáveis de ambiente estão corretas
- Confira os logs na Vercel

### "Page not found" no refresh
- Vercel.json já está configurado para SPA routing
- Se persistir, recheck vercel.json

### "API Error"
- Verifique se as variáveis do Supabase estão corretas
- Confirme que o Supabase Functions está rodando

---

## 🎯 Checklist Final

Antes de compartilhar o site:

- [ ] Deploy na Vercel funcionando
- [ ] Todas as páginas carregando
- [ ] Dados migrados via /setup
- [ ] Fotos reais do RAVA-010 no /admin
- [ ] Filtros funcionando na página Explorar
- [ ] WhatsApp configurado (opcional)
- [ ] Domínio personalizado (opcional)

---

## 🚀 Site Ao Vivo!

Parabéns! Seu site está no ar:
- **Vercel URL:** https://ravar-imoveis.vercel.app
- **Admin:** https://ravar-imoveis.vercel.app/admin
- **Setup:** https://ravar-imoveis.vercel.app/setup

Agora é só compartilhar! 🎉
