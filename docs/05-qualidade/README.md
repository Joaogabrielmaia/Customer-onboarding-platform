# Episódio 5 — Qualidade

A estratégia combina testes unitários (regras puras), de integração (contra PostgreSQL real) e E2E (fluxo completo no navegador, com verificação de acessibilidade pelo axe). O registro local de 2026-10-22, na versão v1.1.0, tem 156 testes passando e cinco defeitos (D1 a D5) corrigidos. Em 2026-10-24 os mesmos 156 testes passaram na CI do GitHub (commit `366f1f5`), depois da correção do D6, o defeito que a primeira execução da CI revelou.

O registro também diz o que não prova: a CI roda só Chromium em Linux, a cobertura de código não foi medida, e Firefox, Safari, celular físico, desempenho e acessibilidade manual não foram verificados. O UAT (teste de aceitação) é uma reunião simulada; seus resultados vêm de execução real dos critérios.

| Documento | O que contém | Itens |
|---|---|---|
| [Estratégia de testes](01-estrategia-de-testes.md) | O que é testado, em que camada e por quê | 3 camadas |
| [Resultado da última execução](02-resultado-da-ultima-execucao.md) | Comandos, saídas, histórico de falhas e defeitos | 156 testes · D1 a D5 |
| [Execução na CI de 2026-10-24](05-execucao-ci-2026-10-24.md) | Run verde no GitHub e a falha E2E anterior | 156 testes · D6 |
| [Limitações conhecidas](03-limitacoes-conhecidas.md) | O que o sistema não faz, não testa ou faz de forma limitada | Produto, Segurança, Qualidade e testes |
| [Reunião 5: UAT](04-reuniao-5-uat.md) | Critérios de aceite executados no sistema; reunião simulada | critérios das histórias |

← [Episódio 4: Protótipo](../04-prototipo/README.md) · [Índice](../INDEX.md) · [Episódio 6: Treinamento e rollout](../06-treinamento-e-rollout/README.md) →
