# Contribuindo e rodando localmente

**Objetivo:** reunir o que é preciso para executar a Trilha e seus testes na máquina de desenvolvimento.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [README](README.md) · [Estratégia de testes](docs/05-qualidade/01-estrategia-de-testes.md) · [Runbook](docs/07-pos-go-live/runbook.md)

## Rodar localmente

Pré-requisitos: Node.js 24 e Docker.

```bash
npm install
cp .env.example .env     # os valores padrão já servem para o ambiente local
npm run setup            # sobe o PostgreSQL (Docker), aplica as migrations e carrega os dados de exemplo
npm run dev              # http://localhost:3000
```

Contas de demonstração criadas pelo seed (dados fictícios, só para uso local):

| Papel | E-mail | Senha |
|---|---|---|
| Administrador | `admin@rotafacil.example` | `Admin-Trilha-2026` |
| Implantador | `implantador@rotafacil.example` | `Usuario-Trilha-2026` |

O link do cliente é gerado dentro de uma implantação, no botão "Gerar link do cliente".

```bash
npm run lint && npm run typecheck && npm test   # unitários e integração (cria o banco trilha_test)
npm run build && npx playwright install chromium && npx playwright test   # E2E (cria o banco trilha_e2e)
npm run screenshots                              # regenera docs/imagens
```
