# HTML2Link

Aplicação completa para:
1. Colar HTML.
2. Pré-visualizar.
3. Salvar no servidor.
4. Gerar código curto aleatório.
5. Criar URL pública `/p/CODIGO`.
6. Abrir o HTML salvo.

## Rodar localmente

Requer Node.js 18+.

```bash
npm install
npm start
```

Depois abra `http://localhost:3000`.

## Publicar

Suba este projeto para um serviço que execute Node.js. O comando de inicialização é:

```bash
npm start
```

A URL pública será usada automaticamente para montar os links.

Se quiser forçar uma URL específica, defina:

```bash
PUBLIC_BASE_URL=https://seudominio.com
```

## Observação importante

A versão usa `data/pages.json` como armazenamento simples. Para um site público com muitos usuários, troque por PostgreSQL/SQLite e adicione autenticação, limites de criação, moderação e rate limiting.

O HTML salvo é servido diretamente em `/p/:code`. Só permita HTML de usuários em quem você confia, ou implemente isolamento/sandbox e políticas de segurança antes de usar em produção.
