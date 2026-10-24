# Trilha

Acompanhamento de implantação de clientes: prazos [D+n](docs/GLOSSARIO.md), painel que separa atraso da equipe de espera do cliente, auditoria e portal por link.

## Em 30 segundos

- **Problema:** uma software house fictícia implanta o sistema nos clientes com planilhas e WhatsApp, e o atraso só aparece quando o cliente liga.
- **Solução:** a Trilha cria a implantação a partir de um modelo, calcula os prazos e mostra o que está atrasado, de quem e há quanto tempo.
- **Prova:** 156 testes (52 unitários, 70 de integração e 34 E2E, dos quais 6 de acessibilidade) e cinco defeitos registrados (D1 a D5), na execução de 2026-10-22: [resultado](docs/05-qualidade/02-resultado-da-ultima-execucao.md).
- **Comece por aqui:** [painel](docs/imagens/02-painel.png) · [change-log do protótipo](docs/04-prototipo/03-change-log.md) (pedidos aceitos e recusados) · [resultado da última execução](docs/05-qualidade/02-resultado-da-ultima-execucao.md).

## Ficha técnica

| Campo | Informação |
|---|---|
| Natureza | Caso fictício: a Rota Fácil Software, as pessoas e os dados são inventados |
| Discovery | Reuniões simuladas, marcadas nas atas ([Episódio 1](docs/01-discovery/README.md)) |
| Stack | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Prisma 7, PostgreSQL, Zod |
| Testes | 156 passando: Vitest (unitários e integração) e Playwright (E2E e axe). Registro de 2026-10-22, versão v1.1.0 (commit `a16b9bf`) |
| Execução | Local, com Node.js 24 e Docker; não hospedado |

## Duas entradas

**Pelo lado do negócio.** [Discovery](docs/01-discovery/README.md): problema, reuniões simuladas e a restrição de custo. [Definição](docs/02-definicao/README.md): requisitos, regras e histórias. [Treinamento e rollout](docs/06-treinamento-e-rollout/README.md): planos de entrada em uso e de volta. [Pós-go-live](docs/07-pos-go-live/README.md): indicadores, evolução e operação.

**Pelo lado técnico.** [Arquitetura](docs/03-arquitetura/README.md): oito decisões registradas, modelo de dados e segurança. [Qualidade](docs/05-qualidade/README.md): estratégia de testes, resultado e defeitos.

Termos e siglas estão no [glossário](docs/GLOSSARIO.md). O [guia da série](docs/INDEX.md) traz trilhas de leitura de 2, 10 e 30 minutos.

<table>
  <tr>
    <td><img src="docs/imagens/02-painel.png" alt="Painel com cartões de implantações em andamento, atrasadas, aguardando cliente e concluídas" width="480"></td>
    <td><img src="docs/imagens/05-detalhe-implantacao.png" alt="Detalhe de uma implantação com progresso, tarefas por etapa e painel do link do cliente" width="480"></td>
  </tr>
  <tr>
    <td><img src="docs/imagens/09-portal-cliente.png" alt="Portal do cliente com progresso e próximas etapas" width="480"></td>
    <td><img src="docs/imagens/04-nova-implantacao.png" alt="Formulário de nova implantação com prévia dos prazos D+n" width="480"></td>
  </tr>
</table>

![Gravação do fluxo: login, painel, nova implantação com prévia dos prazos D+n, detalhe da implantação criada, link do cliente e portal aberto pelo link](docs/imagens/demo-implantacao.gif)

Gravação de cerca de 20 s do fluxo real: login, painel, nova implantação com a prévia dos prazos D+n, detalhe da implantação criada, geração do link do cliente e o portal aberto por esse link. Feita com o app em build local e dados do seed.

Todas as telas, na ordem de uso, estão na [galeria](docs/imagens/README.md).

## O problema

Na Rota Fácil, o fundador descobre atraso quando o cliente liga, e os combinados feitos no WhatsApp se perdem por falta de registro por tarefa. Cada implantação segue um roteiro diferente, porque cada implantador usa a própria planilha. O discovery chegou a sete problemas priorizados, com a evidência de cada um em [problemas priorizados](docs/01-discovery/08-problemas-priorizados.md).

## O que faz

