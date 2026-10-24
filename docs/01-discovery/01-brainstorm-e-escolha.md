# Brainstorm de ideias e escolha do produto

**Objetivo:** mostrar as ideias que considerei para a Rota Fácil Software e por que escolhi o onboarding/implantação.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Empresa fictícia](02-empresa-rota-facil.md) · [Problemas priorizados](08-problemas-priorizados.md) · [Visão do produto (Fase 2)](../02-definicao/)

> Esta avaliação é minha, feita a partir do cenário fictício da empresa. As notas são julgamentos, não medições.

## Contexto

A Rota Fácil Software é uma software house pequena (cerca de 12 pessoas) que vende um sistema de gestão para pequenas distribuidoras. O cenário que montei: a empresa cresce vendendo, mas cada nova venda vira uma implantação conduzida em planilha, WhatsApp e e-mail. A pergunta do brainstorm foi: **com orçamento baixo e poucos desenvolvedores, qual ferramenta interna dá o maior retorno?**

## As 5 ideias

| # | Ideia | O que resolve |
|---|---|---|
| 1 | **Plataforma de onboarding/implantação** | Etapas, prazos, responsáveis e progresso de cada implantação, com visão para o cliente |
| 2 | Portal de chamados | Centraliza pedidos de suporte hoje espalhados no WhatsApp |
| 3 | Base de conhecimento | Tutoriais e respostas para reduzir perguntas repetidas |
| 4 | Painel de saúde do cliente | Sinais de risco de cancelamento (uso, chamados, atrasos) |
| 5 | Automação de cobrança | Lembretes e conciliação de mensalidades |

## Matriz de avaliação

Escala de 1 a 5. Em **impacto** e **aderência**, quanto maior, melhor. Em **esforço** e **risco**, quanto maior, pior. A pontuação final é `impacto + aderência − esforço − risco`, só para ordenar; não é um cálculo científico.

| Ideia | Impacto | Esforço | Risco | Aderência ao problema | Pontuação |
|---|:-:|:-:|:-:|:-:|:-:|
| 1. Onboarding/implantação | 5 | 3 | 2 | 5 | **5** |
| 2. Portal de chamados | 4 | 3 | 2 | 3 | 2 |
| 3. Base de conhecimento | 3 | 2 | 1 | 3 | 3 |
| 4. Painel de saúde do cliente | 4 | 5 | 4 | 2 | −3 |
| 5. Automação de cobrança | 3 | 4 | 5 | 1 | −5 |

**Por que cada nota, em uma linha:**

- **Onboarding:** a implantação é onde a empresa gasta mais horas de gente cara e onde o cliente forma a primeira impressão. Esforço médio porque o modelo de dados (modelos, etapas, prazos relativos) tem alguma sutileza. Risco baixo: é ferramenta interna, sem integração obrigatória.
- **Chamados:** dor real, mas já existem ferramentas prontas e baratas; construir é reinventar. Só vira prioridade depois que as implantações estiverem sob controle.
- **Base de conhecimento:** barata e útil, mas não ataca o gargalo. Pode ser feita com um wiki comum.
- **Saúde do cliente:** exige dados de uso que a empresa ainda não coleta. Esforço e risco altos.
- **Cobrança:** envolve dinheiro, bancos e compliance. Risco alto e longe da dor principal.

## Decisão

**Escolhi a ideia 1: plataforma de onboarding/implantação (Trilha).**

- **Por que:** é a melhor combinação de impacto e aderência com risco baixo, e é onde a dor aparece em todas as pessoas que entrevistei no cenário (ver [problemas](08-problemas-priorizados.md)).
- **O que perdi:** não ataco chamados nem saúde do cliente. Se a implantação melhorar mas o suporte continuar caótico, o cliente ainda sente dor depois do go-live.
- **Quando eu mudaria de ideia:** se o discovery mostrasse que o atraso vem de falta de suporte pós-venda e não da implantação em si, eu voltaria à ideia 2. O discovery (reuniões 1 a 3) serviu justamente para testar essa hipótese.
