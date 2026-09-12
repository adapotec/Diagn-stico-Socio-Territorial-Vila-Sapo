# Diagnóstico Socioterritorial da Vila Sapo — Instituto Ádapo

> Apresentação interativa em Slide Deck (100vh) das condições de habitabilidade, violação de saneamento básico e vulnerabilidade climática das 21 famílias mapeadas à margem do Rio Ingaúra (Novo Angelim, São Luís - MA).

---

## Sobre o Projeto

O **Diagnóstico Socioterritorial da Vila Sapo** é uma pesquisa censitária de campo conduzida pelo **Instituto Ádapo**. O objetivo é subsidiar políticas públicas integradas, fundamentar representações aos órgãos de controle (Ministério Público e Defensoria Pública) e instruir audiências públicas legislativas sobre o direito à moradia digna e saneamento.

O projeto adota uma arquitetura em **Slide Deck Interativo (100vh)**, inspirada no *Mapa da Desigualdade entre as Capitais* (Instituto Cidades Sustentáveis), com design institucional em fundo claro, cores oficiais do Instituto Ádapo e sem necessidade de rolagem vertical de página.

---

## Estrutura da Apresentação (7 Slides)

1. **Capa / Hero:** Indicadores macro consolidados (21 Famílias, 143 Indicadores, 100% Esgoto a Céu Aberto, 90% Alagamentos) com carrossel dinâmico em segundo plano exibindo registros fotográficos de campo.
2. **Diagnóstico Multitemático:** Painel com abas setoriais instantâneas:
   - Infraestrutura
   - Saneamento
   - Moradia
   - Saúde
   - Educação
   - Alimentação
   - Direitos Humanos & Gênero
3. **ODS ONU (Agenda 2030):** Cruzamento dos indicadores territoriais com as metas dos Objetivos de Desenvolvimento Sustentável (ODS 1, ODS 2, ODS 3, ODS 6, ODS 10 e ODS 11).
4. **Cartografia Social:** Mapeamento georreferenciado via Leaflet/OpenStreetMap, destacando o perímetro territorial, a calha do Rio Ingaúra, nota metodológica de impacto estendido, orientações técnicas de inserção de dados e marcadores clicáveis com fotos do local.
5. **Depoimentos & Vozes da Comunidade:** Relatos literais das moradoras e reprodutor de áudio institucional para depoimentos orais.
6. **Na Mídia:** Mural de cobertura jornalística, reportagens investigativas e denúncias sobre enchentes e descaso sanitário.
7. **Instituto Ádapo no Território:** Avaliação comunitária pelas famílias (100% de aprovação) e prioridades demandadas (atividades para crianças neurodivergentes/autismo, esportes e cursos de renda feminina).

---

## Tecnologias Utilizadas

- **Vite** — Build tool e servidor de desenvolvimento ultrarrápido
- **HTML5 & CSS3 Puro** — Design system institucional com variáveis CSS e tipografia sob medida (Inter, Space Grotesk, Space Mono)
- **JavaScript Moderno (ES Modules)** — Lógica de controle de slides, carrossel dinâmico, abas e player sonoro
- **Chart.js** — 22 gráficos setoriais configurados em paleta institucional de alta legibilidade
- **Leaflet & OpenStreetMap** — Cartografia espacial interativa com marcadores fotográficos

---

## Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/adapotec/Diagn-stico-Socio-Territorial-Vila-Sapo.git

# Acesse a pasta do projeto
cd Diagn-stico-Socio-Territorial-Vila-Sapo

# Instale as dependências
npm install

# Inicie o servidor local
npm run dev
```

Acesse em seu navegador no endereço: `http://localhost:3000/`.

---

## Contato Institucional

- **Instituto Ádapo** — Organização da Sociedade Civil atuante no Novo Angelim, São Luís - MA
- **E-mail:** contato@institutoadapo.org.br
- **Repositório:** [adapotec/Diagn-stico-Socio-Territorial-Vila-Sapo](https://github.com/adapotec/Diagn-stico-Socio-Territorial-Vila-Sapo)
