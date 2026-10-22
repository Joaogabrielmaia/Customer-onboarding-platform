# Sprint 3 (Visão e cliente): review

**Objetivo da sprint:** painel, atraso, pendências, portal por token, seed completo e acabamento.
**Data:** 2026-10-22 · **Status:** concluída
Relacionados: [Sprint 2](sprint-2-review.md) · [Change-log](../04-prototipo/03-change-log.md) · [Resultado da execução](../05-qualidade/02-resultado-da-ultima-execucao.md)

## Entregue

| História | Resultado |
|---|---|
| US-09 Painel | Contagens, "atenção primeiro" com dias de atraso grandes em vermelho (CH-01), espera do cliente separada, tempo médio rotulado como "só dados de demonstração", filtro por implantador (CH-02) |
| US-10 Pendências | Fila do usuário ordenada por atraso e fila por implantador no painel |
| US-11 Regra de atraso | Tolerância configurável (só admin), com auditoria |
| US-12 Link do cliente | Gerado e mostrado uma vez, mensagem pronta para copiar (CH-03), revogável, um ativo por implantação |
| US-13 Portal | Leitura, mobile first, sem comentários nem tarefas internas |
| US-14 Seed | 8 clientes, 3 modelos e 7 implantações em estados variados, datas relativas a hoje |
| (extra) | Healthcheck `/api/health` e logs em JSON sem dados pessoais |

## Ficou fora

- **Estado vazio do painel sem teste automatizado** (implementado, mas não verificado por teste).
- Exportação de relatório (candidata à v1.1) e calendário semanal (CH-08).

## O que aprendi

- **O portal é pequeno, mas o risco é alto.** A maior parte do trabalho foi garantir o que *não* aparece: o teste serializa a resposta do portal e procura textos internos (comentário, motivo do histórico, tarefa interna) para provar que não vazam.
- **Dados de demonstração precisam de design.** Fiz cada implantação "parar" em uma tarefa-pivô, com datas relativas a hoje, para que a demo sempre mostre atrasada, aguardando cliente, no prazo e concluída.
- **Exploração manual acha o que teste não pensou.** A rolagem horizontal no celular (D3) só apareceu porque olhei as telas em 390 px.
