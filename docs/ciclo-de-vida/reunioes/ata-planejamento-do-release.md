# Ata: planejamento do release e das sprints

**Objetivo:** acordar o objetivo do produto, a ordem do backlog e o critério de corte antes da construção.
**Data:** 2026-09-18 (cronograma acadêmico) · **Status:** concluído
Participantes: fundador, líder de implantação e implantador (papéis do cenário).
Relacionados: [Reuniões](README.md) · [02 Planejamento e Scrum](../02-planejamento-e-scrum.md) · [Backlog original](../../02-definicao/06-backlog-e-sprints.md)

> Reunião simulada; pessoas e empresa fictícias.

Esta ata é um artefato de planejamento do estudo de caso: a data pertence ao cronograma acadêmico e não corresponde a nenhum commit.

## Pauta

1. Objetivo do produto e do release.
2. Ordem do backlog e divisão em sprints.
3. Critério de corte se o tempo apertar.
4. Riscos e dependências.

## Registro

| Item | Registro |
|---|---|
| Objetivo | Uma visão única das implantações, com atraso da equipe separado da espera do cliente, e um portal de leitura por link, dentro do teto de custo |
| Ordem | Autenticação e dados mestres, depois o núcleo (modelo, implantação, tarefas, auditoria), depois painel e portal, depois qualidade |
| Sprints | Três sprints de construção, uma de qualidade e prontidão e uma de evolução |
| Corte | Primeiro a mensagem pronta do link (RF-19), depois a gestão de usuários pela interface (RF-17) e, por último, o portal |
| Revisão dos modelos | A líder de implantação revisa os modelos antes da entrada em uso |
| Fora do release | Notificações, integração com CRM e ERP, multiempresa, dependência entre tarefas |

## Riscos tratados

| Risco | Combinado |
|---|---|
| RK-02: uma pessoa só | Cortes definidos desde já, na ordem acima |
| RK-03: erro de prazo | Testar a função de prazo antes da tela |
| RK-08: equipe não preencher | Tarefas nascem do modelo e a fila de pendências dá benefício imediato |

## Encaminhamentos

- Validar os wireframes com fundador e líder antes da sprint 3 ([reunião 4](../../04-prototipo/02-reuniao-4-validacao.md)).
- Executar os critérios de aceite no sistema real na sprint 4 ([reunião 5](../../05-qualidade/04-reuniao-5-uat.md)).
