<div align="center">

# 🌌 Leonardo Holanda — Portfolio Pessoal

**Portfolio profissional com tema Star Wars — construído com Angular 21, signals e animações CSS cinematográficas.**

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![ESLint](https://img.shields.io/badge/ESLint-0_erros-4B32C3?style=flat-square&logo=eslint)](./eslint.config.js)
[![License](https://img.shields.io/badge/Licença-MIT-green?style=flat-square)](./LICENSE)

[🚀 Ver online](https://www.devleoholandaportfolio.com.br) · [📂 Repositório](https://github.com/holandale0/personal-portfolio)

</div>

---

## 📸 Demonstração

> **[leonardoholanda.dev](https://leonardoholanda.dev)**

| Hero | Skills | Experiência |
|------|--------|-------------|
| Apresentação com avatar e vídeo YouTube | Ranking Jedi com lightsabers animados em CSS | Timeline com Star Wars crawl ao clicar |

---

## 🧑‍💻 Sobre o Projeto

Portfolio pessoal desenvolvido como **SPA (Single Page Application)** em Angular 21, apresentando minha trajetória como desenvolvedor back-end Java com mais de 10 anos de experiência.

O projeto incorpora um **tema Star Wars** como diferencial criativo: tecnologias são classificadas em rankings Jedi (Padawan → Knight → Master), experiências profissionais são narradas como episódios com uma animação de crawl 3D em CSS, e toda a identidade visual usa paleta cósmica com lightsabers animados.

---

## ✨ Funcionalidades

- **Star Wars Crawl** — ao clicar em uma experiência profissional, uma intro cinematográfica com perspectiva CSS 3D exibe os detalhes no estilo Episode IV
- **Skill Insight** — tooltip interativo com histórico real de uso de cada tecnologia, ativado por hover (desktop) ou clique (mobile), sem bibliotecas externas
- **Ranking Jedi de Habilidades** — lightsabers animados em amarelo/azul/verde representam o nível Padawan, Knight ou Master de cada tecnologia
- **Timeline de Trajetória** — linha do tempo com imagens ilustrativas e cards clicáveis por experiência
- **Vídeo de Apresentação** — iframe do YouTube integrado diretamente na seção hero
- **Formulário de Contato** — validação e estado de confirmação gerenciados por Angular Signals
- **Design Responsivo** — mobile-first, adaptado para smartphones, tablets e desktops
- **Modo Escuro Nativo** — paleta cósmica `#0d0d0d` com acentos roxo (`#6366f1`) e rosa (`#ec4899`)
- **Imagens Otimizadas** — conversão automática PNG → WebP com redução média de 95% no peso
- **Acessibilidade WCAG** — `role`, `tabindex`, `aria-label` e `aria-expanded` em todos os elementos interativos
- **Open Graph / Twitter Card** — meta tags para compartilhamento correto em redes sociais

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | Angular (Standalone) | 21.2 |
| Linguagem | TypeScript | 5.9 |
| Estilização | SCSS + BEM | — |
| Linting | @angular-eslint | 21.3 |
| Testes | Vitest | 4.x |
| Build tool | @angular/build (Vite) | 21.2 |
| Otimização de imagens | Sharp | 0.34 |

**Conceitos e padrões aplicados:**

- Angular Standalone Components — sem `NgModule`
- Signals — `signal()`, `computed()`, `input()`, `output()`
- CSS `perspective` + `rotateX` para animação 3D do crawl
- `position: fixed` + `transform: translate(-50%, -50%)` para modal centralizado
- `DomSanitizer` + `inject()` para URLs de iframe seguras
- `<picture>` com `<source type="image/webp">` + fallback PNG
- `loading="lazy"` em todas as imagens abaixo do fold

---

## 📂 Estrutura do Projeto

```
personal-portfolio/
├── public/
│   └── assets/
│       ├── cv.pdf
│       └── fotos/                    ← Imagens em PNG + WebP (geradas via script)
├── scripts/
│   ├── convert-to-webp.mjs           ← Converte todos os PNGs para WebP com sharp
│   └── remove-blade.mjs              ← Remove lâmina do sabre de luz das imagens
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/               ← Navbar fixa com menu mobile animado
│   │   │   ├── hero/                 ← Apresentação com avatar e vídeo YouTube
│   │   │   ├── about/                ← Bio, estatísticas e download do CV
│   │   │   ├── skills/               ← Grid de habilidades com ranking Jedi
│   │   │   │   └── shared/
│   │   │   │       └── skill-insight/  ← Tooltip com histórico de uso real
│   │   │   ├── experience/           ← Timeline de trajetória profissional
│   │   │   │   └── experience-crawl/ ← Modal Star Wars crawl 3D
│   │   │   ├── projects/             ← Cards de projetos com links GitHub
│   │   │   └── contact/              ← Formulário de contato
│   │   ├── app.ts
│   │   └── app.html
│   ├── styles.scss                   ← Design tokens (CSS custom properties)
│   └── index.html                    ← Meta tags, Open Graph, fontes
├── eslint.config.js                  ← @angular-eslint com regras de acessibilidade
└── angular.json
```

---

## 🗂️ Seções do Portfolio

| # | Seção | Descrição |
|---|-------|-----------|
| 1 | **Hero** | Avatar circular com gradiente, nome, cargo, descrição e vídeo de apresentação |
| 2 | **Sobre Mim** | Bio profissional, lista de clientes e download do CV em PDF |
| 3 | **Poderes da Força** | Habilidades técnicas com lightsabers animados e ranking Padawan / Jedi Knight / Jedi Master |
| 4 | **Minha Trajetória** | Timeline de experiências com imagens e modal Star Wars crawl ao clicar |
| 5 | **Projetos** | Cards com repositórios públicos: Spring Batch, Quarkus, Kafka e mais |
| 6 | **Contato** | Formulário e links para GitHub, LinkedIn e e-mail |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) versão **20 ou superior**
- npm versão **10 ou superior**

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/holandale0/personal-portfolio.git

# 2. Acesse a pasta do projeto
cd personal-portfolio

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm start
```

Acesse em: **http://localhost:4200**

---

## 📋 Scripts Disponíveis

```bash
# Servidor de desenvolvimento com hot-reload
npm start

# Build de produção otimizado
npm run build

# Verificação de linting (0 erros, 0 warnings)
npx ng lint

# Testes unitários com Vitest
npm test

# Converte todas as imagens PNG em WebP (sharp, qualidade 85%)
node scripts/convert-to-webp.mjs
```

---

## ⚡ Performance e Acessibilidade

### Otimização de Imagens

Todas as imagens foram convertidas para WebP via `scripts/convert-to-webp.mjs`, servidas com `<picture>` e fallback PNG para compatibilidade máxima:

| Imagem | PNG | WebP | Redução |
|--------|-----|------|---------|
| foto1.png (avatar hero) | 2.189 KB | 103 KB | **95%** |
| foto2.png (about) | 2.027 KB | 153 KB | **92%** |
| padawan / knight / master | ~900 KB méd. | ~47 KB méd. | **95%** |

Imagens abaixo do fold usam `loading="lazy"`. A imagem do hero (acima do fold) carrega normalmente para evitar LCP degradado.

### Acessibilidade

- Todos os elementos interativos com `role="button"`, `tabindex="0"` e `aria-label` descritivo
- Navegação por teclado completa — Enter e Space ativam qualquer ação clicável
- `aria-expanded` em hamburger e skill items
- `aria-controls` relacionando o botão hamburger ao menu mobile
- Lint de acessibilidade via `@angular-eslint/template/click-events-have-key-events`

---

## 🔗 Outros Projetos

| Projeto | Descrição | Stack |
|---------|-----------|-------|
| [Conciliação Financeira Batch](https://github.com/holandale0/financial-reconciliation-batch) | Processamento em lote de transações financeiras | Java, Spring Batch, PostgreSQL |
| [Quarkus Concurrency Lab](https://github.com/holandale0/quarkus-concurrency-lab) | Benchmark Virtual Threads vs Platform Threads | Java 21, Quarkus, Micrometer, k6 |
| [Order Processing System](https://github.com/holandale0/order-processing-system) | Arquitetura Event-Driven com Kafka | Java, Spring Boot, Kafka |
| [WebSocket Quarkus App](https://github.com/holandale0/websocket-java-quarkus-app) | Comunicação em tempo real | Java, Quarkus, WebSocket, Redis |

---

## 👨‍💼 Autor

**Leonardo Holanda Araujo**

Desenvolvedor Back-End Java com mais de 10 anos de experiência em microserviços, APIs REST e arquiteturas distribuídas. Projetos para Casas Bahia, Banco Original, Grupo Fleury, Caixa Econômica Federal e Visa.

[![GitHub](https://img.shields.io/badge/GitHub-holandale0-181717?style=flat-square&logo=github)](https://github.com/holandale0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-leonardoholanda-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/leonardoholanda)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usá-lo como referência e inspiração para o seu próprio portfolio.

---

<div align="center">

*"May the Code be with you." ⚡*

</div>
