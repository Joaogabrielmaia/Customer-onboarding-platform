# 02 · Planejamento e Scrum

**Objetivo:** mostrar como o escopo virou backlog, releases e sprints, com cerimônias, riscos e critérios de repriorização.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [Sprints](sprints/README.md) · [Backlog original](../02-definicao/06-backlog-e-sprints.md) · [01 Visão e discovery](01-visao-e-discovery.md) · [03 Requisitos](03-requisitos-e-rastreabilidade.md)

As sprints, as datas e as cerimônias deste documento são artefatos de planejamento do estudo de caso. As evidências técnicas citadas (commits, tags, execuções da CI) são observadas e mantêm as datas dos registros. Não existem estimativas em pontos, velocity nem burndown medidos; nada disso é apresentado como observado.

## Product Goal

Dar à equipe de implantação uma visão única das implantações em andamento, em que o atraso da equipe fique separado da espera do cliente, e dar ao cliente um modo de acompanhar o andamento sem criar conta, dentro de cerca de R$ 100/mês e de um desenvolvedor.

## Product Backlog priorizado

A ordem segue a priorização MoSCoW do [escopo](../02-definicao/05-priorizacao-e-escopo.md) e a dependência técnica entre os itens.

| Ordem | Item | Requisitos | MoSCoW | Sprint | Justificativa da posição |
|---|---|---|---|---|---|
| 1 | Entrar no sistema, com papéis | RF-01, RF-02 | Must | 1 | Tudo depende de autenticação e autorização |
| 2 | Clientes e usuários | RF-03, RF-17 | Must e Should | 1 | Dados mestres para criar implantações |
| 3 | Modelos de implantação | RF-04, RF-05 | Must | 2 | Origem de todas as tarefas |
| 4 | Criar implantação com datas D+n | RF-06 | Must | 2 | Núcleo do produto; o prazo é o maior risco técnico (RK-03) |
| 5 | Status, prazo com motivo, comentários e histórico | RF-07 a RF-10 | Must | 2 | Rastreabilidade do que foi combinado (P2) |
| 6 | Painel e regra de atraso | RF-11, RF-13, RF-18 | Must | 3 | Responde "o que está atrasado, de quem e há quanto tempo" (P1, P4) |
| 7 | Fila de pendências | RF-12 | Must | 3 | Benefício imediato para o implantador (RK-08) |
| 8 | Link e portal do cliente | RF-14, RF-15, RF-19 | Must e Should | 3 | Substitui o WhatsApp automático (R1-07) |
| 9 | Seed de demonstração | RF-16 | Must | 1 e 3 | Permite demonstrar e testar os estados |
| 10 | Qualidade, CI e prontidão | RNF-06, RNF-07, RNF-11 | Must | 4 | Fechar o MVP com evidência |
| 11 | Exportar relatório em CSV | RF-20 | Could | 5 | Pedido da validação, adiado do MVP (CH-07) |
| 12 | Calendário, PDF, dependência entre tarefas, avisos | Roadmap | Won't agora | v1.2 e v2 | [Roadmap](../07-pos-go-live/roadmap.md) |

## Release plan

| Release | Conteúdo | Sprints | Registro observado |
|---|---|---|---|
| v1.0.0 | MVP: RF-01 a RF-19, painel, portal por token, testes e CI configurada | 1 a 4 | Tag `v1.0.0` em 2026-10-22, commit `e71efb7` |
| v1.1.0 | Exportação do relatório em CSV (RF-20) | 5 | Tag `v1.1.0` em 2026-10-22, commit `a16b9bf` |
| v1.2 e v2 | Avisos, menos cliques, dependência entre tarefas, botão "já enviei" | Não planejadas | [Roadmap](../07-pos-go-live/roadmap.md), sem datas |

## Plano de sprints

As sprints 1 a 3 correspondem às três sprints do [backlog original](../02-definicao/06-backlog-e-sprints.md). As sprints 4 e 5 completam o ciclo com qualidade e evolução. Cada página tem objetivo, escopo, critérios de conclusão, planejamento, review, retrospectiva e evidências.

| Sprint | Janela (cronograma acadêmico) | Objetivo | Histórias | Evidência |
|---|---|---|---|---|
| [1 Fundação](sprints/sprint-1-fundacao.md) | 21 a 25/09/2026 | Projeto no ar, login com papéis, clientes, usuários e seed base | US-01, US-02, US-03, US-14 (parte) | Commits `e17e719`, `b1cb861`, `1761ad8`, `5705d29` |
| [2 Núcleo](sprints/sprint-2-nucleo.md) | 28/09 a 02/10/2026 | Modelo, implantação, tarefas, comentários e auditoria de ponta a ponta | US-04 a US-08 | Commits `72d6907`, `e57bb2c`, `feca826` |
| [3 Visão e cliente](sprints/sprint-3-visao-e-cliente.md) | 05 a 09/10/2026 | Painel, atraso, pendências, portal por token e seed completo | US-09 a US-14 | Commits `dcbfb74`, `d911d39` |
| [4 Qualidade e prontidão](sprints/sprint-4-qualidade.md) | 12 a 16/10/2026 | Fechar o MVP: CI, E2E, defeitos, UAT e planos de entrada em uso | RNF-06, RNF-07, RNF-11 | Commits `d103eb3`, `4aa7a7a`, `731ea04`, `e71efb7` |
| [5 Evolução v1.1](sprints/sprint-5-evolucao.md) | 19 a 21/10/2026 | Exportar o relatório em CSV sem abrir brechas de segurança | RF-20 | Commits `a2da0bc`, `fc42c5c`, `a16b9bf` |

