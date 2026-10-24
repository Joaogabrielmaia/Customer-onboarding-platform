# Sprint 4 · Qualidade e prontidão

**Objetivo:** fechar o MVP com evidência: CI configurada, defeitos encontrados e corrigidos, aceite com a líder de implantação e planos de entrada em uso.
**Data:** janela acadêmica de 12 a 16/10/2026 · **Status:** concluída
Relacionados: [Sprints](README.md) · [Índice do ciclo de vida](../README.md) · [07 Testes e qualidade](../07-testes-e-qualidade.md) · [Sprint 3](sprint-3-visao-e-cliente.md) · [Sprint 5](sprint-5-evolucao.md)

## Escopo

| Item | Requisitos | Prioridade |
|---|---|---|
| Workflow de CI com lint, tipos, testes e build | RNF-11 | Must |
| Teste de rolagem horizontal em celular e correção | RNF-06 | Must |
| Verificação de acessibilidade com axe | RNF-07 | Must |
| Teste de aceitação (UAT) dos critérios das histórias | US-01 a US-14 | Must |
| Estratégia de testes, limitações e registro da execução | Documentação | Must |
| Plano de rollout, checklist, plano de volta, treinamento e comunicação | Documentação | Must |

## Critérios de conclusão da sprint

- Lint, tipos, testes unitários, de integração e E2E passando na máquina de desenvolvimento, com a saída registrada.
- Cada defeito encontrado tem causa, correção e teste de regressão ou verificação.
- Limitações escritas, inclusive o que não foi verificado.
- Planos de entrada em uso com status declarado.
- Tag `v1.0.0`.

## Planejamento

A sprint troca construção por verificação. O plano é rodar os critérios de aceite no sistema real, explorar em tela pequena, registrar o que falhar e só então fechar a versão. O workflow de CI é escrito nesta sprint a partir dos mesmos comandos usados localmente.

## Review

Entregue: a [estratégia de testes](../../05-qualidade/01-estrategia-de-testes.md), o [registro da execução](../../05-qualidade/02-resultado-da-ultima-execucao.md) com os defeitos D1 a D4, as [limitações](../../05-qualidade/03-limitacoes-conhecidas.md), o [UAT](../../05-qualidade/04-reuniao-5-uat.md) (reunião simulada, resultados reais) e os planos de [rollout](../../06-treinamento-e-rollout/README.md). O D3 (rolagem horizontal de 53 px em 390 px) e o D4 (ajuste de prazo sem mudança respondia "salvo") foram corrigidos com teste.

## Retrospectiva

- Os defeitos de tela pequena e de ajuste sem mudança só apareceram na exploração do fim; uma passada exploratória por sprint teria achado antes.
- A acessibilidade foi verificada só pelas regras automáticas do axe; teclado e leitor de tela ficaram como pendência.
- Escrever "CI" nos documentos antes de ela rodar no GitHub foi um risco apontado na [retrospectiva final](../../07-pos-go-live/retrospectiva-final.md). A primeira execução, em 2026-10-23, falhou no E2E do portal (D6), o que a máquina de desenvolvimento não mostrava.

## Evidências

| Evidência | Registro |
|---|---|
| Correção do D3 e do D4, com testes | Commit `d103eb3` |
| Workflow de CI e prints | Commit `4aa7a7a` |
| Estratégia, resultado, limitações e UAT | Commit `731ea04` |
| Planos de entrada em uso | Commit `e71efb7` |
| Release | Tag `v1.0.0` em 2026-10-22, commit `e71efb7` |
| CI | [Falha de 2026-10-23](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/39984884953) e [verde de 2026-10-24](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40098547445) |
