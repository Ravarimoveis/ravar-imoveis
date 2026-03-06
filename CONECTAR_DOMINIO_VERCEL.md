# 🌐 Conectar Domínio na Vercel - Guia Completo

## 🎯 Pré-requisitos

- ✅ Site funcionando na Vercel (você já tem!)
- ✅ Domínio registrado (ex: ravarimoveis.com.br)
- ⏳ Acesso ao painel do seu provedor de domínio

---

## 📋 PASSO 1: Adicionar Domínio na Vercel

### **1. Vá para o Dashboard da Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **"ravar-imoveis"**
3. Clique na aba **"Settings"** (engrenagem)
4. No menu lateral, clique em **"Domains"**

---

### **2. Adicione Seu Domínio**

1. Você vai ver um campo **"Add Domain"**
2. Digite seu domínio:
   ```
   ravarimoveis.com.br
   ```
   ou
   ```
   www.ravarimoveis.com.br
   ```

3. Clique **"Add"**

---

### **3. A Vercel Vai Mostrar Instruções**

Você verá algo como:

```
⚠️ Invalid Configuration

Add the following record to your DNS settings:

Type: CNAME
Name: www (ou @)
Value: cname.vercel-dns.com
```

**Guarde essas informações!** Você vai precisar no próximo passo.

---

## 📋 PASSO 2: Configurar no Provedor do Domínio

Agora você precisa ir no painel onde você registrou o domínio.

**Provedores comuns no Brasil:**
- Registro.br
- HostGator
- Locaweb
- GoDaddy
- Hostinger
- UOL Host

---

### **Opção A: Domínio COM "www" (Recomendado)**

Se você adicionou `www.ravarimoveis.com.br`:

**No painel do seu provedor:**

1. Procure por **"Gerenciar DNS"** ou **"DNS Settings"**
2. Clique em **"Adicionar Registro"** ou **"Add Record"**
3. Adicione:
   ```
   Tipo: CNAME
   Nome/Host: www
   Valor/Destino: cname.vercel-dns.com
   TTL: 3600 (ou padrão)
   ```
4. Salve

---

### **Opção B: Domínio SEM "www" (Raiz)**

Se você adicionou apenas `ravarimoveis.com.br`:

**No painel do seu provedor:**

1. Procure por **"Gerenciar DNS"**
2. Adicione:
   ```
   Tipo: A
   Nome/Host: @ (ou deixe vazio)
   Valor: 76.76.21.21
   TTL: 3600
   ```

**E também adicione (para www funcionar):**
   ```
   Tipo: CNAME
   Nome/Host: www
   Valor: cname.vercel-dns.com
   TTL: 3600
   ```

---

### **Opção C: Melhor Configuração (AMBOS)**

Para que **tanto** `ravarimoveis.com.br` **quanto** `www.ravarimoveis.com.br` funcionem:

**Adicione 2 registros:**

**Registro 1 (raiz):**
```
Tipo: A
Nome: @ (ou vazio)
Valor: 76.76.21.21
```

**Registro 2 (www):**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**Depois, na Vercel:**
- Adicione ambos os domínios
- Defina um como principal (redirect)

---

## 📋 PASSO 3: Aguardar Propagação

Depois de configurar no provedor:

- ⏱️ Pode levar de **5 minutos a 48 horas**
- Normalmente funciona em **30 minutos a 2 horas**
- Depende do provedor e da localização

---

### **Como Verificar:**

1. **Na Vercel:**
   - Volte em Settings → Domains
   - O status vai mudar de ⚠️ para ✅
   - Pode levar alguns minutos

2. **No navegador:**
   - Acesse seu domínio
   - Se ainda não funcionar, aguarde mais um pouco
   - Limpe o cache (Ctrl+Shift+R)

---

## 🎯 Guias Específicos por Provedor

### **Registro.br**

1. Acesse: https://registro.br
2. Faça login
3. Clique em **"Meus Domínios"**
4. Clique no domínio
5. **"Configurar DNS"** ou **"Alterar Servidores DNS"**
6. Se usar DNS do Registro.br:
   - Clique em **"Editar Zona"**
   - Adicione os registros CNAME/A
