# Entrevista: Fase 4 (protótipo e validação)

**Objetivo:** preparar respostas sobre como validei o desenho antes de construir.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Protótipo](../04-prototipo/) · [Change-log](../04-prototipo/03-change-log.md)

> As reuniões são simuladas, roteirizadas por mim.

### 1. Por que desenhar antes de codar?
Porque mudar um desenho custa minutos e mudar uma tela pronta custa horas e retrabalho de teste. Os wireframes me deram algo concreto para o fundador reagir, e três dos pedidos (filtro por implantador, dias de atraso em destaque, mensagem pronta com o link) só apareceram porque ele viu a tela. Sem desenho, teriam aparecido depois do código pronto.

### 2. Cite um pedido que você recusou e como conduziu a conversa.
O fundador pediu que o cliente marcasse a tarefa como entregue no portal. Eu recusei porque o portal é um link sem login: se for encaminhado, qualquer pessoa alteraria o andamento que o fundador usa para decidir, e o histórico perderia o autor. Não disse só "não": expliquei o risco em termos do que ele perde (dado confiável), propus a alternativa (o implantador marca) e deixei um caminho para v2 (botão "já enviei" com confirmação por e-mail). Documentei no change-log.

### 3. Como as mudanças aceitas afetaram o escopo, e como você evitou escopo crescer sem controle?
Cada pedido virou uma linha no change-log com decisão e impacto. Das oito, aceitei três de baixo custo (um deles subiu o filtro do painel de Should para Must) e adiei ou recusei o resto. O critério foi: resolve a dor principal (atraso visível) e cabe no orçamento e prazo? Se não, vai para o roadmap com motivo. Isso evita que a reunião de validação vire uma segunda fase de descoberta sem fim.
