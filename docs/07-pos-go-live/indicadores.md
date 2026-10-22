# Indicadores de acompanhamento (propostos)

**Objetivo:** definir o que eu acompanharia depois do lançamento e como extrair do sistema.
**Data:** 2026-10-22 · **Status:** proposta. **Todos os indicadores são hipóteses de medição; não existe resultado medido**.
Relacionados: [Visão e metas](../02-definicao/01-visao-e-metas.md) · [Plano de rollout](../06-deploy-e-go-live/01-plano-de-rollout.md)

> Nenhum número abaixo é um resultado. As metas (quando existirem) seriam definidas **depois** de ver a linha de base do cliente real. Sem linha de base, não faz sentido prometer "reduzir X%".

## Princípio

Poucos indicadores, ligados às hipóteses H1 a H5 da visão, e cada um com a pergunta que responde, a origem do dado e a armadilha.

| ID | Hipótese ligada | Indicador | Pergunta que responde | Origem do dado | Armadilha |
|---|---|---|---|---|---|
| I1 | H1 | Aberturas do painel por semana (por administrador) | O fundador usa o painel ou continua perguntando? | Logs de acesso (hoje não registrados: precisaria de evento) | Abrir muito não é entender; cruzar com entrevista |
| I2 | H2 | Mensagens "como está minha implantação?" por implantação | O portal reduz as consultas? | Contagem manual no WhatsApp, antes e depois do piloto | Amostra pequena; sazonalidade |
| I3 | H2 | Implantações com link do cliente gerado | O implantador oferece o portal? | Tabela `PortalLink` | Link gerado não é link aberto |
| I4 | H3 | Proporção de implantações criadas a partir de modelo | A padronização pegou? | `Deployment.templateId` não nulo | No sistema é 100% por desenho; o relevante é quantas implantações **fora** da Trilha ainda existem |
| I5 | H4 | Comentários por implantação | Os combinados estão sendo registrados? | Tabela `Comment` | Quantidade não é qualidade |
| I6 | H5 | Prazo planejado × real (dias) por implantação concluída | O tempo ficou mais previsível? | `kickoffDate`, último prazo e `completedAt` | Poucas implantações por trimestre: variância alta |
| I7 | — | Tarefas com prazo alterado e motivos mais comuns | Onde o modelo não representa a realidade? | `AuditLog` (`TASK_DUE_DATE_CHANGED`, com motivo) | Motivo em texto livre exige leitura manual |
| I8 | — | Tarefas em "aguardando cliente" por mais de N dias | Quanto do atraso vem do cliente? | Status e prazo das tarefas | Depende de o implantador usar o status corretamente |
| I9 | RK-08 | Tarefas abertas sem nenhuma atualização há mais de N dias | A equipe está preenchendo? | `AuditLog` por tarefa | Tarefa longa e legítima pode parecer parada |

## O que o painel já calcula hoje

- Contagens de em andamento, atrasadas, aguardando cliente e concluídas.
- Tempo médio de implantação (média de `conclusão − kickoff` das concluídas).

## O que falta para medir de verdade

- Registro de eventos de uso (para I1).
- Contagem de aberturas do portal, sem guardar IP nem dado pessoal (para I3). Decisão de privacidade antes de implementar.
- Uma consulta ou relatório para I6 a I9 (candidato a evolução).

## Como eu apresentaria

Uma página mensal, com no máximo cinco números e uma frase de interpretação cada, **sempre com o tamanho da amostra ao lado**. Se a amostra for pequena demais, digo "ainda não dá para concluir".
