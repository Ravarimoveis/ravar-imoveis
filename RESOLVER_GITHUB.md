# 🔧 Resolver Problema de Contas no GitHub Desktop

## 🎯 Situação

Você tem 2+ contas do GitHub e o Desktop está enviando para a conta errada.

---

## ✅ SOLUÇÃO 1: Trocar de Conta no GitHub Desktop

### **Passo 1: Remover a Conta Antiga**

1. Abra o **GitHub Desktop**
2. Vá em:
   - **Windows:** File → Options → Accounts
   - **Mac:** GitHub Desktop → Preferences → Accounts
3. Clique em **"Sign Out"** na conta que aparece
4. Confirme

### **Passo 2: Adicionar a Conta Correta (RavatImoveis)**

1. Na mesma tela (Accounts):
2. Clique **"Sign in"**
3. Escolha **"Sign in using your browser"**
4. Faça login com a conta **RavatImoveis**
5. Autorize o GitHub Desktop

### **Passo 3: Reconfigurar o Repositório Local**

1. No GitHub Desktop, clique no repositório atual
2. Repository → Repository Settings
3. Em "Primary remote repository (origin)", clique **"Change"**
4. Selecione ou digite:
   ```
   https://github.com/RavatImoveis/ravar-imoveis.git
   ```
5. Salve

✅ **Pronto! Agora vai subir na conta certa!**

---

## ✅ SOLUÇÃO 2: Se Já Subiu no Repositório Errado

### **Opção A: Transferir o Repositório**

Se já está no GitHub mas na conta errada:

1. Acesse o repositório na conta errada
2. Settings (do repositório)
3. Role até **"Danger Zone"**
4. Clique **"Transfer ownership"**
5. Digite: `RavatImoveis`
6. Confirme

### **Opção B: Deletar e Republicar**

Se preferir recomeçar:

1. **No GitHub (conta errada):**
   - Vá no repositório
   - Settings → Danger Zone
   - Delete this repository
   - Digite o nome para confirmar

2. **No GitHub Desktop:**
   - Repository → Repository Settings
   - Remove (apenas remove do Desktop, não deleta arquivos)

3. **Republicar na conta certa:**
   - Certifique-se de estar logado na conta RavatImoveis
   - Arraste a pasta do projeto para o GitHub Desktop
   - Clique "Create repository"
   - Marque "RavatImoveis" como owner
   - Publish repository

---

## ✅ SOLUÇÃO 3: Organizar Múltiplas Contas (Método Avançado)

Se você trabalha com várias contas frequentemente:

### **No Terminal/Git Bash:**

Para cada repositório, configure manualmente:

```bash
# Navegue até a pasta do projeto
cd caminho/para/ravar-imoveis

# Configure o autor para este projeto específico
git config user.name "Nome da Conta RavatImoveis"
git config user.email "email@ravatimoveis.com"

# Configure a URL remota correta
git remote set-url origin https://github.com/RavatImoveis/ravar-imoveis.git

# Verifique
git config user.name
git config user.email
git remote -v
```

---

## 🎯 MÉTODO RECOMENDADO PARA VOCÊ

Como você está começando, recomendo:

### **Método Simples (5 minutos):**

1. **Faça logout da conta antiga:**
   - GitHub Desktop → Preferences/Options → Accounts
   - Sign Out

2. **Faça login na RavatImoveis:**
   - Sign in → usar navegador
   - Login com RavatImoveis

3. **Se já publicou no lugar errado:**
   - Delete o repositório da conta errada (GitHub web)
   - No Desktop: Remove repository (apenas do Desktop)
   - Adicione novamente: File → Add Local Repository
   - Publish com conta correta

---

## 📋 Verificar Qual Conta Está Ativa

### **No GitHub Desktop:**
- Olhe o canto inferior esquerdo
- Deve mostrar: "Signed in as RavatImoveis"

### **No Terminal:**
```bash
cd pasta-do-projeto
git config user.name
git config user.email
git remote -v
```

Deve mostrar:
- Nome: RavatImoveis (ou seu nome na conta)
- Email: email da conta RavatImoveis
- Remote: github.com/RavatImoveis/...

---

## 🚨 Se Ainda Não Funcionar

### **Reset Completo:**

1. **Desinstale o GitHub Desktop**
   - Windows: Painel de Controle → Desinstalar
   - Mac: Arraste para Lixeira

2. **Delete cache:**
   - Windows: `%APPDATA%\GitHub Desktop`
   - Mac: `~/Library/Application Support/GitHub Desktop`

3. **Reinstale:**
   - Baixe: https://desktop.github.com
   - Instale
   - Login direto com RavatImoveis

4. **Adicione o projeto:**
   - File → Add Local Repository
   - Publish com conta certa

---

## 🎯 Checklist Final

Antes de publicar novamente:

- [ ] GitHub Desktop mostra "Signed in as RavatImoveis"
- [ ] Repository Settings → Remote aponta para RavatImoveis
- [ ] Não tem repositório com mesmo nome na conta errada
- [ ] Fez um commit de teste
- [ ] Publish repository

---

## 💡 Dica: Organização Futura

Para evitar confusão:

1. **Use uma conta por navegador:**
   - Chrome: Conta RavatImoveis
   - Firefox: Conta pessoal

2. **Nomes de repo diferentes:**
   - Conta RavatImoveis: `ravar-imoveis`
   - Conta pessoal: `meu-projeto-pessoal`

3. **GitHub Desktop = 1 conta:**
   - Use apenas RavatImoveis no Desktop
   - Use terminal/web para outras contas

---

## 📞 Passo a Passo Agora:

**FAÇA ISSO:**

1. Abra GitHub Desktop
2. Preferences/Options → Accounts
3. Sign Out (da conta errada)
4. Sign In (com RavatImoveis - use navegador)
5. Se já publicou errado: Delete o repo da conta errada
6. Remove o repo do Desktop (só do Desktop)
7. Add Local Repository novamente
8. Publish com conta correta

**Feito isso, seu projeto vai para a conta certa!** ✅

---

**Precisa de ajuda em algum passo específico? Me avise!**
