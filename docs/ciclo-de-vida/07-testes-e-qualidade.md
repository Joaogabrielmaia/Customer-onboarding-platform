# 07 · Testes e qualidade

**Objetivo:** apresentar a estratégia de testes, os casos, os resultados com evidência, os defeitos com causa raiz e o que não foi verificado.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [03 Requisitos](03-requisitos-e-rastreabilidade.md) · [06 Desenvolvimento](06-desenvolvimento-e-configuracao.md) · [Episódio 5: Qualidade](../05-qualidade/README.md) · [Estratégia original](../05-qualidade/01-estrategia-de-testes.md)

Os resultados abaixo vêm de execuções registradas em arquivo ou na CI do GitHub. O que não foi executado aparece como proposta, sem resultado.

## Estratégia e pirâmide

![Pirâmide de testes: 52 testes unitários na base, 70 de integração com PostgreSQL real no meio e 34 E2E com Playwright e axe no topo](diagramas/piramide-de-testes.png)

*Contagens da execução na CI de 2026-10-24. Fonte editável: [piramide-de-testes.mmd](diagramas/piramide-de-testes.mmd).*

| Camada | Ferramenta | O que cobre | Por que nessa camada |
|---|---|---|---|
| Unitária | Vitest | Prazo D+n, atraso, progresso, permissões, token, senha, CSV | Regra pura é onde o erro é mais fácil e o teste, mais barato |
| Integração | Vitest com PostgreSQL real | Serviços, transações, autorização, portal, seed | Mock do Prisma passaria mesmo com a transação errada |
| E2E | Playwright com axe | Fluxos críticos, celular e acessibilidade automática | Prova que a tela, o servidor e o banco funcionam juntos |
| Contrato | Não aplicável | Não há API pública nem consumidor externo | Ver [ADR-008](../03-arquitetura/adr/008-camada-de-servicos.md) |

## Tipos de caso

| Tipo | Exemplos reais |
|---|---|
| Positivo | Cria implantação a partir do modelo com prévia das datas; atualiza o status e o progresso é recalculado; baixa o relatório em CSV |
| Negativo | Recusa senha errada com mensagem genérica; implantador não acessa as telas de administração; não arquiva cliente com implantação em andamento; rota de arquivo sem login responde 401; recusa prazo negativo no modelo |
| Limite | Prazo em fim de semana, virada de ano e ano bissexto; tolerância de atraso; rolagem horizontal em 390 px e, desde o D6, em 300 px no portal |
| Erro | Mensagem por campo mantendo o que foi digitado; link inventado mostra a mesma mensagem de link indisponível; ajuste de prazo sem motivo é recusado |
| Segurança | Portal não expõe comentário nem tarefa interna; token só como hash; CSV neutraliza injeção de fórmula |
| Acessibilidade | axe em seis telas: login, painel, detalhe da implantação, clientes, editor de modelo e portal |
| Regressão | Um teste para cada defeito corrigido (tabela abaixo) |

A relação completa entre requisitos e testes está na [matriz de rastreabilidade](../02-definicao/08-rastreabilidade.md) (TC-01 a TC-38).

## Resultados observados

| Verificação | Resultado | Evidência |
|---|---|---|
| Lint e tipos | Sem erros | [CI de 2026-10-24](../05-qualidade/05-execucao-ci-2026-10-24.md) |
| Unitários | 7 arquivos, 52 testes passaram | Mesmo registro |
| Integração | 8 arquivos, 70 testes passaram | Mesmo registro |
| E2E | 34 testes passaram, 6 deles de acessibilidade | Mesmo registro |
| Build | Compilou | Mesmo registro |
| Total | 156 testes | Commit `366f1f5`, [run 40098547445](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40098547445) |

Execuções da CI registradas:

| Data | Commit | Run | Resultado |
|---|---|---|---|
| 2026-10-23 | `453f1e1` | [39984884953](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/39984884953) | Falha no teste E2E do portal (D6) |
| 2026-10-24 | `366f1f5` | [40098547445](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40098547445) | Verde |
| 2026-10-24 | `d006f39` | [40098813029](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40098813029) | Verde |
| 2026-10-24 | `a9066fe` | [40099053410](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40099053410) | Verde, na `main` |

O registro local anterior, de 2026-10-22 na v1.1.0, tem os mesmos 156 testes ([resultado da última execução](../05-qualidade/02-resultado-da-ultima-execucao.md)).

## Defeitos e análise de causa raiz

