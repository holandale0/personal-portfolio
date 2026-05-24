# Changelog

Histórico de todas as alterações relevantes do projeto **Leonardo Holanda — Portfólio Pessoal**.

---

## [Não publicado]

---

## 2026-05-24 — Animações: Skills e Experience

### Seção Skills — efeitos nos sabres de luz

- Criados 5 efeitos CSS nomeados para as lâminas dos sabres de luz:
  - **A · Pulso** — brilho que respira suavemente
  - **B · Flicker** — instabilidade de plasma com cintilação
  - **C · Scan** — shimmer de energia percorre a lâmina
  - **D · Descarga** — arcos elétricos irregulares
  - **E · Vibração** — oscilação sutil da lâmina *(ativo)*
- Efeito de **relâmpago** no hover (3 flashes brancos decrescentes ao passar o mouse) e no click (via binding Angular `saber--lightning`)
- Lâmina fica 65% mais brilhante no hover/estado ativo

### Seção Experience — hint "Mais detalhes"

- Botão "Mais detalhes" dos cards de experiência deixou de ser invisível (opacity 0)
- Adicionado efeito **crackle dourado** contínuo (inspirado no efeito D) para indicar que o card é clicável
- No hover: crackle para e o hint exibe glow dourado constante (`drop-shadow`)

---

## 2026-05-13 — Seção About: botões de ação

- Adicionado botão **"Fale comigo"** ao lado do botão "Download CV"
- Ambos os botões com largura igual e alinhados via flexbox
- Ajuste de `max-width` para 148px (mais compacto)
- Adicionado `white-space: nowrap` para evitar quebra de linha no texto
- Corrigido ícone de download que estava sendo comprimido (`flex-shrink: 0`)

---

## 2026-05-12 — Reestruturação Hero e Contact

- **Hero:** removida a foto circular (avatar) da coluna de texto
- **Contact:** substituído o formulário de contato pela foto `foto1.webp` (retrato)
- Simplificado o `Contact` component — removidos `FormsModule`, `submitted`, campos do form e `onSubmit`

---

## 2026-05-11 — Seção Contact: links sociais e ícones

- Adicionado link para **Discord** (usuário `oleoholanda`, ID `1490716093566685324`)
- Reordenados os links sociais: E-mail → LinkedIn → GitHub → Discord
- Ícone do Gmail atualizado para o novo design multicolor "M" (vermelho, azul, verde, amarelo)
- Removidas imagens individuais das experiências (`knight`, `padawan`, `master`)

### Seção Experience: imagem de evolução

- Substituídas as imagens individuais antes de cada card por uma única imagem `evolution.webp` centralizada entre o subtítulo e o primeiro card
- Imagem reduzida para 35% da largura com centralização correta via `width` na tag `picture`
- Adicionado degradê radial nas bordas simulando fusão com o fundo da página

---

## 2026-05-10 — Redesign visual e Hologram Player

### Redesign de paleta

- Aplicada paleta **warm earthy** (marrom, nude, cinza, off-white) substituindo o tema azul/roxo anterior
- Tokens CSS atualizados globalmente: `--accent`, `--accent-secondary`, `--bg-primary`, `--bg-secondary`, `--bg-card`, `--border`, etc.
- Paleta intermediária com deep space blue/emerald descartada em favor do tema quente

### Skills

- Ícones de emoji substituídos por **SVGs oficiais** das tecnologias
- Cor do rank Padawan alterada de âmbar para branco opaco quente
- Adicionada competência **Flexbox** no grupo Front-End (Padawan, nível 60, ícone customizado)

### Hologram Player

- Componente de apresentação no Hero migrado de YouTube embed para **HologramPlayer customizado**
- Implementado com imagem `hologram3.webp` (fundo transparente) com efeito de brilho azul ciano (`drop-shadow`)
- Remoção do fundo branco via algoritmo flood-fill com detecção por saturação
- Player esticado para acompanhar a altura da coluna esquerda via `flex: 1` + `align-self: stretch`
- Transição suave entre estado idle (imagem) e estado ativo (iframe YouTube)

### Correções UI

- Botões primários com cor mais escura e contraste maior
- Botão outline com borda visível
- Legenda da section Skills movida acima do grid
- Marcadores de timeline removidos

---

## 2026-05-09 — Ajustes de acessibilidade e UX

- Desabilitada seleção de texto em elementos interativos
- Cursor de edição removido de áreas não editáveis
- Highlight de seleção ajustado para mobile

---

## 2026-05-07 — Projetos

- Adicionado novo card de projeto na página de projetos

---

## 2026-05-06 — Qualidade e documentação

- Adicionado **ESLint** ao projeto com correção de 11 violações
- Imagens convertidas para **WebP**, adicionados `loading="lazy"`, OG tags e atributos ARIA
- Adicionado modal **Star Wars Crawl** em cada card de experiência (clique para ver mais detalhes)
- Legenda de ranks de skills corrigida no mobile
- README profissional criado com documentação completa do projeto

---

## 2026-05-05 — Skills e Experience

- Adicionado **tooltip de insight** nas skills ao hover/tap
- Adicionados rótulos de nível (Padawan / Knight / Master) na legenda
- Fundos das imagens de skills tornados transparentes
- Removida a lâmina do sabre de luz das ilustrações Padawan
- Removido o card de prompt da homepage
- Legenda de skills movida para acima do grid

---

## 2026-05-04 — Seção About e Projetos

- Adicionada `foto2` com layout imagem + stats abaixo na seção About
- Adicionados cards de projetos na página de projetos
- Título da página de projetos definido

---

## 2026-05-03 — Projetos

- Card **Dashboard Analítico** substituído por projeto real: **WebSocket Quarkus**
- Adicionado projeto **financial-reconciliation-batch** como destaque
- Atualizada seção de skills

---

## 2026-05-02 — Documentos

- Atualização do `cv.pdf`

---

## 2026-04-24 — Experience e navegação

- Adicionadas imagens de marco (milestone) na timeline de experiências com estilos círculo e card
- Período da experiência na Qintess atualizado
- Removido link "Contato" da navbar e botão "Entre em Contato"
- Cores dos ranks de skills ajustadas
- Imagens de milestone redimensionadas

---

## 2026-04-23 — Lançamento inicial

- Criação do projeto **Angular 21** com estrutura de SPA de portfólio pessoal
- Seções implementadas: **Hero**, **About**, **Skills**, **Experience**, **Projects**, **Contact**
- Tema escuro com identidade visual Jedi/Star Wars
- Vídeo de apresentação integrado via YouTube embed (Shorts)
- Link do repositório GitHub adicionado ao card do portfólio
- Deploy inicial publicado
