# Resultado da última execução

**Objetivo:** registrar o resultado real da última rodada de verificações.
**Data:** 2026-10-22 · **Status:** execução local concluída na **v1.1.0**; **o CI no GitHub ainda não foi executado** (o repositório ainda não foi enviado)
Relacionados: [Estratégia](01-estrategia-de-testes.md) · [Limitações](03-limitacoes-conhecidas.md)

> Os números abaixo foram copiados da saída dos comandos, rodados por mim nesta máquina. Não há resultado de cobertura de código porque não a medi.

## Ambiente

Windows 11, Node.js 24.14.0, PostgreSQL 16 em Docker, Next.js 16.4, Vitest 5.0.5, Playwright 1.64 (Chromium). Banco de testes e de E2E separados do de desenvolvimento.

## Resultado (v1.1.0)

| Verificação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | sem erros nem avisos |
| Tipos | `npm run typecheck` | sem erros |
| Unitários | `npm run test:unit` | **7 arquivos, 52 testes, todos passaram** (cerca de 2 s) |
| Integração | `npm run test:integration` | **8 arquivos, 70 testes, todos passaram** (cerca de 28 s) |
| Build | `npm run build` | compilou; 19 rotas |
| E2E | `npx playwright test` | **34 testes, todos passaram** (cerca de 1,1 min), dos quais 6 são de acessibilidade (axe) |

Total: **156 testes automatizados passando** nesta execução.

### Para comparação: v1.0.0 (antes da exportação em CSV)

46 unitários, 64 de integração e 31 E2E (141 no total), todos passando. A v1.1.0 acrescentou 6 + 6 + 3 testes.

## Histórico honesto até chegar aqui

Nem tudo passou de primeira. O que aconteceu de fato:

- **Primeira rodada E2E: 22 passaram e 8 falharam.** As 8 falhas eram **do teste, não do produto**: o anunciador de rotas do Next também usa `role="alert"`, e o rótulo "Link do cliente" existia no `<aside>` e no campo, causando ambiguidade nos seletores. Ajustei os seletores. Uma dessas falhas apontou um problema real de UX (o banner repetia a mensagem do campo), tratado abaixo.
- **Configuração do E2E:** o servidor do Playwright sobe antes do `globalSetup`, então o healthcheck (que consulta o banco) devolvia 503 e a execução estourava o tempo. Troquei a URL de prontidão para `/login`.
- Os testes unitários e de integração passaram na primeira execução, tanto na v1.0.0 quanto na v1.1.0.

## Defeitos reais encontrados e corrigidos

| # | Defeito | Como foi achado | Correção | Teste de regressão |
|---|---|---|---|---|
| D1 | Ids de campos repetidos (`id={name}`) nas telas com vários formulários iguais: rótulos apontando para o campo errado (acessibilidade) | Revisão do meu código antes de rodar o E2E | `useId()` em cada campo | O E2E do detalhe da implantação e o axe passam |
| D2 | Banner de erro repetia a mensagem que já aparece no campo | Falha de seletor no E2E (duas ocorrências do mesmo texto) | O banner passa a dizer "Revise os campos destacados." quando há erro por campo | `dashboard-and-clients.spec.ts` |
| D3 | `/clientes` com rolagem horizontal de 53 px em 390 px de largura. O `th` `sr-only` é `position:absolute` e escapava do `overflow-x-auto` | Exploração em tela de celular (UAT) | `relative` no contêiner da tabela (clientes, usuários e painel) | `responsive.spec.ts` |
| D5 | `.env.example` trazia `DIRECT_URL=""`, e `"" ?? x` não cai no valor padrão: quem copiasse o arquivo teria a migration falhando com "Connection url is empty" | Conferindo os passos do README contra o código; reproduzi o erro antes de corrigir | `||` no `prisma.config.ts` e a linha comentada no `.env.example` | Validado por clone limpo (ver abaixo) |
| D4 | Salvar um ajuste de prazo sem mudar nada respondia "Ajuste salvo." | Exploração de casos de borda (UAT) | O serviço recusa com "Nenhuma alteração para salvar" | `deployments.test.ts` e `deployment-flow.spec.ts` |

Na v1.1.0 não encontrei defeito novo: a injeção de fórmula em CSV foi tratada **por desenho** (e testada), não corrigida depois.

## Verificação do passo a passo do README (clone limpo)

Para garantir que o README funciona de verdade, clonei o repositório (commit da v1.1.0 com a correção do D5) em uma pasta nova e segui os passos num **banco vazio**:

| Passo | Resultado |
|---|---|
| `git ls-files` procurando `.env` versionado | nenhum |
| `npm ci` (com `postinstall` gerando o cliente Prisma) | instalou |
| `cp .env.example .env` e `prisma migrate deploy` | 1 migration aplicada |
| `npm run db:seed` | 7 implantações: 2 no prazo, 1 aguardando cliente, 2 atrasadas, 2 concluídas |
| `npm run lint` e `npm run typecheck` | sem erros |
| `npm run test:unit` | 52 passaram |
| `npm run build` | compilou |

Não repeti integração e E2E no clone (o código é o mesmo e já passaram no diretório de trabalho).

## O que esta execução **não** prova

- Não prova o funcionamento no GitHub Actions nem na Vercel (ainda não executei lá).
- Não prova comportamento em Firefox, Safari ou em celular físico.
- Não prova que o CSV abre corretamente em todas as versões do Excel (testei o conteúdo e o BOM, não o Excel).
- Não prova acessibilidade completa (só as regras automáticas do axe).
- Não mede desempenho nem carga.
