# Resultado da última execução

**Objetivo:** registrar o resultado real da última rodada de verificações.
**Data:** 2026-10-22 · **Status:** execução local concluída; **o CI no GitHub ainda não foi executado** (o repositório ainda não foi enviado)
Relacionados: [Estratégia](01-estrategia-de-testes.md) · [Limitações](03-limitacoes-conhecidas.md)

> Os números abaixo foram copiados da saída dos comandos, rodados por mim nesta máquina. Não há resultado de cobertura de código porque não a medi.

## Ambiente

Windows 11, Node.js 24.14.0, PostgreSQL 16 em Docker, Next.js 16.4, Vitest 5.0.5, Playwright 1.64 (Chromium). Banco de testes e de E2E separados do de desenvolvimento.

## Resultado

| Verificação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | sem erros nem avisos |
| Tipos | `npm run typecheck` | sem erros |
| Unitários | `npm run test:unit` | **6 arquivos, 46 testes, todos passaram** (cerca de 2 s) |
| Integração | `npm run test:integration` | **7 arquivos, 64 testes, todos passaram** (cerca de 29 s) |
| Build | `npm run build` | compilou; 17 rotas |
| E2E | `npx playwright test` | **31 testes, todos passaram** (cerca de 1,1 min), dos quais 6 são de acessibilidade (axe) |

Total: **141 testes automatizados passando** nesta execução.

## Histórico honesto até chegar aqui

Nem tudo passou de primeira. O que aconteceu de fato:

- **Primeira rodada E2E: 22 passaram e 8 falharam.** As 8 falhas eram **do teste, não do produto**: o anunciador de rotas do Next também usa `role="alert"`, e o rótulo "Link do cliente" existia no `<aside>` e no campo, causando ambiguidade nos seletores. Ajustei os seletores. Uma dessas falhas apontou um problema real de UX (o banner repetia a mensagem do campo), tratado abaixo.
- **Configuração do E2E:** o servidor do Playwright sobe antes do `globalSetup`, então o healthcheck (que consulta o banco) devolvia 503 e a execução estourava o tempo. Troquei a URL de prontidão para `/login`.
- Os testes unitários e de integração passaram na primeira execução.

## Defeitos reais encontrados e corrigidos

| # | Defeito | Como foi achado | Correção | Teste de regressão |
|---|---|---|---|---|
| D1 | Ids de campos repetidos (`id={name}`) nas telas com vários formulários iguais: rótulos apontando para o campo errado (acessibilidade) | Revisão do meu código antes de rodar o E2E | `useId()` em cada campo | O E2E do detalhe da implantação e o axe passam |
| D2 | Banner de erro repetia a mensagem que já aparece no campo | Falha de seletor no E2E (duas ocorrências do mesmo texto) | O banner passa a dizer "Revise os campos destacados." quando há erro por campo | `dashboard-and-clients.spec.ts` |
| D3 | `/clientes` com rolagem horizontal de 53 px em 390 px de largura. O `th` `sr-only` é `position:absolute` e escapava do `overflow-x-auto` | Exploração em tela de celular (UAT) | `relative` no contêiner da tabela (clientes, usuários e painel) | `responsive.spec.ts` |
| D4 | Salvar um ajuste de prazo sem mudar nada respondia "Ajuste salvo." | Exploração de casos de borda (UAT) | O serviço recusa com "Nenhuma alteração para salvar" | `deployments.test.ts` e `deployment-flow.spec.ts` |

## O que esta execução **não** prova

- Não prova o funcionamento no GitHub Actions nem na Vercel (ainda não executei lá).
- Não prova comportamento em Firefox, Safari ou em celular físico.
- Não prova acessibilidade completa (só as regras automáticas do axe).
- Não mede desempenho nem carga.
