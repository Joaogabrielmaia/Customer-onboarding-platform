# Entrevista: Fase 1 (discovery)

**Objetivo:** preparar respostas sobre como descobri o problema.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Discovery](../01-discovery/) · [Problemas priorizados](../01-discovery/08-problemas-priorizados.md)

> Lembrete: as reuniões são simuladas, roteirizadas por mim. Em entrevista, eu digo isso logo no início.

### 1. O fundador pediu "um painel bonito". Como você transformou isso em requisito?
Perguntei qual decisão ele tomaria ao ver o painel. A resposta foi "ligaria pro implantador das atrasadas", o que gerou o requisito concreto: listar atrasadas, o responsável e há quanto tempo. Quando alguém pede uma solução ou um adjetivo ("bonito", "simples"), eu volto para a decisão ou o comportamento que ele quer mudar. É o que evita construir algo que ninguém usa.

### 2. Dois stakeholders pediram coisas opostas (simples x muito detalhe). Como você decidiu?
Em vez de escolher um lado, perguntei: "se só pudesse entregar três campos por tarefa, quais seriam?". O próprio implantador respondeu com responsável, prazo e status. Registrei a contradição, entreguei o mínimo que ambos aceitaram e mandei subtarefas, anexos e campos personalizados para o roadmap. O risco que aceito é o implantador achar o MVP raso; mitigo mostrando o plano de evolução e validando no protótipo (Fase 4).

### 3. Qual restrição mais mudou o escopo e como você lidou com ela?
Duas. O orçamento de cerca de R$ 100/mês inviabilizou o WhatsApp automático, porque a API oficial cobra por conversa e exige aprovação de modelos. Troquei por um portal do cliente com link, que resolve a necessidade (o cliente saber o andamento) sem custo recorrente. A segunda foi o cliente não querer criar conta, o que levou ao acesso por token, com os cuidados de segurança que isso exige. Em ambos os casos, ataquei a necessidade por trás do pedido e não o pedido literal.
