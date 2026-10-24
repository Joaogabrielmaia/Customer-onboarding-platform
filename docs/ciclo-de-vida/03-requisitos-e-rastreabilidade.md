# 03 · Requisitos e rastreabilidade

**Objetivo:** mostrar como as necessidades do discovery viraram requisitos, regras e histórias, e como cada uma chega à implementação e ao teste.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [01 Visão e discovery](01-visao-e-discovery.md) · [04 Arquitetura](04-arquitetura-e-adrs.md) · [07 Testes e qualidade](07-testes-e-qualidade.md) · [Matriz completa](../02-definicao/08-rastreabilidade.md)

## Inventário

| Artefato | Quantidade | Documento |
|---|---|---|
| Requisitos funcionais (RF) | 20 | [Requisitos](../02-definicao/02-requisitos.md) |
| Requisitos não funcionais (RNF) | 12 | [Requisitos](../02-definicao/02-requisitos.md) |
| Regras de negócio (RN) | 18 | [Regras de negócio](../02-definicao/03-regras-de-negocio.md) |
| Histórias de usuário (US) | 14 | [Histórias](../02-definicao/04-historias-de-usuario.md) |
| Riscos (RK) | 8 | [Riscos](../02-definicao/07-riscos.md) |
| Linhas da matriz de rastreabilidade | 32 (RF e RNF) | [Matriz](../02-definicao/08-rastreabilidade.md) |

Todo requisito tem origem: uma fala marcada das reuniões (R1-xx, R2-xx, R3-xx, M4-xx) ou uma premissa do projeto.

## Priorização MoSCoW

| Nível | Itens | Justificativa |
|---|---|---|
| Must | RF-01 a RF-16 e RF-18 | Sem eles o fluxo ponta a ponta (modelo, implantação, painel, portal) não existe; RF-18 subiu na reunião 4 |
| Should | RF-17 (usuários pela interface), RF-19 (mensagem pronta com o link) | Dá para operar com o seed, mas a demonstração fica menos convincente |
| Could | RF-20 (CSV), entregue na v1.1.0 | Útil, sem impacto no problema principal |
| Won't (agora) | Notificações, CRM e ERP, multiempresa, dependência entre tarefas | Custo, prazo ou complexidade |

Detalhes em [priorização e escopo](../02-definicao/05-priorizacao-e-escopo.md).

## Matriz RACI

Artefato de planejamento do cenário. R: executa; A: responde pelo resultado; C: consultado; I: informado.

| Atividade | Fundador | Líder de implantação | Implantador | Suporte e CS | Desenvolvedor |
|---|:-:|:-:|:-:|:-:|:-:|
| Definir o problema e o escopo | A | C | C | C | R |
| Priorizar o backlog | A | C | I | I | R |
| Validar protótipo | A | R | C | I | R |
| Construir e testar | I | I | I | I | A e R |
| Aceitar a entrega (UAT) | C | A e R | C | I | R |
| Revisar os modelos de implantação | I | A e R | C | I | C |
| Treinar a equipe | I | A | R | C | R |
| Operar e dar suporte | I | A | R | R | C |

## Casos de uso e fluxos

| Caso de uso | Ator | Fluxo principal | Onde está |
|---|---|---|---|
| Iniciar implantação | Implantador | Escolhe cliente, modelo e kickoff; vê a prévia dos prazos; cria | [Sequência](diagramas/seq-criar-implantacao.mmd), [tela](../imagens/04-nova-implantacao.png) |
| Atualizar tarefa | Implantador | Muda o status; o progresso é recalculado e a mudança é auditada | [Sequência](diagramas/seq-status-auditoria.mmd) |
| Acompanhar pelo painel | Fundador, líder | Abre o painel; vê atrasos da equipe e espera do cliente | [Painel](../imagens/02-painel.png) |
| Compartilhar o andamento | Implantador | Gera o link e envia a mensagem pronta | [Sequência](diagramas/seq-portal.mmd) |
| Acompanhar pelo portal | Cliente | Abre o link e vê progresso e próximas etapas | [Portal](../imagens/09-portal-cliente.png) |

