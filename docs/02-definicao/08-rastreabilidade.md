# Matriz de rastreabilidade

**Objetivo:** ligar cada requisito a uma história, um teste e uma tela.
**Data:** 2026-10-22 · **Status:** em andamento. Os testes estão **planejados**; a coluna será atualizada com o nome real do arquivo de teste conforme eu os escrever, na Fase 5 e 6.
Relacionados: [Requisitos](02-requisitos.md) · [Histórias](04-historias-de-usuario.md) · [Regras](03-regras-de-negocio.md)

## Telas

| ID | Tela | Rota prevista |
|---|---|---|
| T01 | Login | `/login` |
| T02 | Painel | `/` |
| T03 | Lista de clientes | `/clientes` |
| T04 | Cliente (cadastro/edição) | `/clientes/novo`, `/clientes/[id]` |
| T05 | Lista de modelos | `/modelos` |
| T06 | Editor de modelo | `/modelos/[id]` |
| T07 | Nova implantação | `/implantacoes/nova` |
| T08 | Detalhe da implantação | `/implantacoes/[id]` |
| T09 | Minhas pendências | `/pendencias` |
| T10 | Configurações e usuários (admin) | `/configuracoes`, `/usuarios` |
| T11 | Portal do cliente | `/p/[token]` |

## Requisito → história → teste → tela

Legenda dos testes: **U** = unitário (Vitest), **I** = integração/API (Vitest), **E** = E2E (Playwright). Os nomes TC são identificadores planejados.

| Requisito | Regras | História | Teste planejado | Tela |
|---|---|---|---|---|
| RF-01 | RN-17, RN-18 | US-01 | TC-01 (I) login ok/errado/desativado; TC-02 (E) login | T01 |
| RF-02 | RN-12 | US-01, US-03 | TC-03 (U) matriz de permissões; TC-04 (I) acesso negado | todas |
| RF-03 | RN-16 | US-02 | TC-05 (I) CRUD clientes; TC-06 (E) cadastrar cliente | T03, T04 |
| RF-04 | RN-10 | US-04 | TC-07 (I) CRUD modelo e permissão | T05, T06 |
| RF-05 | RN-07, RN-09 | US-04 | TC-08 (U) validação de tarefa do modelo | T06 |
| RF-06 | RN-01, RN-09, RN-10 | US-05 | TC-09 (U) cálculo de prazo; TC-10 (I) criar implantação; TC-11 (E) criar | T07 |
| RF-07 | RN-05, RN-06, RN-07 | US-06 | TC-12 (U) progresso e conclusão; TC-13 (I) mudar status | T08 |
| RF-08 | RN-11 | US-07 | TC-14 (I) ajuste de prazo com e sem motivo | T08 |
| RF-09 | RN-14 | US-08 | TC-15 (I) comentar | T08 |
| RF-10 | RN-15 | US-08 | TC-16 (I) auditoria registrada na mesma transação | T08 |
| RF-11 | RN-02 a RN-05, RN-08 | US-09 | TC-17 (U) atraso; TC-18 (U) tempo médio; TC-19 (E) painel | T02 |
| RF-12 | RN-02 | US-10 | TC-20 (U) ordenação da fila | T09, T02 |
| RF-13 | RN-02, RN-03 | US-11, US-09 | TC-21 (U) tolerância; TC-22 (I) configuração só admin | T10, T02 |
| RF-14 | RN-13, RN-14 | US-13 | TC-23 (I) portal não expõe dados internos; TC-24 (E) portal mobile | T11 |
| RF-15 | RN-13 | US-12 | TC-25 (U) token e expiração; TC-26 (I) gerar/revogar | T08, T11 |
| RF-16 | – | US-14 | TC-27 (I) seed gera os estados esperados | – |
| RF-17 | RN-18 | US-03 | TC-28 (I) usuários, só admin | T10 |
| RF-18 | – | US-09 | TC-29 (I) filtros | T02, T08 |
| RNF-02 | RN-12 | todas | TC-03, TC-04 | – |
| RNF-03 | RN-17 | US-01 | TC-30 (U) hash de senha | – |
| RNF-04 | – | todas | TC-31 (I) entrada inválida | – |
| RNF-05 | RN-13 | US-12, US-13 | TC-25, TC-23 | T11 |
| RNF-06, RNF-07 | – | US-13 | TC-24 (E mobile); checklist manual de acessibilidade | T11, T01 |
| RNF-08 | – | – | TC-32 (I) healthcheck | – |
| RNF-12 | RN-15 | US-06, US-07 | TC-16 | – |
