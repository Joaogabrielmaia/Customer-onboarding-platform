# Glossário

**Objetivo:** explicar em uma linha os termos e siglas usados no projeto, com link para onde aparecem.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Guia da série](INDEX.md) · [README](../README.md)

| Termo | Definição | Onde aparece |
|---|---|---|
| Implantação | Conjunto de etapas e tarefas para colocar o sistema da software house em uso no cliente. | [Empresa fictícia](01-discovery/02-empresa-rota-facil.md) |
| Kickoff | Reunião de início da implantação; é o dia 0 de onde os prazos são contados. | [ADR-004](03-arquitetura/adr/004-tarefas-e-prazos-relativos.md) |
| D+n | Prazo relativo ao kickoff: "D+3" é três dias depois dele. O sistema converte em data real ao criar a implantação. | [ADR-004](03-arquitetura/adr/004-tarefas-e-prazos-relativos.md) · [Nova implantação](imagens/04-nova-implantacao.png) |
| Go-live | Momento em que o cliente começa a usar o sistema de fato. | [Plano de rollout](06-treinamento-e-rollout/01-plano-de-rollout.md) |
| Aguardando cliente | Situação em que a tarefa depende do cliente; não conta como atraso da equipe. | [Problemas priorizados](01-discovery/08-problemas-priorizados.md) · [Painel](imagens/02-painel.png) |
| Persona | Perfil fictício de quem usa ou é afetado pelo produto, com o que espera dele. | [Stakeholders e personas](01-discovery/03-stakeholders-e-personas.md) |
| AS-IS | Retrato do processo como ele funciona hoje, antes do sistema. | [Processo AS-IS](01-discovery/07-processo-as-is.md) |
| MVP | Primeira versão, com o mínimo que faz o fluxo de ponta a ponta funcionar. | [Priorização e escopo](02-definicao/05-priorizacao-e-escopo.md) |
| MoSCoW | Classificação de itens em Must, Should, Could e Won't (deve, deveria, poderia, não agora). | [Priorização e escopo](02-definicao/05-priorizacao-e-escopo.md) |
| RF, RNF, RN | Requisito funcional (o que o sistema faz), não funcional (com que qualidade) e regra de negócio (regra que ele aplica). | [Requisitos](02-definicao/02-requisitos.md) · [Regras de negócio](02-definicao/03-regras-de-negocio.md) |
| Rastreabilidade | Ligação de cada requisito a uma história, um teste e uma tela. | [Matriz de rastreabilidade](02-definicao/08-rastreabilidade.md) |
| Definition of Done | Lista do que precisa estar pronto para uma história ser considerada entregue. | [Backlog e sprints](02-definicao/06-backlog-e-sprints.md) |
| ADR | Registro de uma decisão de arquitetura: contexto, alternativas, escolha, custo e quando mudar. | [ADR-001](03-arquitetura/adr/001-framework.md) |
| Auditoria | Registro de quem mudou o quê e por quê; gravado na mesma transação da mudança. | [ADR-005](03-arquitetura/adr/005-auditoria.md) · [Histórico](imagens/06-historico.png) |
| Portal por token | Página de leitura do cliente, aberta por um link secreto, sem login. | [ADR-007](03-arquitetura/adr/007-portal-por-token.md) · [Portal](imagens/09-portal-cliente.png) |
| Token e hash | Token é o código aleatório do link; hash (SHA-256) é a impressão dele que o banco guarda no lugar do original. | [ADR-007](03-arquitetura/adr/007-portal-por-token.md) |
| Seed | Dados de demonstração carregados no banco para a equipe ver o sistema preenchido. | [Resultado da última execução](05-qualidade/02-resultado-da-ultima-execucao.md) |
| Teste unitário, de integração e E2E | Verificam, respectivamente, uma regra isolada, o serviço com o banco real e o fluxo completo no navegador. | [Estratégia de testes](05-qualidade/01-estrategia-de-testes.md) |
| axe | Ferramenta automática que aponta problemas de acessibilidade em uma tela. | [Estratégia de testes](05-qualidade/01-estrategia-de-testes.md) |
| UAT | Teste de aceitação: quem vai usar confere se cada critério combinado foi atendido. | [Reunião 5](05-qualidade/04-reuniao-5-uat.md) |
| CI | Rotina automática no GitHub que roda lint, tipos, testes e build a cada envio. | [Workflow](../.github/workflows/ci.yml) · [Limites](../README.md#limites-riscos-e-evolução-prevista) |
| Rollout | Plano de como a equipe passaria a usar o sistema, em etapas e com critério para avançar. | [Plano de rollout](06-treinamento-e-rollout/01-plano-de-rollout.md) |
| Plano de volta (rollback) | Caminho para retomar o processo anterior se a entrada em uso der errado. | [Checklist e plano de volta](06-treinamento-e-rollout/02-checklist-de-entrada-em-uso.md) |
| Runbook | Roteiro de operação: como investigar problemas, fazer backup e reverter. | [Runbook](07-pos-go-live/runbook.md) |
| Product Goal e Product Backlog | Objetivo do produto e lista priorizada do que será construído. | [Planejamento e Scrum](ciclo-de-vida/02-planejamento-e-scrum.md) |
| Sprint | Bloco de trabalho com objetivo, escopo e critérios de conclusão. Neste projeto são cinco. | [Sprints](ciclo-de-vida/sprints/README.md) |
| Release plan | Plano de quais versões saem com qual conteúdo. | [Planejamento e Scrum](ciclo-de-vida/02-planejamento-e-scrum.md#release-plan) |
| RACI | Matriz que diz quem executa (R), responde (A), é consultado (C) e é informado (I) em cada atividade. | [Requisitos](ciclo-de-vida/03-requisitos-e-rastreabilidade.md#matriz-raci) |
| Diagrama ER | Desenho das tabelas do banco e de como se relacionam. | [Modelo de dados](ciclo-de-vida/05-modelo-de-dados.md) |
| Migration | Arquivo versionado que cria ou altera as tabelas do banco. | [Modelo de dados](ciclo-de-vida/05-modelo-de-dados.md#migrations) |
| Transação | Conjunto de gravações que acontecem todas ou nenhuma; a auditoria usa a mesma da mudança. | [Arquitetura](ciclo-de-vida/04-arquitetura-e-adrs.md#fluxos-principais) |
| Conventional Commits | Padrão de mensagem de commit (`feat`, `fix`, `docs`) que cita o ID do requisito. | [Desenvolvimento e configuração](ciclo-de-vida/06-desenvolvimento-e-configuracao.md) |
| Versionamento semântico | Numeração MAIOR.MENOR.CORREÇÃO das versões, como v1.1.0. | [Desenvolvimento e configuração](ciclo-de-vida/06-desenvolvimento-e-configuracao.md) |
| Análise de causa raiz | Investigação do motivo de um defeito, além do sintoma. | [Testes e qualidade](ciclo-de-vida/07-testes-e-qualidade.md#defeitos-e-análise-de-causa-raiz) |
| Dívida técnica | Trabalho adiado que o código ou o processo ainda deve. | [Desenvolvimento e configuração](ciclo-de-vida/06-desenvolvimento-e-configuracao.md#dívida-técnica) |
