# Matriz de rastreabilidade

**Objetivo:** ligar cada requisito a uma história, um teste e uma tela.
**Data:** 2026-10-22 · **Status:** atualizada após a implementação. Os testes abaixo **existem e passaram** na [última execução](../05-qualidade/02-resultado-da-ultima-execucao.md).
Relacionados: [Requisitos](02-requisitos.md) · [Histórias](04-historias-de-usuario.md) · [Regras](03-regras-de-negocio.md)

## Telas

| ID | Tela | Rota |
|---|---|---|
| T01 | Login | `/login` |
| T02 | Painel | `/` |
| T03 | Lista de clientes | `/clientes` |
| T04 | Cliente (cadastro/edição) | `/clientes/novo`, `/clientes/[id]` |
| T05 | Lista de modelos | `/modelos` |
| T06 | Editor de modelo | `/modelos/novo`, `/modelos/[id]` |
| T07 | Nova implantação | `/implantacoes/nova` |
| T08 | Detalhe da implantação (tarefas, histórico, link do cliente) | `/implantacoes/[id]` |
| T09 | Minhas pendências | `/pendencias` |
| T10 | Configurações e usuários (admin) | `/configuracoes`, `/usuarios` |
| T11 | Portal do cliente | `/p/[token]` |
| T12 | Lista de implantações com filtros | `/implantacoes` |

## Testes

Legenda: **U** = unitário, **I** = integração dos serviços, **E** = E2E (arquivos em `tests/unit`, `tests/integration`, `tests/e2e`).

| TC | Tipo | Arquivo | O que prova |
|---|:-:|---|---|
| TC-01 | I | `auth.test.ts` | Login, mensagem única, desativado, expiração, logout |
| TC-02 | E | `auth-and-roles.spec.ts` | Login, sessão, papéis, telas de admin |
| TC-03 | U | `permissions.test.ts` | Matriz RN-12 |
| TC-04 | I | `users-and-clients`, `templates`, `deployments`, `dashboard`, `portal` (casos negados) | Autorização no servidor |
| TC-05 | I | `users-and-clients.test.ts` | Clientes: CRUD, validação, arquivar |
| TC-06 | E | `dashboard-and-clients.spec.ts` | Cadastro e erros de cliente na tela |
| TC-07 | I / E | `templates.test.ts`, `templates-and-portal.spec.ts` | Modelos e permissão |
| TC-08 | I | `templates.test.ts` | Validação de tarefa do modelo |
| TC-09 | U | `deadlines.test.ts`, `dates.test.ts` | Cálculo de prazo e datas civis |
| TC-10 | I | `deployments.test.ts` | Criar implantação, cópia do modelo |
| TC-11 | E | `deployment-flow.spec.ts` | Criar implantação com prévia |
| TC-12 | U | `progress.test.ts` | Progresso, conclusão, não aplicável |
| TC-13 | I / E | `deployments.test.ts`, `deployment-flow.spec.ts` | Mudar status |
| TC-14 | I / E | idem | Prazo com motivo, ajuste sem mudança |
| TC-15 | I / E | idem | Comentários |
| TC-16 | I / E | idem | Auditoria registrada com a mudança (não prova reversão sob falha) |
| TC-17 | U | `progress.test.ts` | Atraso da equipe e do cliente |
| TC-18 | U / I | `progress.test.ts`, `dashboard.test.ts` | Tempo médio |
| TC-19 | E | `dashboard-and-clients.spec.ts` | Painel |
| TC-20 | U / I | `progress.test.ts`, `dashboard.test.ts` | Fila de pendências |
| TC-21 | U / I | `progress.test.ts`, `dashboard.test.ts` | Tolerância de atraso |
| TC-22 | I | `dashboard.test.ts` | Configuração só do admin |
| TC-23 | I | `portal.test.ts` | Portal não expõe dados internos |
| TC-24 | E | `templates-and-portal.spec.ts` | Portal em 360 px, cabeçalhos, revogação |
| TC-25 | U / I | `portal-token.test.ts`, `portal.test.ts` | Token, hash, expiração |
| TC-26 | I | `portal.test.ts` | Gerar e revogar |
| TC-27 | I | `seed.test.ts` | Seed com estados esperados |
| TC-28 | I | `users-and-clients.test.ts` | Usuários, só admin |
| TC-29 | I / E | `dashboard.test.ts`, `dashboard-and-clients.spec.ts` | Filtros |
| TC-30 | U | `password.test.ts` | Hash de senha |
| TC-31 | I | vários | Entrada inválida recusada |
| TC-32 | E | `auth-and-roles.spec.ts` | Healthcheck |
| TC-33 | E | `templates-and-portal.spec.ts` | Mensagem pronta com o link (RF-19) |
| TC-34 | E | `responsive.spec.ts` | Sem rolagem horizontal em 390 px |
| TC-35 | E | `accessibility.spec.ts` | axe em 6 telas |
| TC-36 | U / I | `csv.test.ts`, `reports.test.ts` | CSV: escape, injeção de fórmula, conteúdo e filtros (v1.1) |
| TC-37 | I | `reports.test.ts` | Relatório sem comentários nem histórico; permissão e erro |
| TC-38 | E | `export-csv.spec.ts` | Download real, BOM, filtros da tela e 401 sem sessão |

