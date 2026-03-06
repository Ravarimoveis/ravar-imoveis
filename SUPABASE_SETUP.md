# 🏢 Sistema de Gestão de Imóveis RAVAR - Supabase

## ✅ Configuração Completa

O sistema Supabase foi **configurado com sucesso** e está pronto para uso! Você agora tem um sistema profissional de gestão de imóveis com banco de dados e armazenamento de imagens.

---

## 🎯 O que foi criado

### 1. **Backend Completo (Supabase Edge Functions)**
- ✅ API REST completa com endpoints CRUD
- ✅ Storage automático de imagens (bucket público)
- ✅ Upload de múltiplas fotos com URLs públicas
- ✅ Sistema de organização por ID do imóvel

### 2. **Frontend Integrado**
- ✅ Hook `useProperties` para gerenciar dados
- ✅ Painel Admin completo em `/admin`
- ✅ Página de Setup/Migração em `/setup`
- ✅ Integração automática com todas as páginas

### 3. **Funcionalidades**
- ✅ Criar novos imóveis
- ✅ Editar imóveis existentes
- ✅ Deletar imóveis (remove fotos do storage)
- ✅ Upload de múltiplas imagens
- ✅ URLs públicas automáticas
- ✅ Sistema "Sob Consulta" para preços

---

## 🚀 Como Usar

### **PASSO 1: Migração Inicial** (Execute apenas uma vez)

Acesse a página de setup para migrar os 9 imóveis mockados para o Supabase:

```
https://seu-app.vercel.app/setup
```

1. Clique em **"Iniciar Migração"**
2. Aguarde a conclusão (todos os imóveis serão salvos no banco)
3. Pronto! Os imóveis já estão no Supabase

---

### **PASSO 2: Gerenciar Imóveis**

Acesse o painel administrativo:

```
https://seu-app.vercel.app/admin
```

#### **Adicionar Novo Imóvel:**
1. Clique em **"Novo Imóvel"**
2. Preencha os dados (ID, título, tipo, valores, características)
3. Faça upload das fotos (múltiplas de uma vez)
4. Clique em **"Criar Imóvel"**

#### **Editar Imóvel:**
1. Clique em **"Editar"** no card do imóvel
2. Modifique os campos necessários
3. Adicione ou remova fotos
4. Clique em **"Atualizar Imóvel"**

#### **Deletar Imóvel:**
1. Clique em **"Deletar"** no card do imóvel
2. Confirme a exclusão
3. O imóvel e suas fotos serão removidos permanentemente

---

## 📸 Upload de Fotos Reais

### **Como substituir fotos do Unsplash pelas fotos reais:**

1. Acesse `/admin`
2. Clique em **"Editar"** no imóvel RAVA-010
3. Role até **"Fotos do Imóvel"**
4. Remova as fotos do Unsplash (clique no ❌)
5. Clique em **"Upload de fotos"** e selecione suas 20 fotos reais
6. As fotos serão enviadas automaticamente para o Supabase Storage
7. URLs públicas serão geradas automaticamente
8. Clique em **"Atualizar Imóvel"**

**Importante:** Selecione todas as 20 fotos de uma vez (Ctrl+Click ou Shift+Click) para fazer upload simultâneo.

---

## 🗂️ Estrutura do Sistema

### **Banco de Dados (KV Store)**
```
property:RAVA-001  → Dados do imóvel RAVA-001
property:RAVA-002  → Dados do imóvel RAVA-002
property:RAVA-010  → Dados do imóvel RAVA-010
...
```

### **Storage (Imagens)**
```
make-e68c254a-property-images/
  └── RAVA-010/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.jpg
      └── ...
  └── RAVA-011/
      ├── 1234567892-ghi789.jpg
      └── ...
```

---

## 🔗 Endpoints da API

Base URL: `https://{projectId}.supabase.co/functions/v1/make-server-e68c254a`

### **Propriedades:**
- `GET /properties` - Lista todos os imóveis
- `GET /properties/:id` - Busca um imóvel específico
- `POST /properties` - Cria novo imóvel
- `PUT /properties/:id` - Atualiza imóvel
- `DELETE /properties/:id` - Remove imóvel

### **Imagens:**
- `POST /upload-image` - Upload de imagem (FormData)
- `DELETE /properties/:id/images/:filename` - Remove imagem

---

## 💡 Fluxo Completo de Trabalho

### **Adicionando um Novo Imóvel Real:**

1. **Prepare os dados:**
   - ID: `RAVA-011`
   - Título, bairro, características
   - 20 fotos em alta qualidade

2. **Acesse `/admin`**

3. **Clique "Novo Imóvel"**

4. **Preencha o formulário:**
   - ID: `RAVA-011`
   - Título: "Mansão Contemporânea Morumbi"
   - Tipo: Venda
   - Categoria: Luxo Extremo
   - Preço: 0 (se Sob Consulta) ou valor em R$
   - Área, quartos, suítes, etc.

5. **Upload das fotos:**
   - Clique no campo de upload
   - Selecione as 20 fotos
   - Aguarde o upload (verá progresso)

6. **Clique "Criar Imóvel"**

7. **Pronto!** O imóvel aparece em:
   - Homepage (`/`)
   - Página Explorar (`/explorar`)
   - Página de Detalhes (`/imovel/RAVA-011`)

---

## 🔒 Segurança

- ✅ Storage público (imóveis são conteúdo público)
- ✅ KV Store protegido (apenas servidor acessa)
- ✅ Service Role Key no servidor (nunca exposta ao frontend)
- ✅ URLs assinadas para controle de acesso (se necessário)

---

## ⚠️ Limitações

- **Tamanho máximo por foto:** 10MB
- **Formatos suportados:** JPG, JPEG, PNG, WEBP
- **Storage gratuito:** 1GB (Supabase Free Tier)

---

## 🎨 Próximos Passos

### **Para o imóvel RAVA-010:**
1. ✅ Fazer upload das 20 fotos reais
2. ⏳ Atualizar preço, condomínio e IPTU com valores reais
3. ⏳ Revisar descrição e características

### **Para expandir o portfólio:**
1. ⏳ Adicionar mais imóveis via `/admin`
2. ⏳ Fazer upload de fotos profissionais
3. ⏳ Manter dados atualizados

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Supabase Edge Functions (Deno + Hono)
- **Banco de Dados:** Supabase KV Store
- **Storage:** Supabase Storage (bucket público)
- **Frontend:** React + TypeScript
- **API:** RESTful com autenticação

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique os logs do navegador (console)
2. Verifique os logs do Supabase Functions
3. Teste os endpoints diretamente via Postman/Insomnia

---

## ✨ Recursos Especiais

### **Sistema "Sob Consulta"**
- Preço = 0 → Mostra "Sob Consulta"
- Condomínio = 0 → Mostra "Sob Consulta"
- IPTU = 0 → Mostra "Sob Consulta"

### **IDs Automáticos**
- Sistema sugere próximo ID disponível: `RAVA-0XX`

### **Ordenação**
- Imóveis mais recentes aparecem primeiro

---

**🎉 Sistema pronto para produção!** Agora você tem controle total sobre o portfólio RAVAR sem precisar mexer no código. 🏠✨
