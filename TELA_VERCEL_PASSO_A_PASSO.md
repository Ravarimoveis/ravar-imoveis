# 🎯 Configurar Deploy na Vercel - Passo a Passo

## ✅ O que você vê na tela:

- ✅ Repository conectado: `Ravarimoveis/ravar-imoveis`
- ✅ Vercel Team: `ravarimoveis' projects`
- ✅ Project Name: `ravar-imoveis`
- ✅ Framework: Vite (detectado automaticamente)
- ⏳ FALTA: Adicionar variáveis de ambiente

---

## 🚨 IMPORTANTE - ANTES DE CLICAR "DEPLOY"

Você **DEVE** adicionar as variáveis de ambiente do Supabase, senão o site não vai funcionar!

---

## 📋 PASSO A PASSO:

### **1. Clique em "Environment Variables"**

Na tela que você está vendo, role para baixo e clique em:

```
▶ Environment Variables
```

Isso vai expandir uma seção.

---

### **2. Adicione as 3 Variáveis do Supabase**

Você precisa adicionar **3 variáveis**. Para cada uma:

#### **Variável 1: SUPABASE_URL**

1. No campo **"KEY"**, digite:
   ```
   SUPABASE_URL
   ```

2. No campo **"VALUE"**, cole a URL do seu Supabase
   - Para pegar: Vá em https://supabase.com/dashboard
   - Clique no seu projeto
   - Settings → API
   - Copie **"Project URL"**
   - Deve ser algo como: `https://abcdefghijk.supabase.co`

3. Deixe **"All"** selecionado (Production, Preview, Development)

4. Clique **"Add"**

---

#### **Variável 2: SUPABASE_ANON_KEY**

1. No campo **"KEY"**, digite:
   ```
   SUPABASE_ANON_KEY
   ```

2. No campo **"VALUE"**, cole a chave anon
   - No mesmo lugar do Supabase (Settings → API)
   - Copie **"anon public"** (chave longa)

3. Deixe **"All"** selecionado

4. Clique **"Add"**

---

#### **Variável 3: SUPABASE_SERVICE_ROLE_KEY**

1. No campo **"KEY"**, digite:
   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```

2. No campo **"VALUE"**, cole a service role key
   - No mesmo lugar do Supabase (Settings → API)
   - Role para baixo e copie **"service_role"** (⚠️ chave secreta!)

3. Deixe **"All"** selecionado

4. Clique **"Add"**

---

### **3. Verifique**

Você deve ver **3 variáveis** adicionadas:
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

---

### **4. Clique em "Deploy"**

Agora sim! Clique no botão preto gigante:

```
Deploy
```

---

### **5. Aguarde (2-3 minutos)**

Você vai ver:
- ⏳ Building...
- ⏳ Deploying...
- ✅ Success!

Tome um café ☕

---

### **6. Acesse seu Site!**

Quando terminar, a Vercel vai mostrar:

```
🎉 Congratulations!
```

E vai ter um botão **"Visit"** ou mostrar a URL:

```
https://ravar-imoveis.vercel.app
```

**Clique** e veja seu site no ar! 🚀

---

## 📋 Resumo Visual do Que Fazer:

```
1. [▶ Environment Variables] ← Clique aqui
   
2. Adicione:
   KEY: SUPABASE_URL
   VALUE: [sua-url]
   [Add]

3. Adicione:
   KEY: SUPABASE_ANON_KEY
   VALUE: [sua-chave-anon]
   [Add]

4. Adicione:
   KEY: SUPABASE_SERVICE_ROLE_KEY
   VALUE: [sua-chave-service-role]
   [Add]

5. [Deploy] ← Clique aqui

6. Aguarde 2-3 minutos ☕

7. [Visit] ← Clique para ver o site!
```

---

## 🔍 Onde Pegar as Chaves do Supabase:

1. Vá para: **https://supabase.com/dashboard**
2. Clique no **seu projeto**
3. Lado esquerdo: **Settings** (ícone de engrenagem)
4. Clique em **API**
5. Você vai ver:

```
Project URL: https://xxxxx.supabase.co
                    ↑
                Copie isso para SUPABASE_URL

anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    ↑
                Copie isso para SUPABASE_ANON_KEY

service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  (⚠️ SECRET)       ↑
                Copie isso para SUPABASE_SERVICE_ROLE_KEY
```

---

## ⚠️ NÃO CLIQUE "DEPLOY" SEM AS VARIÁVEIS!

Se clicar sem adicionar, o site vai dar erro. Se isso acontecer:

1. Vá em **Settings** (do projeto na Vercel)
2. **Environment Variables**
3. Adicione as 3 variáveis
4. Vá em **Deployments**
5. Clique nos **3 pontinhos** do último deploy
6. **Redeploy**

---

## 🎉 Depois do Deploy:

Quando estiver no ar, acesse:

1. **Homepage:** `https://ravar-imoveis.vercel.app/`
2. **Setup (migrar dados):** `https://ravar-imoveis.vercel.app/setup`
3. **Admin:** `https://ravar-imoveis.vercel.app/admin`

---

## 🆘 Problemas?

### "Build Failed"
- Verifique se adicionou as 3 variáveis
- Confira se copiou corretamente (sem espaços extras)

### "Runtime Error"
- As variáveis estão corretas?
- O projeto Supabase está ativo?

### Página em branco
- Aguarde 5 minutos
- Limpe cache (Ctrl+Shift+R)
- Tente em aba anônima

---

**Agora é só seguir os passos! Dúvidas em algum passo específico?** 🚀
