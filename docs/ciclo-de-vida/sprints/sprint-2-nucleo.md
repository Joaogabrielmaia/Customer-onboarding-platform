# Sprint 2 · Núcleo

**Objetivo:** modelo, implantação, tarefas, comentários e auditoria funcionando de ponta a ponta.
**Data:** janela acadêmica de 28/09 a 02/10/2026 · **Status:** concluída
Relacionados: [Sprints](README.md) · [Índice do ciclo de vida](../README.md) · [Review original](../../02-definicao/sprint-2-review.md) · [Sprint 1](sprint-1-fundacao.md) · [Sprint 3](sprint-3-visao-e-cliente.md)

## Escopo

| História | Requisitos e regras | Prioridade |
|---|---|---|
| US-04 Criar modelo de implantação | RF-04, RF-05, RN-07, RN-09 | Must |
| US-05 Iniciar implantação | RF-06, RN-01, RN-09, RN-10 | Must |
| US-06 Atualizar tarefas | RF-07, RN-05, RN-06, RN-07, RN-12 | Must |
| US-07 Ajustar prazo e responsável | RF-08, RN-11 | Must |
| US-08 Comentar e ver histórico | RF-09, RF-10, RN-14, RN-15 | Must |

## Critérios de conclusão da sprint

- Editor de modelos com etapas e tarefas (D+n, responsável padrão, obrigatória, visível ao cliente).
- Implantação criada como cópia do modelo, com datas calculadas e prévia na tela pela mesma função do servidor.
- Mudança de status recalcula o progresso e conclui ou reabre a implantação.
- Ajuste de prazo exige motivo e preserva o prazo original.
- Toda mudança grava auditoria na mesma transação.

## Planejamento

O foco é o risco RK-03: o cálculo de prazo concentra o erro sutil (fim de semana, virada de ano, ano bissexto). A sequência planejada é testar a função de prazo antes da tela, depois o serviço de criação contra o banco real, depois as telas. A decisão de copiar o modelo para a implantação está no [ADR-004](../../03-arquitetura/adr/004-tarefas-e-prazos-relativos.md), e a auditoria transacional no [ADR-005](../../03-arquitetura/adr/005-auditoria.md).

## Review

Entregue: editor de modelos, criação com prévia dos prazos, status com conclusão e reabertura automáticas, ajuste de prazo com motivo, comentários internos e histórico legível. Ficaram fora: reordenar tarefas dentro de uma implantação já criada e excluir comentário (o histórico é só de inserção).

## Retrospectiva

- A função de prazo é onde mora o risco; tratar datas como dia civil evitou erro de fuso.
- Um teste verifica que reescrever o modelo não muda a implantação já criada.
- O teste de integração contra banco real obrigou a pensar na ordem de criação (etapa antes da tarefa) e nas transações.
- O ajuste de prazo sem mudança respondia "salvo" (D4), achado depois, na exploração da sprint 4.

## Evidências

| Evidência | Registro |
|---|---|
| Editor de modelos e criação com prévia | Commit `72d6907` |
| Detalhe, status, prazo, comentários e histórico | Commit `e57bb2c` |
| E2E e verificação com axe | Commit `feca826` |
| Testes | [Prazos](../../../tests/unit/deadlines.test.ts), [progresso](../../../tests/unit/progress.test.ts), [implantações](../../../tests/integration/deployments.test.ts), [fluxo E2E](../../../tests/e2e/deployment-flow.spec.ts) |
| Tela | [Nova implantação](../../imagens/04-nova-implantacao.png), [histórico](../../imagens/06-historico.png) |
