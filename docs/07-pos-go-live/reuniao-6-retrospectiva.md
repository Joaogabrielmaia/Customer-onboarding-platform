# Reunião 6: retrospectiva e feedback do piloto

**Objetivo:** ouvir a equipe depois do piloto e sair com três melhorias priorizadas.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Ricardo Almeida (fundador), Camila Tavares (líder de implantação), Diego Ferreira (implantador-piloto) e eu
Relacionados: [Plano de rollout](../06-deploy-e-go-live/01-plano-de-rollout.md) · [Indicadores](indicadores.md) · [Roadmap](roadmap.md) · [Changelog](../../CHANGELOG.md)

> Reunião simulada (roteirizada por mim para este caso de portfólio). Pessoas e empresa fictícias.
>
> **Aviso importante:** não houve piloto real. O feedback abaixo é **roteirizado** a partir do que o sistema de fato faz e dos limites que conheço. Ninguém mediu economia de tempo nem redução de atrasos, e não digo que mediu.

## Formato

Retrospectiva em três perguntas: o que funcionou, o que atrapalhou, o que falta. Cada pessoa falou, e eu agrupei.

## O que funcionou

- **Camila:** "Na segunda eu abri o painel em vez de ligar para cada um. A separação entre atraso nosso e atraso do cliente evitou discussão." *(Está ligada à hipótese H1; **não** é medição.)*
- **Diego:** "Escrever o combinado como comentário me deu onde consultar depois. A mensagem pronta do link poupou digitação."
- **Ricardo:** "Gostei de ver o portal do cliente. Ele abriu pelo celular sem pedir ajuda."

## O que atrapalhou

- **Diego:** "Para fechar cinco tarefas seguidas eu clico cinco vezes em cinco listas. É chato quando estou atualizando no fim do dia."
- **Camila:** "Eu preciso levar a situação de uma implantação para uma reunião com o cliente. Hoje eu tiro print."
- **Ricardo:** "O painel mostra o atraso, mas só vejo se abrir. Eu queria ser avisado."

## O que falta

- Notificação ativa de atraso (e-mail).
- Um relatório que eu possa baixar e abrir no Excel.
- Dependência entre tarefas (a Camila voltou ao tema), e feriados.

## Melhorias priorizadas

Critério: **impacto** na dor relatada, **esforço**, **risco** e se cabe sem infraestrutura nova.

| # | Melhoria | Quem pediu | Impacto | Esforço | Risco | Decisão |
|---|---|---|:-:|:-:|:-:|---|
| 1 | **Exportar o relatório da implantação em CSV** (e a lista de implantações) | Camila, Ricardo | Alto | Baixo | Baixo (atenção a injeção de fórmula) | **Implementada na v1.1.0** |
| 2 | **Alerta de atraso por e-mail** | Ricardo | Alto | Médio-alto (domínio, entregabilidade, preferências) | Médio | v1.2, começando por e-mail |
| 3 | **Concluir várias tarefas de uma vez** | Diego | Médio | Baixo-médio | Baixo (auditoria por tarefa) | v1.2 |

**Por que a exportação foi a primeira:** resolve uma dor real da líder e do fundador, é barata, não exige infraestrutura nova e não altera o modelo de dados. O alerta por e-mail tem mais impacto, mas depende de decisões que não cabem agora (provedor de e-mail, remetente verificado, descadastro). **Registro isso como adiamento consciente.**

**Por que escolhi CSV e não PDF:** CSV abre no Excel, é simples de gerar e testar. PDF exigiria layout e uma dependência de geração; fica no roadmap se o cliente pedir.

## O que ficou de fora (e por quê)

| Pedido | Por que não agora |
|---|---|
| Dependência entre tarefas | Exige recálculo em cadeia (CH-06); continua na v2 |
| Calendário semanal | A fila de pendências cobre parte (CH-08) |
| Feriados no prazo | Precisa de calendário por região |
| Notificação por WhatsApp | Custo recorrente (R1-05) |
