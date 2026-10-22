# Entrevista: Fase 9 (pós go-live)

**Objetivo:** preparar respostas sobre manutenção, evolução e aprendizado depois do lançamento.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Pós go-live](../07-pos-go-live/) · [Changelog](../../CHANGELOG.md)

### 1. Como você escolheu qual melhoria implementar na v1.1?
Pela dor relatada, o esforço, o risco e se cabia sem infraestrutura nova. A exportação em CSV resolvia um pedido da líder e do fundador, custava pouco e não mexia no modelo de dados. O alerta por e-mail tinha mais impacto, mas depende de provedor, remetente verificado e descadastro; registrei como adiamento consciente para a v1.2. Escolhi CSV e não PDF porque abre no Excel e é simples de testar.

### 2. Que cuidado de segurança exigiu a exportação?
Injeção de fórmula. Os títulos de tarefa e os nomes são digitados por usuários e, se alguém escrever `=HYPERLINK(...)`, o Excel interpreta como fórmula ao abrir o arquivo. Prefixo um apóstrofo em qualquer texto que comece com `=`, `+`, `-`, `@` ou tab, e testei isso em unidade e em integração. Também não incluí comentários nem histórico no arquivo, porque ele pode ser encaminhado, e a rota devolve 401 sem sessão.

### 3. Como você mede se a Trilha deu certo, sem inventar resultado?
Não digo que deu certo. Defini indicadores propostos ligados às hipóteses da visão, cada um com a pergunta que responde, a origem do dado e a armadilha, e sempre com o tamanho da amostra ao lado. Sem linha de base do cliente real não faz sentido prometer percentual de melhoria. O que eu afirmo são fatos do projeto: o que foi construído e o resultado real dos testes.
