# 📁 PASTA PUBLIC - ASSETS DO PROJETO RAVAR

Esta pasta contém os assets públicos (imagens) do projeto RAVAR Imóveis.

## 🎯 IMAGENS NECESSÁRIAS

Você precisa **fazer upload de 3 imagens PNG** nesta pasta:

### 1️⃣ `logo-ravar-branco.png`
- **Uso:** Logo branco para fundos escuros (Header transparente da home, Menu mobile, Footer)
- **Formato:** PNG com fundo transparente
- **Cor:** Branco (#FFFFFF)
- **Dimensões sugeridas:** Altura ~200-300px (width proporcional)

### 2️⃣ `logo-ravar-colorido.png`
- **Uso:** Logo colorido para fundos claros (Header com scroll, páginas internas)
- **Formato:** PNG com fundo transparente
- **Cores:** Navy (#0A1929) e Dourado (#AF9042)
- **Dimensões sugeridas:** Altura ~200-300px (width proporcional)

### 3️⃣ `marca-dagua-ravar.png`
- **Uso:** Marca d'água sobreposta nas fotos dos imóveis
- **Formato:** PNG com fundo transparente
- **Cor:** Branco (#FFFFFF) ou cinza claro
- **Dimensões sugeridas:** 800x400px a 1200x600px (horizontal)
- **Observação:** Será aplicada com opacidade 20-30% automaticamente

---

## ✅ COMO FAZER UPLOAD

1. Prepare as 3 imagens PNG com os nomes **EXATOS** listados acima
2. Faça upload das 3 imagens na pasta `/public/`
3. Certifique-se que os nomes dos arquivos estão **idênticos** (incluindo letras minúsculas e hífens)
4. O site irá carregar automaticamente as imagens após o deploy

---

## 🔧 ONDE AS IMAGENS SÃO USADAS

### `logo-ravar-branco.png`
- **Navbar.tsx:** Header transparente da homepage
- **Navbar.tsx:** Menu mobile (fundo escuro)
- **Footer.tsx:** Rodapé do site

### `logo-ravar-colorido.png`
- **Navbar.tsx:** Header com scroll ativo
- **Navbar.tsx:** Header de páginas internas (não-home)

### `marca-dagua-ravar.png`
- **PropertyCard.tsx:** Cards de listagem de imóveis (página Explorar)
- **PropertyDetail.tsx:** Imagem principal e thumbnails na página de detalhes

---

## ⚠️ IMPORTANTE

- **NÃO renomeie os arquivos** - o código está configurado para estes nomes exatos
- **Use PNG com transparência** - para integração perfeita com os fundos
- **Mantenha boa qualidade** - as imagens serão exibidas em telas de alta resolução
- **A marca d'água deve ser horizontal** - será aplicada sem rotação

---

## 📦 STATUS ATUAL

Após fazer upload, verifique se os 3 arquivos estão presentes:

- [ ] `/public/logo-ravar-branco.png`
- [ ] `/public/logo-ravar-colorido.png`
- [ ] `/public/marca-dagua-ravar.png`

---

**✨ Desenvolvido para RAVAR Imóveis Selecionados**
