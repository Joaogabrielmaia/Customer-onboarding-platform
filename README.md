# Trilha

Acompanhamento de implantação de clientes: modelos com prazos D+n, painel que separa atraso da equipe de espera do cliente, auditoria na mesma transação e portal por link.

## O problema

Cenário fictício: a Rota Fácil Software, software house de cerca de 12 pessoas, implanta o sistema nos clientes com planilhas e WhatsApp.
O fundador descobre o atraso quando o cliente liga, e os combinados feitos no WhatsApp se perdem. Cada implantador segue um roteiro próprio, na própria planilha.
O discovery chegou a sete problemas priorizados, cada um com a evidência da fala que o originou: [problemas priorizados](docs/01-discovery/08-problemas-priorizados.md).

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

Guia da série: [índice e trilhas de leitura](docs/INDEX.md) · [galeria com 14 telas](docs/imagens/README.md) · [glossário](docs/GLOSSARIO.md).

## Ficha técnica

| Campo | Informação |
|---|---|
| Natureza | Estudo de caso fictício |
| Stack | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Prisma 7, PostgreSQL, Zod |
| Testes | 156 passando (Vitest e Playwright) na CI em 2026-10-24, commit `a9066fe`, [run 40099053410](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40099053410) |

## O que construí

- Modelei a implantação como uma cópia do modelo, com prazos D+n contados a partir do kickoff; mudar o modelo depois não altera o que já foi combinado ([ADR-004](docs/03-arquitetura/adr/004-tarefas-e-prazos-relativos.md), prévia dos prazos em [nova implantação](docs/imagens/04-nova-implantacao.png)).
- Implementei o painel que separa atraso da equipe de espera do cliente, com filtro por implantador e fila de pendências ([painel](docs/imagens/02-painel.png)).
- Construí o portal do cliente por token opaco: 32 bytes aleatórios, só o SHA-256 no banco, somente leitura, com expiração e revogação ([ADR-007](docs/03-arquitetura/adr/007-portal-por-token.md)).
- Gravei a auditoria na mesma transação da mudança, para não existir alteração sem registro ([ADR-005](docs/03-arquitetura/adr/005-auditoria.md), [histórico](docs/imagens/06-historico.png)).
- Conduzi a validação do protótipo e registrei três pedidos aceitos, um recusado e quatro adiados; o filtro por implantador subiu para Must ([change-log](docs/04-prototipo/03-change-log.md)).

## Competência → prova

| O que o projeto exercita | Onde está a prova |
|---|---|
| Modelagem de domínio | [Modelo de dados](docs/03-arquitetura/modelo-de-dados.md) |
| Controle de acesso e auditoria | [ADR-005](docs/03-arquitetura/adr/005-auditoria.md) · [ADR-006](docs/03-arquitetura/adr/006-controle-de-acesso.md) |
| Planejar a entrada em uso, com status declarado (plano, não executado) | [Treinamento e rollout](docs/06-treinamento-e-rollout/README.md) |
| Transformar pedido de validação em escopo (reunião simulada) | [Change-log](docs/04-prototipo/03-change-log.md) |
| Testar e registrar defeitos (D1 a D6) | [Resultado da execução](docs/05-qualidade/02-resultado-da-ultima-execucao.md) · [CI](docs/05-qualidade/05-execucao-ci-2026-10-24.md) |
| Interface com verificação de acessibilidade: 34 testes E2E, 6 deles com axe | [Estratégia de testes](docs/05-qualidade/01-estrategia-de-testes.md) |
| Documentar decisões: 8 ADRs | [Arquitetura](docs/03-arquitetura/README.md) |

## Decisão difícil

O teto de cerca de R$ 100/mês, na [reunião 1](docs/01-discovery/04-reuniao-1-kickoff-fundador.md) (simulada), tirou o WhatsApp automático do MVP e colocou o portal por link.

| Campo | Registro |
|---|---|
| Contexto | Custo recorrente máximo de cerca de R$ 100/mês, prazo de cerca de 3 meses e um desenvolvedor. O fundador queria mensagem automática no WhatsApp ao fim de cada etapa (R1-05, R1-06) |
| Alternativas | API oficial do WhatsApp Business, que cobra por conversa e exige aprovação de modelos de mensagem; ou uma página com o andamento, que o cliente acessa quando quiser. Para o portal: login, JWT no link, código curto com dado pessoal ou token opaco com hash ([ADR-007](docs/03-arquitetura/adr/007-portal-por-token.md)) |
| Escolha | WhatsApp automático fora do MVP; portal por link, com token de 32 bytes, só o SHA-256 no banco, validade padrão de 60 dias, somente leitura (R1-07) |
| Custo aceito | O cliente não recebe aviso automático, e quem tem o link acessa o conteúdo: é link secreto, não autenticação. O WhatsApp fica no [roadmap](docs/07-pos-go-live/roadmap.md) |
| Quando mudaria | Se o portal passasse a mostrar dados financeiros ou documentos, exigiria um segundo fator (código por e-mail) |

## Evidências

- 156 testes na CI em 2026-10-24: 52 unitários, 70 de integração e 34 E2E (6 de acessibilidade). Commit `a9066fe`, [run 40099053410](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/40099053410), verde. [Registro](docs/05-qualidade/05-execucao-ci-2026-10-24.md).
- Seis defeitos (D1 a D6) com causa, correção e a verificação de cada um. A CI achou o D6 na primeira execução, em 2026-10-23, commit `453f1e1` ([run 39984884953](https://github.com/Joaogabrielmaia/Customer-onboarding-platform/actions/runs/39984884953)). [Registro](docs/05-qualidade/02-resultado-da-ultima-execucao.md).
- Registro local anterior: 156 testes em 2026-10-22, v1.1.0, commit `a16b9bf`, no mesmo arquivo.
- 8 ADRs e rastreabilidade de 32 linhas, de requisito a história, teste e tela: [arquitetura](docs/03-arquitetura/README.md) · [rastreabilidade](docs/02-definicao/08-rastreabilidade.md).
- 14 prints na [galeria](docs/imagens/README.md) e uma gravação de 20 s do fluxo real: [demo-implantacao.gif](docs/imagens/demo-implantacao.gif).

## Limites

- Nenhum cliente real usou o sistema: a empresa, as pessoas e os dados são fictícios, e as reuniões são simuladas.
- A cobertura de código não foi medida.
- Firefox, Safari, celular físico, desempenho e acessibilidade manual não foram verificados; a CI roda só Chromium em Linux ([limitações](docs/05-qualidade/03-limitacoes-conhecidas.md)).
- Rollout, plano de volta e treinamento são planos, não executados; os indicadores são hipóteses, sem resultado medido.

## Evolução prevista

- v1.2: avisos e menos cliques, segundo o [roadmap](docs/07-pos-go-live/roadmap.md).
- v2: dependência entre tarefas e confirmação "já enviei" no portal.

## Licença

[MIT](LICENSE). O código roda localmente; instruções no [CONTRIBUTING.md](CONTRIBUTING.md).