## Requisito → história → teste → tela

| Requisito | Regras | História | Teste | Tela |
|---|---|---|---|---|
| RF-01 | RN-17, RN-18 | US-01 | TC-01, TC-02 | T01 |
| RF-02 | RN-12 | US-01, US-03 | TC-03, TC-04 | todas |
| RF-03 | RN-16 | US-02 | TC-05, TC-06 | T03, T04 |
| RF-04 | RN-10 | US-04 | TC-07 | T05, T06 |
| RF-05 | RN-07, RN-09 | US-04 | TC-08 | T06 |
| RF-06 | RN-01, RN-09, RN-10 | US-05 | TC-09, TC-10, TC-11 | T07 |
| RF-07 | RN-05, RN-06, RN-07 | US-06 | TC-12, TC-13 | T08 |
| RF-08 | RN-11 | US-07 | TC-14 | T08 |
| RF-09 | RN-14 | US-08 | TC-15 | T08 |
| RF-10 | RN-15 | US-08 | TC-16 | T08 |
| RF-11 | RN-02 a RN-05, RN-08 | US-09 | TC-17, TC-18, TC-19 | T02 |
| RF-12 | RN-02 | US-10 | TC-20 | T09, T02 |
| RF-13 | RN-02, RN-03 | US-11, US-09 | TC-21, TC-22 | T10, T02 |
| RF-14 | RN-13, RN-14 | US-13 | TC-23, TC-24 | T11 |
| RF-15 | RN-13 | US-12 | TC-25, TC-26 | T08, T11 |
| RF-16 | – | US-14 | TC-27 | – |
| RF-17 | RN-18 | US-03 | TC-28 | T10 |
| RF-18 | – | US-09 | TC-29 | T02, T12 |
| RF-19 | – | US-12 | TC-33 | T08 |
| RF-20 | – | (v1.1) | TC-36, TC-37, TC-38 | T08, T12 |
| RNF-02 | RN-12 | todas | TC-03, TC-04 | – |
| RNF-03 | RN-17 | US-01 | TC-30 | – |
| RNF-04 | – | todas | TC-31 | – |
| RNF-05 | RN-13 | US-12, US-13 | TC-23, TC-25 | T11 |
| RNF-06 | – | US-13 | TC-24, TC-34 | todas |
| RNF-07 | – | US-13 | TC-35 (parcial: sem teste manual de teclado e leitor de tela) | T01, T02, T08, T11 |
| RNF-08 | – | – | TC-32 | – |
| RNF-12 | RN-15 | US-06, US-07 | TC-16 (parcial) | – |
| RNF-01 | – | – | **sem teste**: desempenho não medido | – |
| RNF-09 | – | – | **sem teste**: LGPD só no desenho | – |
| RNF-10 | – | – | revisão de código; sem teste | – |
| RNF-11 | – | – | CI executado no GitHub: verde em 2026-10-24, depois de uma falha E2E em 2026-10-23 (D6) | – |
