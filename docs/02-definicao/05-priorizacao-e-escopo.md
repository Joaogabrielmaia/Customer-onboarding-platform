# Priorização (MoSCoW) e escopo

**Objetivo:** deixar claro o que entra no MVP, o que fica para depois e por quê.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Requisitos](02-requisitos.md) · [Backlog](06-backlog-e-sprints.md) · [Riscos](07-riscos.md)

## MoSCoW

| Nível | Itens | Justificativa |
|---|---|---|
| **Must** | RF-01 a RF-16 | Sem eles o fluxo de ponta a ponta (modelo → implantação → painel → portal) não existe |
| **Should** | RF-17 (gestão de usuários), RF-18 (filtros) | Sem eles dá para operar com o seed, mas a demo fica menos convincente |
| **Could** | Exportar relatório em CSV/PDF (candidato à v1.1), tema escuro | Úteis, sem impacto no problema principal |
| **Won't (agora)** | Ver abaixo | Custo, prazo ou complexidade |

Observação: RF-17 e RF-18 entram na sprint 1 e 3 respectivamente, se o tempo permitir; são o primeiro corte se apertar.

## Escopo do MVP

Papéis; clientes; modelos com prazo relativo; implantação com datas calculadas, status, responsável, comentários e auditoria; painel; regra de atraso; portal do cliente por token; seed.

## Fora do escopo (e por quê)

| Item | Motivo | Quando reconsiderar |
|---|---|---|
| Notificações por e-mail e WhatsApp | WhatsApp oficial tem custo por conversa, fora do teto de R$ 100/mês (R1-05, R1-06); e-mail exige domínio e entregabilidade | v1.1 ou v1.2, começando por e-mail |
| Integração com CRM/ERP | Sem API definida e sem caso concreto no cenário | Quando houver um sistema de origem definido |
| Assinatura digital | Não é a dor principal | Provavelmente nunca nesta ferramenta |
| Cobrança | Risco alto, fora do problema | Outro produto |
| App mobile | O portal responsivo cobre o uso do cliente | Se houver demanda de uso offline |
| Multiempresa (multi-tenant) | A ferramenta atende uma só empresa; multi-tenant dobra a complexidade de dados e permissões | Se virar produto para outras software houses |
| Subtarefas, anexos, campos personalizados, tempo gasto | Contradição resolvida a favor do simples (R2-06, R2-07) | v2, após validar o uso do MVP |
| Dependência entre tarefas (prazo relativo a outra tarefa) | Exige recalcular em cadeia; ajuste manual auditado cobre o caso (R2-08) | v2 |
| Feriados no cálculo de prazo | Precisa de calendário por região; fim de semana já cobre o grosso | v1.2 |
| Recuperação de senha por e-mail | Depende de e-mail; o admin redefine senha no MVP | Junto com notificações |
