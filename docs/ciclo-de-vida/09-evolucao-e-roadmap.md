# 09 · Evolução e roadmap

**Objetivo:** mostrar como o produto mudou depois do MVP, o que foi corrigido, o que continua em aberto e por que a próxima versão tem a ordem que tem.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [03 Requisitos](03-requisitos-e-rastreabilidade.md) · [07 Testes e qualidade](07-testes-e-qualidade.md) · [Roadmap original](../07-pos-go-live/roadmap.md) · [CHANGELOG](../../CHANGELOG.md)

![Linha de evolução: v1.0.0 e v1.1.0 entregues, correção do D6 com CI verde, e as propostas v1.2 e v2 em linha tracejada](diagramas/evolucao.png)

*Entregue em linha cheia; proposta em linha tracejada. Fonte editável: [evolucao.mmd](diagramas/evolucao.mmd).*

## Histórico de versões

| Versão | Data da tag | Conteúdo | Origem da mudança |
|---|---|---|---|
| v1.0.0 | 2026-10-22 | MVP: login e papéis, clientes, modelos com D+n, implantações, comentários, auditoria, painel, regra de atraso e portal por token | Problemas P1 a P7 do discovery |
| v1.1.0 | 2026-10-22 | Exportação do relatório da implantação e da lista em CSV (RF-20), com neutralização de injeção de fórmula; script de redefinição de senha | Pedido da validação (CH-07) e da retrospectiva simulada |
| Não lançado | – | Correção do D6 no portal, porta do E2E por variável de ambiente, galeria com 14 telas | CI de 2026-10-23 |

Notas de cada versão no [CHANGELOG](../../CHANGELOG.md) e nas [releases do GitHub](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/releases).

## Solicitações de mudança e impacto

As oito solicitações da validação do protótipo (três aceitas, uma recusada, quatro adiadas) e a entrega do RF-20 estão no [registro de mudanças](03-requisitos-e-rastreabilidade.md#registro-de-mudanças), com a justificativa de cada uma no [change-log](../04-prototipo/03-change-log.md). A recusa que mais pesou foi a de o cliente marcar tarefa como entregue no portal: o link não tem login, então permitir escrita deixaria qualquer pessoa com o link alterar o andamento (CH-04, [ADR-007](../03-arquitetura/adr/007-portal-por-token.md)).

## Problemas identificados e ações corretivas

| Defeito | Ação corretiva | Estado |
|---|---|---|
| D1 a D5 | Corrigidos durante a construção e a verificação, cada um com teste ou verificação | Fechados ([registro](../05-qualidade/02-resultado-da-ultima-execucao.md)) |
| D6: portal com rolagem horizontal na CI | Rótulo "(atrasada)" em linha própria e título que encolhe; checagem a 300 px no teste do portal | Fechado, CI verde ([análise](07-testes-e-qualidade.md#d6-a-falha-da-ci-de-2026-10-23)) |
| Texto dizendo que a CI nunca rodou | Corrigido depois de consultar as execuções no GitHub | Fechado |

## Dívida técnica priorizada

A lista completa, com origem e estratégia, está em [06 Desenvolvimento e configuração](06-desenvolvimento-e-configuracao.md#dívida-técnica). Em ordem: teste de falha na transação de auditoria; cobertura de código; acessibilidade manual; limite de requisições no portal; imutabilidade da auditoria; matriz de navegadores.

## Roadmap

O [roadmap original](../07-pos-go-live/roadmap.md) não tem datas, de propósito. A tabela relaciona cada item a uma necessidade, limitação ou risco já registrado.

| Versão | Item | Conecta-se a |
|---|---|---|
| v1.2 | Alerta de atraso por e-mail | Fala do fundador na retrospectiva simulada: "queria ser avisado"; hipótese H1 |
| v1.2 | Limite de tentativas de login e de acessos ao portal | Limitação do ADR-007 e dívida técnica |
| v1.2 | Estado vazio do painel e atomicidade da auditoria com teste | Lacunas de teste das [limitações](../05-qualidade/03-limitacoes-conhecidas.md) |
| v1.2 | Concluir várias tarefas de uma vez | Dor do implantador na retrospectiva simulada |
| v1.2 | Feriados no cálculo de prazo | Fora do escopo do MVP, com gatilho v1.2 |
| v2 | Dependência entre tarefas | CH-06; exige novo ADR |
| v2 | Botão "já enviei" no portal, com confirmação | CH-04 e CH-05; exigiria segundo fator por e-mail |
| v2 | Integração com CRM e ERP, multiempresa | Fora do escopo; dependem de sistema de origem e de virar produto |

Critério para a ordem: antes de qualquer item da v2, olhar o uso real; se a equipe não preencher o MVP (RK-08), acrescentar campos não ajuda. Como não houve uso real, esse critério continua em aberto.

## Lições aprendidas e melhorias de processo

| Lição | Origem | Melhoria de processo |
|---|---|---|
| Pedido vago vira requisito com uma boa pergunta ("painel bonito" virou "o que está atrasado, de quem e há quanto tempo") | Discovery | Perguntar a decisão que a pessoa tomaria com a tela |
| Regras em funções puras com testes de borda foram onde o teste mais compensou | Sprint 2 | Escrever o teste da regra antes da tela |
| O que o sistema esconde importa tanto quanto o que mostra (portal) | Sprint 3 | Testar o que não pode aparecer |
| Defeitos de tela pequena só apareceram no fim | Sprint 4 | Passada exploratória em tela pequena a cada sprint |
| A máquina de desenvolvimento não reproduz a CI (fontes diferentes, D6) | CI de 2026-10-23 | Rodar a CI antes de escrever "CI" nos documentos; conferir layouts em largura menor que a alvo |
| Documentar limitações deixa o restante mais confiável | Retrospectiva final | Manter a lista de limitações atualizada a cada versão |
