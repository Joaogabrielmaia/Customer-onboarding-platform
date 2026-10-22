# Sprint 2 (Núcleo): review

**Objetivo da sprint:** modelo → implantação → tarefas, comentários e auditoria funcionando de ponta a ponta.
**Data:** 2026-10-22 · **Status:** concluída
Relacionados: [Sprint 1](sprint-1-review.md) · [Sprint 3](sprint-3-review.md) · [Regras](03-regras-de-negocio.md)

## Entregue

| História | Resultado |
|---|---|
| US-04 Modelos | Editor com etapas e tarefas (D+n, responsável padrão, obrigatória, visível ao cliente), reordenação, mensagens por campo |
| US-05 Criar implantação | Cópia do modelo, datas calculadas (D+n, fim de semana vai para segunda), prévia das datas na tela usando a mesma função do servidor |
| US-06 Status | Mudança com progresso recalculado; conclusão e reabertura automáticas da implantação (RN-06) |
| US-07 Prazo e responsável | Motivo obrigatório; prazo original preservado e exibido |
| US-08 Comentários e histórico | Comentários internos e histórico em frases legíveis, mais recente primeiro |

Tudo com autorização no servidor e auditoria na mesma transação.

## Ficou fora

- Reordenar tarefas dentro de uma implantação já criada (o modelo é copiado como está).
- Excluir comentário (não existe por decisão: o histórico é de inserção apenas).

## O que aprendi

- **A função de prazo é onde mora o risco.** Escrevi os testes de fim de semana, virada de ano e ano bissexto antes da tela. Tratar datas como "dia civil" (UTC 00:00) em vez de timestamp evitou os bugs de fuso.
- **Cópia do modelo.** Testei explicitamente que reescrever o modelo não muda a implantação já criada.
- **Teste contra banco real vale o custo.** O teste de integração obrigou a pensar na ordem de criação (etapa antes da tarefa) e nas transações.
- **Defeito encontrado depois, na exploração:** o ajuste de prazo sem mudança respondia "salvo" (D4). Detalhes na [Reunião 5](../05-qualidade/04-reuniao-5-uat.md).
