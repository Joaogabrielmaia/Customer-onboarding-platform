# Entrevista: Fase 8 (go-live e treinamento)

**Objetivo:** preparar respostas sobre como eu conduziria a entrada em uso.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Go-live](../06-deploy-e-go-live/) · [Plano de rollout](../06-deploy-e-go-live/01-plano-de-rollout.md)

> É um plano para um cenário simulado. Em entrevista, deixo claro que não executei com clientes reais.

### 1. Por que um piloto com uma implantação e não lançar para todos?
O maior risco não é técnico: é a equipe não preencher. Com uma implantação e um implantador, o custo de errar é pequeno e eu consigo observar o que a pessoa faz de verdade. No piloto a planilha continua em paralelo só naquele cliente, então voltar atrás não perde controle. Só amplio se houver critério: o implantador atualizou sem ajuda constante, o cliente abriu o link e a líder viu o atraso no painel sem perguntar. Esses critérios são metas que eu mediria, não resultados.

### 2. Quando você faria rollback e como?
Em perda ou corrupção de dados, falha de autorização, vazamento de link que não dê para conter, ou indisponibilidade que a equipe não consiga contornar. O caminho depende da causa: bug de código, promoção do deploy anterior na Vercel; migration ruim, migration corretiva ou restauração de backup; link vazado, revogar na tela; sistema inviável, voltar à planilha e deixar a Trilha só para leitura. Registro o que aconteceu antes de tentar de novo.

### 3. Como você treinou o usuário e por que o guia é assim?
O guia segue a ordem do dia do implantador (entrar, ler o painel, cadastrar, conduzir tarefas, histórico, pendências, link do cliente) e tem uma regra de ouro: combinou com o cliente, escreva como comentário. Fecha com um exercício de 10 minutos. Para o cliente fiz um guia de uma página com o print do portal, focado em "o que depende de você". Usei prints reais gerados pelo Playwright, para o guia não ficar desatualizado em relação ao sistema.
