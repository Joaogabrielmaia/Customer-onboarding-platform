# Episódio 5 — Qualidade

A estratégia combina testes unitários (regras puras), de integração (contra PostgreSQL real) e E2E (fluxo completo no navegador, com verificação de acessibilidade pelo axe). A última execução registrada é de 2026-10-22, na versão v1.1.0: 156 testes passaram, e cinco defeitos (D1 a D5) foram encontrados e corrigidos, com teste de regressão ou verificação associada.

O registro também diz o que não prova: o CI no GitHub não foi executado, a cobertura de código não foi medida, e Firefox, Safari, celular físico, desempenho e acessibilidade manual não foram verificados. O UAT (teste de aceitação) é uma reunião simulada; seus resultados vêm de execução real dos critérios.

| Documento | O que contém | Itens |
|---|---|---|
| [Estratégia de testes](01-estrategia-de-testes.md) | O que é testado, em que camada e por quê | 3 camadas |
| [Resultado da última execução](02-resultado-da-ultima-execucao.md) | Comandos, saídas, histórico de falhas e defeitos | 156 testes · D1 a D5 |
| [Limitações conhecidas](03-limitacoes-conhecidas.md) | O que o sistema não faz, não testa ou faz de forma limitada | Produto, Segurança, Qualidade e testes |
| [Reunião 5: UAT](04-reuniao-5-uat.md) | Critérios de aceite executados no sistema; reunião simulada | critérios das histórias |

← [Episódio 4: Protótipo](../04-prototipo/README.md) · [Índice](../INDEX.md) · [Episódio 6: Treinamento e rollout](../06-treinamento-e-rollout/README.md) →
