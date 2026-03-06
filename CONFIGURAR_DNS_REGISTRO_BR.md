# 🇧🇷 Configurar DNS no Registro.br para Vercel

## 📋 Informações que Você Precisa (da Vercel):

### **Domínio ravarimoveis.com.br:**
```
Type: A
Name: @
Value: 212.83.167.90
```

### **Domínio www.ravarimoveis.com.br:**
```
Type: CNAME
Name: www
Value: cname-china.vercel-dns.com
```

---

## 🎯 PASSO A PASSO NO REGISTRO.BR

### **1. Acesse o Registro.br**

1. Vá para: https://registro.br
2. Clique em **"Entrar"** (canto superior direito)
3. Faça login com seu CPF/CNPJ e senha

---

### **2. Acesse "Meus Domínios"**

1. Após fazer login, você vai cair no painel
2. No menu lateral ou no topo, clique em **"Meus Domínios"**
3. Você verá a lista dos seus domínios
4. Localize **ravarimoveis.com.br**

---

### **3. Editar Zona DNS**

1. Clique em **ravarimoveis.com.br** (ou no botão de ações ao lado)
2. Procure por uma dessas opções:
   - **"Editar Zona"**
   - **"DNS"**
   - **"Gerenciar DNS"**
   - **"Configurar DNS"**

**IMPORTANTE:** Você precisa estar usando os **servidores DNS do Registro.br**

---

### **4. Verificar Servidores DNS**

Antes de editar, confirme que está usando os servidores DNS do Registro.br:

**Servidores corretos:**
```
ns1.dnsbr.net
ns2.dnsbr.net
ns3.dnsbr.net
```

**Se estiver usando outros servidores:**
- Você vai precisar configurar no outro provedor DNS
- Ou alterar para usar os DNS do Registro.br

---

### **5. Adicionar/Editar Registros DNS**

Agora você vai adicionar os 2 registros:

---

#### **REGISTRO 1: Raiz do Domínio (ravarimoveis.com.br)**

Procure por um registro do tipo **"A"** existente ou clique em **"Adicionar Registro"**

**Preencha:**
```
Tipo: A
Host/Nome: @ 
(ou deixe vazio, ou "ravarimoveis.com.br")

Valor/Apontamento/IP: 212.83.167.90

TTL: 3600 (ou deixe o padrão)
```

**Clique em "Adicionar" ou "Salvar"**

---

#### **REGISTRO 2: WWW (www.ravarimoveis.com.br)**

Clique em **"Adicionar Registro"** novamente

**Preencha:**
```
Tipo: CNAME
Host/Nome: www

Valor/Apontamento: cname-china.vercel-dns.com
(certifique-se de incluir o ponto final se o sistema pedir)

TTL: 3600 (ou deixe o padrão)
```

**Clique em "Adicionar" ou "Salvar"**

---

### **6. Revisar e Confirmar**

Depois de adicionar os 2 registros, você deve ver algo assim na lista:

| Tipo  | Host/Nome | Valor/Destino              | TTL  |
|-------|-----------|----------------------------|------|
| A     | @         | 212.83.167.90              | 3600 |
| CNAME | www       | cname-china.vercel-dns.com | 3600 |

**Confirme que está tudo correto e salve!**

---

## ⏱️ AGUARDAR PROPAGAÇÃO

Depois de salvar no Registro.br:

- ⏱️ **Tempo típico:** 30 minutos a 2 horas
- ⏱️ **Tempo máximo:** Até 48 horas
- 🔄 **O que fazer:** Aguarde e teste periodicamente

---

## 🔍 Como Verificar:

### **1. Na Vercel (a cada 10-15 minutos):**

1. Volte para a página de Domains na Vercel
2. Clique em **"Refresh"** ou recarregue a página
3. O status vai mudar de ❌ para ✅ quando funcionar

---

### **2. No Navegador:**

1. Abra uma **aba anônima** (Ctrl+Shift+N)
2. Acesse: `https://ravarimoveis.com.br`
3. Se mostrar erro, aguarde mais um pouco
4. Limpe o cache se necessário (Ctrl+F5)

---

### **3. Ferramenta de Verificação DNS:**

Você pode usar ferramentas online para verificar a propagação:

- https://dnschecker.org
- Digite: `ravarimoveis.com.br`
- Selecione: **A Record**
- Clique em **Search**
- Deve mostrar: `212.83.167.90`

Faça o mesmo para `www.ravarimoveis.com.br` (tipo CNAME)

---

## 🆘 Problemas Comuns no Registro.br

### **"Não consigo editar a zona DNS"**

**Possível causa:** Você está usando servidores DNS de outro provedor

**Solução:**
1. No painel do Registro.br
2. Clique em **"Alterar Servidores DNS"**
3. Selecione **"Usar servidores DNS do Registro.br"**
4. Confirme
5. Aguarde 24h para propagar
6. Depois edite a zona DNS

---

### **"O registro @ não funciona"**

**Alternativa:**
- Em vez de `@`, deixe o campo **vazio**
- Ou digite o domínio completo: `ravarimoveis.com.br`

---

### **"CNAME precisa terminar com ponto (.)"**

Alguns sistemas DNS pedem o ponto final:

Em vez de:
```
cname-china.vercel-dns.com
```

Use:
```
cname-china.vercel-dns.com.
```

(Note o ponto no final)

---

### **"Já existe um registro A ou CNAME"**

**Solução:**
- **Edite** o registro existente em vez de criar um novo
- Ou **delete** o antigo e crie um novo com os valores da Vercel

---

## 📸 Resumo Visual

**Antes (Estado Atual):**
```
❌ ravarimoveis.com.br → Inválido
❌ www.ravarimoveis.com.br → Inválido
```

**Depois de configurar DNS:**
```
⏳ ravarimoveis.com.br → Aguardando propagação
⏳ www.ravarimoveis.com.br → Aguardando propagação
```

**Quando propagar (30min - 48h):**
```
✅ ravarimoveis.com.br → Funcionando! 🎉
✅ www.ravarimoveis.com.br → Funcionando! 🎉
🔒 Ambos com HTTPS automático
```

---

## 🎯 Checklist Completo

- [ ] Login no Registro.br
- [ ] Acessei "Meus Domínios"
- [ ] Cliquei em ravarimoveis.com.br
- [ ] Entrei em "Editar Zona DNS"
- [ ] Verifiquei que estou usando DNS do Registro.br
- [ ] Adicionei registro A: @ → 212.83.167.90
- [ ] Adicionei registro CNAME: www → cname-china.vercel-dns.com
- [ ] Salvei as alterações
- [ ] Aguardei propagação (30min - 48h)
- [ ] Testei no navegador
- [ ] Verifiquei status na Vercel
- [ ] Site funcionando! 🚀

---

## 🔒 SSL/HTTPS Automático

**Não precisa fazer nada!**

Depois que o DNS propagar, a Vercel automaticamente:
- ✅ Gera certificado SSL grátis
- ✅ Ativa HTTPS
- ✅ Renova automaticamente
- ✅ Redireciona HTTP → HTTPS

Tudo automático! 🎉

---

## 📞 Precisa de Ajuda?

Se encontrar dificuldades:

1. **Tire um print** da tela do Registro.br
2. **Me mostre** qual tela está vendo
3. **Te ajudo** com o passo específico!

---

**Boa sorte! Em algumas horas seu site estará no ar!** 🚀🇧🇷
