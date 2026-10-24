# Da planilha ao portal do cliente: guia da série

**Objetivo:** mostrar como uma implantação de software foi entendida, desenhada, testada e preparada para entrar em uso, em sete episódios.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [README](../README.md) · [Glossário](GLOSSARIO.md) · [Galeria de telas](imagens/README.md)

A Trilha é um sistema de acompanhamento de implantação de clientes. O caso é fictício: a Rota Fácil Software, as pessoas e os dados foram inventados. O valor da série está em três pontos: separar atraso da equipe de espera do cliente, calcular prazos D+n a partir do kickoff e dar ao cliente um portal por link, com planos de rollout que declaram o próprio status. Siglas e termos estão no [glossário](GLOSSARIO.md).

## Episódios

| # | Episódio | Pergunta que responde | Pasta |
|---|---|---|---|
| 0 | [Sobre o projeto](00-sobre-o-projeto/README.md) | Qual é o cenário e em que ordem ler? | `00-sobre-o-projeto` |
| 1 | [Discovery](01-discovery/README.md) | Qual era o problema e o que a restrição de custo mudou? | `01-discovery` |
| 2 | [Definição](02-definicao/README.md) | O que o sistema deve fazer, com quais regras e em que ordem? | `02-definicao` |
| 3 | [Arquitetura](03-arquitetura/README.md) | Que decisões técnicas sustentam o produto? | `03-arquitetura` |
| 4 | [Protótipo](04-prototipo/README.md) | O que mudou depois de mostrar as telas? | `04-prototipo` |
| 5 | [Qualidade](05-qualidade/README.md) | O que foi testado, o que falhou e o que não foi verificado? | `05-qualidade` |
| 6 | [Treinamento e rollout](06-treinamento-e-rollout/README.md) | Como a equipe passaria a usar o sistema? | `06-treinamento-e-rollout` |
| 7 | [Pós-go-live](07-pos-go-live/README.md) | Como acompanhar, operar e evoluir depois? | `07-pos-go-live` |

## Trilhas de leitura

### Em 2 minutos

1. [README](../README.md)
2. [Painel](imagens/02-painel.png)
3. [Portal do cliente](imagens/09-portal-cliente.png)
4. [ADR-007: portal por token](03-arquitetura/adr/007-portal-por-token.md)

### Em 10 minutos

1. [README](../README.md)
2. [Painel](imagens/02-painel.png)
3. [Portal do cliente](imagens/09-portal-cliente.png)
4. [ADR-007: portal por token](03-arquitetura/adr/007-portal-por-token.md)
5. [Reunião 1: WhatsApp cortado pelo teto de R$ 100/mês](01-discovery/04-reuniao-1-kickoff-fundador.md)
6. [Change-log do protótipo: pedidos aceitos e recusados](04-prototipo/03-change-log.md)
7. [Defeitos D1 a D5](05-qualidade/02-resultado-da-ultima-execucao.md#defeitos-reais-encontrados-e-corrigidos)

### Em 30 minutos

1. Os sete itens da trilha de 10 minutos.
2. [Regras de negócio](02-definicao/03-regras-de-negocio.md)
3. [Matriz de rastreabilidade](02-definicao/08-rastreabilidade.md)
4. [Plano de rollout](06-treinamento-e-rollout/01-plano-de-rollout.md)
5. [Checklist de entrada em uso e plano de volta](06-treinamento-e-rollout/02-checklist-de-entrada-em-uso.md)
6. [Runbook](07-pos-go-live/runbook.md)

## Convenções

- Todo documento tem cabeçalho com objetivo, data e status, e links para os relacionados.
- Reuniões e validações são simuladas e levam essa marcação na primeira linha.
- Números de ganho aparecem só como hipótese ou meta. Resultados de teste citam data e versão do registro.
