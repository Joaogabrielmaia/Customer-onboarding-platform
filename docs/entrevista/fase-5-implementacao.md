# Entrevista: Fase 5 (implementação)

**Objetivo:** preparar respostas sobre como construí o sistema e por quê.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Sprints](../02-definicao/sprint-1-review.md) · [ADR-009](../03-arquitetura/adr/009-camada-de-servicos.md)

### 1. Como o código está organizado e por que assim?
Em três camadas. `domain` tem as regras puras (prazo, atraso, progresso, permissões, token), sem banco nem Next, então testo rápido e com casos de borda. `server/services` tem um caso de uso por função: valida com Zod, checa permissão, abre transação, grava e audita. `app` tem as páginas e as Server Actions, que só autenticam, chamam o serviço e mostram o erro. O ganho é eu conseguir explicar cada regra isolada e provar com teste. O custo é uma camada a mais para um sistema pequeno; compensa porque a autorização e a auditoria nunca ficam esquecidas na tela.

### 2. Como você calcula os prazos e por que tratou datas de um jeito especial?
O prazo é `kickoff + n dias corridos`, e se cair no fim de semana vai para segunda. Uso "data civil": um `Date` em 00:00 UTC e colunas `DATE` no banco, sem hora. Se usasse timestamp, um prazo "05/03" poderia virar 04/03 dependendo do fuso. Só em `todayCivil` converto o "agora" para o dia de São Paulo. Testei fim de semana, virada de ano e ano bissexto. Não considero feriados; está no roadmap.

### 3. Qual foi um problema real que você encontrou e como resolveu?
O `/clientes` rolava para o lado no celular, 53 px a 390 px de largura. Achei olhando a tela pequena. Investiguei os elementos que passavam da largura e vi que era o cabeçalho de tabela `sr-only`: ele é `position:absolute` e, sem ancestral posicionado, escapava do `overflow-x-auto`. Pus `relative` no contêiner e criei um teste que percorre 11 telas em 390 px, para não voltar. O aprendizado: teste automatizado só cobre o que pensei em testar; a exploração manual achou o que eu não previ.