| ID | Defeito | Causa raiz | Correção | Regressão |
|---|---|---|---|---|
| D1 | Ids de campos repetidos nas telas com vários formulários iguais | `id` igual ao `name` do campo | `useId()` em cada campo | E2E do detalhe da implantação e axe |
| D2 | Banner de erro repetia a mensagem do campo | Mensagem geral duplicava a do campo | Banner diz "Revise os campos destacados." | [dashboard-and-clients.spec.ts](../../tests/e2e/dashboard-and-clients.spec.ts) |
| D3 | `/clientes` com 53 px de rolagem horizontal em 390 px | Cabeçalho `sr-only` com `position:absolute` escapava do `overflow-x-auto` | `relative` no contêiner da tabela | [responsive.spec.ts](../../tests/e2e/responsive.spec.ts) |
| D4 | Ajuste de prazo sem mudança respondia "Ajuste salvo." | O serviço aceitava um ajuste igual ao valor atual | Recusa com "Nenhuma alteração para salvar" | [deployments.test.ts](../../tests/integration/deployments.test.ts) |
| D5 | `.env.example` com `DIRECT_URL=""` quebrava a migration | `"" ?? x` não cai no valor padrão | `||` na configuração do Prisma e linha comentada | Verificação em clone limpo |
| D6 | Portal com 12 px de rolagem horizontal em 360 px, só na CI | Prazo com "(atrasada)" não quebrava de linha e o título não encolhia; fontes do Linux mais largas | Rótulo em linha própria e `min-w-0` no título (`7de1de4`) | [templates-and-portal.spec.ts](../../tests/e2e/templates-and-portal.spec.ts), com checagem a 300 px |

## D6: a falha da CI de 2026-10-23

| Etapa | Registro |
|---|---|
| Sintoma | Na primeira execução da CI, em 2026-10-23, 33 dos 34 testes E2E passaram; o do portal falhou na checagem de rolagem horizontal (esperado 0 ou menos, recebido 12) |
| Por que não aparecia antes | Os 156 testes já passavam na máquina de desenvolvimento (Windows), com fontes mais estreitas |
| Investigação | O log da CI mostrou o teste e a asserção que falhou. A página do portal foi medida em um contêiner Linux do Playwright, com 20 px de rolagem a 300 px antes da correção |
| Causa | Em `src/app/p/[token]/page.tsx`, o prazo de tarefa atrasada (`até dd/mm/aaaa (atrasada)`) ficava num elemento que não encolhe e não quebra linha, ao lado de um título sem `min-w-0` |
| Correção | Commit `7de1de4`: "(atrasada)" passa a ocupar a linha de baixo e o título pode encolher |
| Verificação | Mesma medição no contêiner Linux: 0 px a 300, 320 e 360 px; suíte completa local passou; CI verde em 2026-10-24 ([run 40098547445](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40098547445)) |
| Critério de aceite afetado | US-13, CA4: a 360 px, tudo legível sem rolagem horizontal |
| Lição | Rodar a CI antes de escrever "CI" nos documentos, como a [retrospectiva final](../07-pos-go-live/retrospectiva-final.md) já apontava |

Registro curto em [execução na CI de 2026-10-24](../05-qualidade/05-execucao-ci-2026-10-24.md).

## Cobertura e limitações da estratégia

- A cobertura de código não foi medida; nenhum percentual é citado.
- A CI roda só Chromium em Linux. Firefox, Safari e celular físico não foram verificados.
- A acessibilidade foi verificada só com as regras automáticas do axe; teclado e leitor de tela ficaram como pendência.
- Desempenho não foi medido (RNF-01 sem teste).
- Os testes de integração não cobrem a fronteira HTTP das Server Actions; ela é coberta pelos E2E.
- O estado vazio do painel está implementado e não tem teste automatizado.

Lista completa em [limitações conhecidas](../05-qualidade/03-limitacoes-conhecidas.md).

## Casos propostos, não executados

Os casos abaixo não existem como teste e não têm resultado.

| Caso | Objetivo |
|---|---|
| Falha no meio da transação de auditoria | Provar que a mudança é desfeita se o registro falhar |
| Navegação por teclado e leitor de tela nas telas principais | Fechar a pendência de acessibilidade manual |
| Portal com muitas requisições seguidas | Documentar o comportamento sem limite de requisições (ADR-007) |
| Painel sem implantações | Cobrir o estado vazio |
| Matriz Firefox e WebKit na CI | Ampliar a cobertura de navegadores |

## Reprodução

Os comandos para rodar os testes estão no [CONTRIBUTING](../../CONTRIBUTING.md).
