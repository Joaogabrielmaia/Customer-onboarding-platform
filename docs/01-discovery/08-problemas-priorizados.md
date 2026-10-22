# Problemas priorizados

**Objetivo:** listar os problemas encontrados no discovery, com causa raiz, impacto e evidência, e priorizá-los.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [AS-IS](07-processo-as-is.md) · [Reunião 1](04-reuniao-1-kickoff-fundador.md) · [Reunião 2](05-reuniao-2-lideranca-e-implantador.md) · [Reunião 3](06-reuniao-3-suporte-e-cliente.md)

> Baseado nas reuniões do discovery. Impacto é qualitativo (alto/médio/baixo), é julgamento meu e não há medição.

| ID | Problema | Causa raiz | Impacto | Evidência | Prioridade |
|---|---|---|---|---|---|
| P1 | Atrasos só são descobertos tarde | Não existe visão única do estado das implantações; o acompanhamento depende de pergunta verbal | Alto | R1-01, R1-02, R1-08 | 1 |
| P2 | Combinados com o cliente se perdem | Ficam em conversas de WhatsApp, sem registro por tarefa | Alto | R2-05, R3-01 | 2 |
| P3 | Cada implantação segue um roteiro diferente | Planilhas pessoais, sem modelo padrão | Alto | R2-01, R2-02 | 3 |
| P4 | Espera pelo cliente não é separada do atraso da equipe | Não há status que represente "aguardando cliente" | Médio | R1-04, R2-03, R2-04 | 4 |
| P5 | Cliente não sabe o que falta nem o que é com ele | Sem canal de visibilidade além de perguntar por WhatsApp | Médio | R3-02, R3-03, R3-04 | 5 |
| P6 | Prazos recalculados à mão | Datas fixas na planilha, sem relação com o kickoff | Médio | R2-08 | 6 |
| P7 | Implantadores esquecem pendências | Sem fila de pendências por pessoa | Médio | R2-09 | 7 |

## Como priorizei

Usei o impacto no fundador e na carga de trabalho, e se a solução cabe no orçamento. P1, P2 e P3 resolvem o que mais dói e dependem de coisas que cabem no MVP (painel, comentários com histórico e modelos). P4 a P7 entram também, porque custam pouco depois que o modelo de dados está certo.

## O que o discovery me ensinou (e mudou)

1. A hipótese de que a dor era "falta de suporte pós-venda" (que me levaria a chamados) **não se confirmou**. A raiz está na implantação (ver [brainstorm](01-brainstorm-e-escolha.md)).
2. O pedido "painel bonito" virou requisito concreto: atrasadas, de quem, há quanto tempo.
3. Dois pedidos foram para fora do MVP por restrição: WhatsApp automático (custo) e dependência entre tarefas (complexidade).
4. O cliente não faz login, então o portal por link com token entrou como requisito central.