A janela das sprints é a do cronograma acadêmico. Os commits têm a data real do histórico (2026-10-22 para todo o desenvolvimento) e não foram associados às datas do cronograma.

## Cerimônias

| Cerimônia | Como foi adaptada | Onde está o registro |
|---|---|---|
| Refinamento | Priorização MoSCoW e decomposição em histórias com critérios Dado/Quando/Então | [Histórias](../02-definicao/04-historias-de-usuario.md), [escopo](../02-definicao/05-priorizacao-e-escopo.md) |
| Sprint Planning | Objetivo, histórias e critérios de conclusão em cada página de sprint | [Sprints](sprints/README.md), [ata do release](reunioes/ata-planejamento-do-release.md) |
| Review | Entregas por história, o que ficou fora e o que foi aprendido; as reuniões 4 e 5 validam com a líder e o fundador (simuladas) | [Reviews 1 a 3](../02-definicao/sprint-1-review.md), [reunião 4](../04-prototipo/02-reuniao-4-validacao.md), [reunião 5](../05-qualidade/04-reuniao-5-uat.md) |
| Retrospectiva | Seção em cada página de sprint; retrospectiva do projeto e retrospectiva simulada | [Retrospectiva final](../07-pos-go-live/retrospectiva-final.md), [reunião 6](../07-pos-go-live/reuniao-6-retrospectiva.md) |

Com um desenvolvedor, as cerimônias de time viram registros escritos. O [review da sprint 1](../02-definicao/sprint-1-review.md) já diz que a construção seguiu a ordem das dependências e não três blocos separados no tempo.

## Definition of Ready e Definition of Done

Os critérios estão em [backlog e sprints](../02-definicao/06-backlog-e-sprints.md). Em resumo, uma história só entra na sprint com requisitos e regras com ID, critérios Dado/Quando/Então, dependências entregues e ADR escrito quando há decisão de arquitetura, e só sai com critérios verificados, teste unitário das regras, teste de integração, autorização no servidor com teste do caso negado, entrada validada com Zod, lint, tipos e testes passando, commit com o ID e documentação atualizada.

## Riscos, impedimentos e dependências

| Tipo | Registro | Tratamento |
|---|---|---|
| Risco | RK-03: cálculo de prazo e atraso com erro sutil | Funções puras com testes de fim de semana, virada de ano e ano bissexto antes da tela ([review da sprint 2](../02-definicao/sprint-2-review.md)) |
| Risco | RK-04 e RK-05: falha de autorização e vazamento do token | Autorização central, hash do token, revogação e expiração ([ADR-006](../03-arquitetura/adr/006-controle-de-acesso.md), [ADR-007](../03-arquitetura/adr/007-portal-por-token.md)) |
| Impedimento | Prisma 7 moveu a URL do banco para `prisma.config.ts` e exige adaptador de driver | Ajuste de configuração na sprint 1 ([review](../02-definicao/sprint-1-review.md)) |
| Impedimento | Primeira rodada E2E com 8 falhas, todas dos seletores do teste | Ajuste dos seletores ([resultado da execução](../05-qualidade/02-resultado-da-ultima-execucao.md)) |
| Dependência | Dois pedidos da validação dependiam de decisão de escopo | [Change-log](../04-prototipo/03-change-log.md): três aceitos, um recusado, quatro adiados |

## Critérios para repriorizar o backlog

1. Um item que bloqueia o fluxo de ponta a ponta (modelo, implantação, painel, portal) sobe.
2. Um pedido validado na reunião 4 sobe se couber na sprint sem novo requisito de segurança; caso contrário vai para o roadmap com o gatilho de retorno (CH-04, CH-05).
3. Um item que fere o teto de custo ou o orçamento de complexidade desce (WhatsApp automático, R1-05).
4. Se o tempo apertar, o corte segue a ordem registrada: mensagem pronta do link (RF-19), gestão de usuários pela interface (RF-17) e, por último, o portal.

## Indicadores de fluxo e entrega

Não há dados medidos de lead time, velocity ou burndown. O que existe e pode ser consultado:

| Indicador | Fonte | Valor |
|---|---|---|
| Histórias entregues por sprint | [Reviews](../02-definicao/sprint-1-review.md) | 3 histórias e parte da US-14 na sprint 1, 5 na sprint 2 e 6 na sprint 3 (a US-14 termina na sprint 3) |
| Defeitos achados depois da implementação | [Resultado da execução](../05-qualidade/02-resultado-da-ultima-execucao.md) | D1 a D6 |
| Releases com tag | `git tag` | v1.0.0 e v1.1.0 |