O processo antes e depois da Trilha está no diagrama [AS-IS e TO-BE](01-visao-e-discovery.md#do-processo-atual-ao-processo-com-a-trilha).

## Rastreabilidade: da necessidade ao teste

![Cadeia de rastreabilidade do portal: necessidade R1-07, requisitos RF-14 e RF-15, histórias US-12 e US-13, regras RN-13 e RN-14, implementação, testes e resultado da CI](diagramas/rastreabilidade.png)

*Fonte editável: [rastreabilidade.mmd](diagramas/rastreabilidade.mmd).*

| Necessidade | Requisito | História | Regra | Implementação | Teste | Resultado |
|---|---|---|---|---|---|---|
| R2-01: roteiro padrão | RF-04, RF-05 | US-04 | RN-07, RN-09, RN-10 | [templates.ts](../../src/server/services/templates.ts) | [templates.test.ts](../../tests/integration/templates.test.ts) | CI de 2026-10-24 |
| R2-08: prazos recalculados à mão | RF-06 | US-05 | RN-01, RN-10 | [deadlines.ts](../../src/domain/deadlines.ts), [deployments.ts](../../src/server/services/deployments.ts) | [deadlines.test.ts](../../tests/unit/deadlines.test.ts), [deployments.test.ts](../../tests/integration/deployments.test.ts) | CI de 2026-10-24 |
| R1-04, R2-03: espera do cliente fora do atraso | RF-11, RF-13 | US-09 | RN-02 a RN-04 | [progress.ts](../../src/domain/progress.ts), [dashboard.ts](../../src/server/services/dashboard.ts) | [progress.test.ts](../../tests/unit/progress.test.ts), [dashboard.test.ts](../../tests/integration/dashboard.test.ts) | CI de 2026-10-24 |
| R2-05, R3-01: combinados perdidos | RF-09, RF-10 | US-08 | RN-15 | [audit.ts](../../src/server/audit.ts) | [deployments.test.ts](../../tests/integration/deployments.test.ts) | CI de 2026-10-24 |
| R2-10: quem altera o quê | RF-02 | US-01, US-03 | RN-12 | [permissions.ts](../../src/domain/permissions.ts) | [permissions.test.ts](../../tests/unit/permissions.test.ts) | CI de 2026-10-24 |
| R1-07, R3-05, R3-06: link sem login | RF-14, RF-15 | US-12, US-13 | RN-13, RN-14 | [portal-token.ts](../../src/domain/portal-token.ts), [portal.ts](../../src/server/services/portal.ts) | [portal.test.ts](../../tests/integration/portal.test.ts), [portal-token.test.ts](../../tests/unit/portal-token.test.ts), [templates-and-portal.spec.ts](../../tests/e2e/templates-and-portal.spec.ts) | CI de 2026-10-24 |
| M4-02: filtro por implantador | RF-18 | US-09 | – | [dashboard.ts](../../src/server/services/dashboard.ts) | [dashboard-and-clients.spec.ts](../../tests/e2e/dashboard-and-clients.spec.ts) | CI de 2026-10-24 |
| M4-07 e UAT: relatório no Excel | RF-20 | v1.1 | – | [csv.ts](../../src/domain/csv.ts), [reports.ts](../../src/server/services/reports.ts) | [csv.test.ts](../../tests/unit/csv.test.ts), [export-csv.spec.ts](../../tests/e2e/export-csv.spec.ts) | CI de 2026-10-24 |

A coluna Resultado remete ao [registro da execução na CI](../05-qualidade/05-execucao-ci-2026-10-24.md). Itens sem teste automatizado ficam explícitos na matriz completa: RNF-01 (desempenho não medido), RNF-09 (privacidade só no desenho) e RNF-10 (revisão de código).

## Critérios de aceite dos fluxos principais

| Fluxo | Critério (Dado, quando, então) | História |
|---|---|---|
| Criar implantação | Kickoff numa segunda e tarefa D+3: o prazo é a quinta; se cair no domingo, vai para a segunda seguinte | US-05, CA1 e CA2 |
| Cópia do modelo | Alterar o modelo depois não muda a implantação já criada | US-05, CA3 |
| Atraso | Tarefa vencida aguardando cliente não conta como atraso da equipe | US-09, CA3 |
| Compartilhar | Gerar outro link invalida o anterior; o endereço completo aparece uma vez | US-12, CA1 e CA2 |
| Portal | Tarefas internas e comentários não aparecem; token inválido mostra a mesma mensagem | US-13, CA2 e CA3 |
| Celular | A 360 px, tudo é legível sem rolagem horizontal | US-13, CA4 |

O CA4 da US-13 é o critério que o defeito D6 feriu na CI. Ver [07 Testes e qualidade](07-testes-e-qualidade.md#d6-a-falha-da-ci-de-2026-10-23).

## Registro de mudanças

| ID | Pedido | Decisão | Impacto |
|---|---|---|---|
| CH-01 | Dias de atraso grandes e em vermelho | Aceito | Ajuste visual na US-09 |
| CH-02 | Filtro do painel por implantador | Aceito | RF-18 sobe de Should para Must |
| CH-03 | Mensagem pronta com o link | Aceito | Novo RF-19 |
| CH-04 | Cliente marcar tarefa como entregue no portal | Recusado | Link sem login não pode escrever (RN-13, RN-15, ADR-007) |
| CH-05 a CH-08 | Botão "já enviei", recálculo em cadeia, PDF do painel, calendário | Adiados | Roadmap v1.1, v1.2 e v2 |
| RF-20 | Relatório em CSV | Entregue na v1.1.0 | Origem: CH-07 e UAT |
| D1 a D6 | Defeitos encontrados | Corrigidos | [Registro de defeitos](../05-qualidade/02-resultado-da-ultima-execucao.md) |

Justificativas completas em [change-log](../04-prototipo/03-change-log.md).
