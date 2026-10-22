# Entrevista: Fase 10 (README e vitrine)

**Objetivo:** preparar respostas sobre como apresento o projeto.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [README](../../README.md) · [Vitrine](../vitrine/)

### 1. Por que o aviso de "caso simulado" está no topo do README?
Porque quem lê em três minutos precisa saber logo o que é real. Se descobrisse sozinho que as reuniões eram roteirizadas, desconfiaria do resto. Com o aviso, o foco vai para o que dá para verificar: o código, as decisões, os testes e os documentos. Também só cito números que saíram do meu terminal e deixo explícito o que não foi feito (CI no GitHub, cobertura, publicação).

### 2. Por que deixou em branco a parte que conecta o projeto à sua experiência?
Porque essa parte tem de ser verdadeira e só eu sei o que é. Um projeto de portfólio vale mais quando o que ele demonstra está separado do que eu já fiz de verdade. Separar os dois evita que alguém tome um caso simulado por experiência profissional.

### 3. Como você garantiu que o passo a passo do README funciona?
Conferi cada comando contra o código e, ao fazer isso, encontrei um defeito real: o `.env.example` trazia uma variável vazia que quebrava a migration. Reproduzi o erro, corrigi e depois validei seguindo os passos em um clone limpo do repositório. Documentar sem executar é a forma mais fácil de publicar instruções que não funcionam.