- Modelos de implantação com etapas, tarefas e prazos D+n; a implantação criada recebe uma cópia do modelo.
- Datas reais calculadas a partir do kickoff (reunião de início), com prévia antes de criar.
- Painel com atrasadas (equipe), aguardando cliente, concluídas, filtro por implantador e fila de pendências.
- Histórico de alterações com autor e motivo, gravado na mesma transação da mudança.
- Portal do cliente por link com token: somente leitura, com expiração e revogação. Desde a v1.1.0, exporta o relatório em CSV.

## O que este projeto mostra

- Modelo de implantação com prazos relativos: mudar o modelo não altera o que já foi combinado ([ADR-004](docs/03-arquitetura/adr/004-tarefas-e-prazos-relativos.md)).
- Separação entre atraso da equipe e espera do cliente, no painel e na regra de atraso ([problema P4](docs/01-discovery/08-problemas-priorizados.md)).
- Auditoria gravada na mesma transação, sem alteração sem registro ([ADR-005](docs/03-arquitetura/adr/005-auditoria.md)).

| O que o projeto exercita | Onde está a prova |
|---|---|
| Levantar e priorizar problemas (a partir de reuniões simuladas) | [Problemas priorizados](docs/01-discovery/08-problemas-priorizados.md) |
| Transformar conversa em regra e rastrear até o teste | [Regras de negócio](docs/02-definicao/03-regras-de-negocio.md) · [Rastreabilidade](docs/02-definicao/08-rastreabilidade.md) (32 linhas) |
| Aceitar e recusar pedido com justificativa (reunião simulada) | [Change-log](docs/04-prototipo/03-change-log.md) |
| Controle de acesso e auditoria | [ADR-005](docs/03-arquitetura/adr/005-auditoria.md) · [ADR-006](docs/03-arquitetura/adr/006-controle-de-acesso.md) · [Segurança e privacidade](docs/03-arquitetura/seguranca-e-privacidade.md) |
| Planejar a entrada em uso, o plano de volta e o treinamento (plano, não executado) | [Rollout](docs/06-treinamento-e-rollout/01-plano-de-rollout.md) · [Checklist e plano de volta](docs/06-treinamento-e-rollout/02-checklist-de-entrada-em-uso.md) · [Guia do implantador](docs/06-treinamento-e-rollout/04-guia-treinamento-implantador.md) · [Guia do cliente](docs/06-treinamento-e-rollout/05-guia-rapido-cliente.md) |
| Testar e registrar defeitos | [Resultado da última execução](docs/05-qualidade/02-resultado-da-ultima-execucao.md) (D1 a D5) |

## Decisões que contam

**Reunião 1 (simulada): WhatsApp automático ou portal por link** · [ata](docs/01-discovery/04-reuniao-1-kickoff-fundador.md)

| Campo | Registro |
|---|---|
| Contexto | Custo recorrente máximo de cerca de R$ 100/mês, prazo de cerca de 3 meses e um desenvolvedor (R1-05). O fundador queria mensagem automática no WhatsApp ao fim de cada etapa (R1-06) |
| Alternativas | Mensagem automática pela API oficial do WhatsApp Business, que cobra por conversa e exige aprovação de modelos de mensagem; ou uma página com o andamento sempre atualizado, que o cliente acessa quando quiser |
| Escolha | WhatsApp automático fora do MVP (primeira versão); entra o portal do cliente por link (R1-07) |
| Custo aceito | O cliente não recebe aviso automático. O WhatsApp aparece no [roadmap da v2](docs/07-pos-go-live/roadmap.md), com o custo por conversa e a aprovação de modelos como motivo |

**Portal por token** · [ADR-007](docs/03-arquitetura/adr/007-portal-por-token.md)

| Campo | Registro |
|---|---|
| Contexto | O cliente não cria conta, abre pelo celular e pode encaminhar o link (R3-05, R3-06) |
| Alternativas | Login para o cliente; JWT assinado no link; código curto com dado pessoal; token aleatório opaco guardado como hash |
| Escolha | Token de 32 bytes aleatórios; no banco, só o SHA-256. Validade padrão de 60 dias, revogável, um link ativo por implantação, somente leitura |
| Custo aceito | Quem recebe o link acessa o conteúdo: é "link secreto", não autenticação. Não há limite de requisições no MVP |
| Quando mudaria | Se o portal passasse a mostrar dados financeiros ou documentos, exigiria um segundo fator (código por e-mail) |

## Episódios