7. Salve

---

### **HostGator / Locaweb / Hostinger**

1. Faça login no painel
2. Procure por **"Gerenciador de DNS"** ou **"Zona DNS"**
3. Selecione o domínio
4. Clique em **"Adicionar Registro"**
5. Adicione CNAME/A conforme instruções acima
6. Salve

---

### **GoDaddy**

1. Login no GoDaddy
2. **"Meus Produtos"** → **"Domínios"**
3. Clique em **"DNS"** ao lado do domínio
4. Role até **"Registros"**
5. Clique **"Adicionar"**
6. Adicione CNAME/A
7. Salve

---

## 🔒 PASSO 4: SSL (Automático!)

A Vercel automaticamente configura SSL/HTTPS:

- ✅ Certificado SSL gratuito
- ✅ Renovação automática
- ✅ HTTPS forçado
- ✅ Sem configuração necessária

Aguarde a propagação e o SSL será ativado automaticamente! 🔒

---

## 🎨 PASSO 5: Definir Domínio Principal (Opcional)

Se você adicionou múltiplos domínios (com e sem www):

1. **Na Vercel:**
   - Settings → Domains
2. Clique nos **3 pontinhos** ⋮ ao lado do domínio preferido
3. Clique **"Set as Primary Domain"**
4. Os outros domínios farão redirect automático

**Recomendação:** Use `www.ravarimoveis.com.br` como principal.

---

## ✅ Checklist Completo

- [ ] Adicionei domínio na Vercel (Settings → Domains)
- [ ] Anotei as instruções DNS que a Vercel mostrou
- [ ] Fiz login no provedor do domínio
- [ ] Adicionei registro CNAME (para www)
- [ ] Adicionei registro A (para raiz) - opcional
- [ ] Salvei as configurações
- [ ] Aguardei propagação (30 min - 48h)
- [ ] Domínio funcionando ✅
- [ ] SSL ativado (cadeado 🔒)

---

## 🆘 Problemas Comuns

### **"Invalid Configuration" não sai**
- Aguarde mais tempo (até 48h)
- Verifique se copiou `cname.vercel-dns.com` corretamente
- Confirme que salvou no provedor

### **"DNS_PROBE_FINISHED_NXDOMAIN"**
- DNS ainda não propagou
- Aguarde mais tempo
- Verifique configuração no provedor

### **Site carrega mas sem HTTPS**
- Aguarde mais alguns minutos
- A Vercel está gerando o certificado SSL
- Pode levar até 1 hora

### **Redireciona para site antigo**
- Limpe cache do navegador (Ctrl+Shift+R)
- Tente em aba anônima
- Aguarde propagação completa

---

## 📊 Exemplo Completo (Registro.br)

**Cenário:** Domínio `ravarimoveis.com.br` no Registro.br

### **Na Vercel:**
1. Settings → Domains
2. Add: `www.ravarimoveis.com.br`
3. Add: `ravarimoveis.com.br`

### **No Registro.br:**
1. Login → Meus Domínios
2. Clique em `ravarimoveis.com.br`
3. Editar Zona DNS
4. Adicionar:
   ```
   CNAME | www | cname.vercel-dns.com
   A     | @   | 76.76.21.21
   ```
5. Salvar

### **Aguardar:**
- 30 minutos a 2 horas

### **Resultado:**
- ✅ `ravarimoveis.com.br` → Funciona
- ✅ `www.ravarimoveis.com.br` → Funciona
- ✅ Ambos com HTTPS 🔒

---

## 🎉 Pronto!

Seu site estará disponível em:

```
https://ravarimoveis.com.br
https://www.ravarimoveis.com.br
```

**Profissional e seguro!** 🚀

---

## 💡 Dica Extra: Subdomínios

Quer criar subdomínios? (ex: `admin.ravarimoveis.com.br`)

**Na Vercel:**
1. Settings → Domains
2. Add: `admin.ravarimoveis.com.br`

**No provedor:**
```
CNAME | admin | cname.vercel-dns.com
```

Pronto! 🎯

---

**Qualquer dúvida, me avise!** 📞
