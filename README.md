# Erick Neves · Portfólio

Portfólio pessoal de desenvolvedor Shopify. React 19, TypeScript, Vite, Tailwind CSS 4 e React Router 7.

## Rodando localmente

```bash
npm install
npm run dev
```

`npm run build` gera a versão de produção em `dist/` e `npm run lint` roda o ESLint.

## Onde editar o conteúdo

Todo o texto e os dados ficam em `src/content/`:

| Arquivo | O que tem |
| --- | --- |
| `strings.ts` | Todos os textos do site em português e inglês |
| `clients.ts` | Lojas do sistema solar e da página de trabalhos (nome, segmento, link, cor e órbita do planeta, escopo opcional) |
| `projects.ts` | Projetos pessoais (GameRent, Pac-Man) |
| `site.ts` | E-mail, redes, localização e caminho do currículo |

Para adicionar uma loja, copie um bloco em `clients.ts`. O campo `scope` é opcional e aparece no painel de detalhes como "O que fiz".

Para o botão de currículo aparecer, coloque o PDF em `public/cv/` e preencha `site.cv` com o caminho de cada idioma.

## Estrutura

```
src/
  pages/        Home, Trabalhos, Sobre, Contato e 404
  components/   Cabeçalho, rodapé, sistema solar, janela "EE", painel de detalhes
  content/      Textos e dados (ver tabela acima)
  lib/          Hooks de scroll, geometria das órbitas, desenho do monograma
```

A animação de entrada da home é uma seção alta com conteúdo fixo na tela (`position: sticky`). O progresso do scroll vira a variável CSS `--p`, e cada camada calcula a própria opacidade e posição a partir dela. Quem prefere movimento reduzido no sistema operacional vê direto o estado final, sem rolagem presa.

## Publicação

O site usa rotas reais (`/trabalhos`, `/sobre`, `/contato`). Na hospedagem, todas as rotas precisam devolver o `index.html`:

- Vercel: crie `vercel.json` com `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- Netlify: crie `public/_redirects` com a linha `/* /index.html 200`.
- GitHub Pages: não tem esse redirecionamento; prefira Vercel ou Netlify.
