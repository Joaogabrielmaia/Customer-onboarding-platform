# Sprint 3 · Visão e cliente

**Objetivo:** painel, atraso, pendências, portal por token, seed completo e acabamento.
**Data:** janela acadêmica de 05 a 09/10/2026 · **Status:** concluída
Relacionados: [Sprints](README.md) · [Índice do ciclo de vida](../README.md) · [Review original](../../02-definicao/sprint-3-review.md) · [Sprint 2](sprint-2-nucleo.md) · [Sprint 4](sprint-4-qualidade.md)

## Escopo

| História | Requisitos e regras | Prioridade |
|---|---|---|
| US-09 Ver o painel | RF-11, RF-13, RF-18, RN-02 a RN-05, RN-08 | Must |
| US-10 Ver minhas pendências | RF-12 | Must |
| US-11 Configurar regra de atraso | RF-13, RN-02 | Must |
| US-12 Compartilhar o link com o cliente | RF-15, RF-19, RN-13 | Must e Should |
| US-13 Cliente acompanha a implantação | RF-14, RN-14 | Must |
| US-14 Dados de exemplo | RF-16 | Must |

## Critérios de conclusão da sprint

- Painel com contagens, "atenção primeiro" e espera do cliente fora do atraso da equipe.
- Filtro por implantador e fila de pendências ordenada por atraso (RF-18, subido a Must na reunião 4).
- Link do cliente mostrado uma vez, com mensagem pronta, revogável e um ativo por implantação.
- Portal sem comentários nem tarefas internas.
- Seed com oito clientes, três modelos e sete implantações em estados variados.

## Planejamento

A sprint incorpora os pedidos aceitos na [reunião 4](../../04-prototipo/02-reuniao-4-validacao.md) (dias de atraso em vermelho, filtro por implantador, mensagem pronta com o link) e recusa a escrita no portal. As decisões de segurança do portal estão no [ADR-007](../../03-arquitetura/adr/007-portal-por-token.md). O risco em foco é RK-05 (vazamento do token).

## Review

Entregue: tudo o que estava no escopo, mais healthcheck e logs em JSON sem dados pessoais. Ficaram fora: teste automatizado do estado vazio do painel (implementado, não verificado por teste) e o calendário semanal (CH-08).

## Retrospectiva

- O que o portal não mostra pesou tanto quanto o que mostra: o teste confere que comentário e tarefa interna não aparecem.
- Dados de exemplo precisam de desenho: datas relativas a hoje e cenários com pivô fazem o seed sempre mostrar tarefa atrasada, aguardando cliente e concluída.

## Evidências

| Evidência | Registro |
|---|---|
| Painel, filtros e fila de pendências | Commit `dcbfb74` |
| Portal por token e healthcheck | Commit `d911d39` |
| Testes | [Dashboard](../../../tests/integration/dashboard.test.ts), [portal](../../../tests/integration/portal.test.ts), [token](../../../tests/unit/portal-token.test.ts), [portal E2E](../../../tests/e2e/templates-and-portal.spec.ts) |
| Tela | [Painel](../../imagens/02-painel.png), [portal](../../imagens/09-portal-cliente.png) |