| # | Episódio | O que há ali |
|---|---|---|
| 0 | [Sobre o projeto](docs/00-sobre-o-projeto/README.md) | Cenário e ordem de leitura |
| 1 | [Discovery](docs/01-discovery/README.md) | Brainstorm, empresa, personas, três reuniões simuladas, AS-IS, problemas |
| 2 | [Definição](docs/02-definicao/README.md) | 20 RF, 12 RNF, 18 RN, 14 US, 8 riscos, rastreabilidade, 3 sprints |
| 3 | [Arquitetura](docs/03-arquitetura/README.md) | ADR-001 a ADR-008, componentes, modelo de dados, segurança |
| 4 | [Protótipo](docs/04-prototipo/README.md) | Wireframes, reunião 4 e change-log |
| 5 | [Qualidade](docs/05-qualidade/README.md) | Estratégia, resultado da execução, limitações, UAT |
| 6 | [Treinamento e rollout](docs/06-treinamento-e-rollout/README.md) | Planos e guias, todos sem execução |
| 7 | [Pós-go-live](docs/07-pos-go-live/README.md) | Indicadores, v1.1.0, retrospectiva, roadmap, runbook |

Apoio: [guia da série](docs/INDEX.md) · [galeria de telas](docs/imagens/README.md) · [glossário](docs/GLOSSARIO.md) · [CHANGELOG](CHANGELOG.md).

## Evidências

Execução local de 2026-10-22, versão v1.1.0 (commit `a16b9bf`), com `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` e `npx playwright test`. Detalhes, ambiente e histórico de falhas estão no [resultado da última execução](docs/05-qualidade/02-resultado-da-ultima-execucao.md).

| Verificação | Resultado |
|---|---|
| Lint e tipos | sem erros |
| Testes unitários | 52 passaram |
| Testes de integração (PostgreSQL real) | 70 passaram |
| Testes E2E (Chromium, inclui 6 de acessibilidade com axe) | 34 passaram |
| **Total** | **156 testes passando** |
| Build | compilou |
| Defeitos registrados | 5 (D1 a D5), corrigidos |

## Do protótipo à produção

O que falta para sair do estudo:

- Não está hospedado: roda só localmente ([limitações](docs/05-qualidade/03-limitacoes-conhecidas.md)).
- O CI (rotina automática de lint, tipos, testes e build) rodou uma vez no GitHub, em 2026-10-23, no commit `453f1e1`, e falhou na etapa de testes E2E; lint, tipos, testes unitários, de integração e build passaram ([execução](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/39984884953)). A causa ainda não foi investigada.
- A cobertura de código não foi medida ([limitações](docs/05-qualidade/03-limitacoes-conhecidas.md)).
- Rollout, plano de volta e treinamento são planos, não executados ([rollout](docs/06-treinamento-e-rollout/01-plano-de-rollout.md)).
- Os indicadores são hipóteses, sem resultado medido ([indicadores](docs/07-pos-go-live/indicadores.md)).
- Não houve piloto real: a [retrospectiva](docs/07-pos-go-live/reuniao-6-retrospectiva.md) é simulada e o [roadmap](docs/07-pos-go-live/roadmap.md) não tem datas.

## Rodar localmente

Pré-requisitos: Node.js 24 e Docker.

```bash
npm install
cp .env.example .env     # os valores padrão já servem para o ambiente local
npm run setup            # sobe o PostgreSQL (Docker), aplica as migrations e carrega os dados de exemplo
npm run dev              # http://localhost:3000
```

Contas de demonstração criadas pelo seed (dados fictícios, só para uso local):

| Papel | E-mail | Senha |
|---|---|---|
| Administrador | `admin@rotafacil.example` | `Admin-Trilha-2026` |
| Implantador | `implantador@rotafacil.example` | `Usuario-Trilha-2026` |

O link do cliente é gerado dentro de uma implantação, no botão "Gerar link do cliente".

```bash
npm run lint && npm run typecheck && npm test   # unitários e integração (cria o banco trilha_test)
npm run build && npx playwright install chromium && npx playwright test   # E2E (cria o banco trilha_e2e)
npm run screenshots                              # regenera docs/imagens
```

## Limites

- Não está hospedado: a execução é local.
- O CI falhou na etapa E2E na única execução no GitHub ([execução](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/39984884953)); o registro de 156 testes vem de execuções locais.
- A cobertura de código não foi medida.
- O feedback do piloto é simulado: não houve piloto real nem resultado medido.

## Licença

[MIT](LICENSE).
