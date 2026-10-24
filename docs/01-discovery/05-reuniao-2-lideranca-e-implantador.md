# Reunião 2: líder de implantação e implantador

**Objetivo:** entender como a implantação funciona hoje, onde atrasa e o que se perde.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Camila Tavares (líder de implantação), Diego Ferreira (implantador) e eu
Relacionados: [Reunião 1](04-reuniao-1-kickoff-fundador.md) · [Reunião 3](06-reuniao-3-suporte-e-cliente.md) · [Processo AS-IS](07-processo-as-is.md)

> Reunião simulada; pessoas e empresa fictícias.

## Transcrição (trechos principais)

**João:** Camila, Diego, me levem pela última implantação do começo ao fim, como se eu fosse o novo implantador.

**Camila:** A gente começa com o kickoff, depois pede os dados: lista de produtos, clientes, tabela de preço. Depois importa, parametriza a parte fiscal, treina e acompanha a primeira semana.

**Diego:** Só que cada um monta a planilha do seu jeito. A minha tem 14 linhas, a do outro colega tem 30. [R2-01]

**Camila:** E eu queria que tivesse sempre as mesmas etapas. Toda implantação com as mesmas obrigatórias. Hoje eu descubro que alguém esqueceu de treinar o financeiro só no pós-venda. [R2-02]

**João:** Onde costuma atrasar?

**Diego:** Quase sempre nos dados do cliente. Peço a planilha de produtos e ela chega três semanas depois, bagunçada. [R2-03] Segundo lugar é a agenda de treinamento, porque o dono do cliente é quem opera e tem hora marcada com fornecedor.

**Camila:** E a parametrização fiscal, que depende do contador do cliente. [R2-04]

**João:** E o que se perde pelo caminho?

**Diego:** O que a gente combina no WhatsApp. "Ah, a gente deixa o módulo de entregas pra depois" e isso fica solto numa conversa. Meses depois o cliente diz que não foi combinado. [R2-05]

**João:** Se você tivesse que registrar isso, onde seria o lugar natural?

**Diego:** Num comentário na tarefa, com data e quem escreveu. Eu mesmo ia gostar de ter, pra me defender.

> **Por que perguntei assim:** perguntei onde seria o lugar natural em vez de propor o recurso, para não induzir. A resposta justifica comentários + histórico de alterações.

**João:** O Ricardo pediu algo simples, um painel. O que vocês precisam além disso?

**Diego:** Eu preciso de muito detalhe. Subtarefas, anexos, campos personalizados, prioridade, tempo gasto... [R2-06]

**Camila:** Calma, Diego. Se o sistema ficar pesado, ninguém preenche. [R2-07]

**Diego:** Mas se não tiver detalhe, vira só mais um check bonitinho.

**João:** Vamos separar. Se eu só pudesse entregar três campos por tarefa, quais seriam?

**Diego:** Responsável, prazo e status. E um comentário.

**Camila:** E se é obrigatória ou não. Isso eu quero.

> **Contradição registrada:** o fundador quer simples (R1), o implantador quer muito detalhe (R2-06) e a líder quer simples para garantir preenchimento (R2-07). **Decisão:** MVP com responsável, prazo, status, obrigatoriedade e comentários. Subtarefas, anexos, campos personalizados e tempo gasto vão para o roadmap.

**João:** Hoje os prazos são datas fixas na planilha?

**Diego:** Eu calculo de cabeça: "treinamento até 10 dias depois do kickoff". Aí a data do kickoff muda e eu tenho que refazer tudo. [R2-08]

**João:** Então o prazo relativo ao kickoff resolve?

**Diego:** Resolve. Mas às vezes o prazo depende de outra tarefa, tipo "3 dias depois de receber os dados".

**João:** Esse caso é comum?

**Diego:** Umas três ou quatro tarefas por implantação.

**João:** Para a primeira versão, proponho prazo relativo só ao kickoff e permitir ajustar a data de uma tarefa manualmente, com registro de quem mudou e por quê. Dependência entre tarefas fica para depois.

**Camila:** Aceito. Mas quero saber quem mudou data.

> **Decisão:** prazo relativo ao kickoff (D+n). Ajuste manual de data é permitido e auditado. Dependência entre tarefas fica fora do MVP.

**Diego:** E eu queria que o sistema me avisasse quando eu esquecer alguma coisa. [R2-09]

**João:** Avisar como? E-mail, notificação, uma lista?

**Diego:** Sei lá... algo que me lembre.

**João:** Se ao entrar no sistema você visse uma fila "minhas pendências, as mais atrasadas primeiro", resolveria 80% disso?

**Diego:** Se eu abro o sistema todo dia, sim.

> **Por que perguntei assim:** "me avise" é vago e escondia uma exigência de e-mail/WhatsApp (custo). Mostrei uma fila de pendências como alternativa, e testei se ele abre o sistema todo dia.

**Camila:** Uma coisa: eu não quero que o cliente veja tudo. Tem tarefa interna que ele não precisa ver. E comentário interno, de jeito nenhum. [R2-10]

## Ata

| Item | Registro |
|---|---|
| Decisão | Modelos de implantação padronizados, com tarefas obrigatórias (R2-01, R2-02) |
| Decisão | Campos por tarefa: responsável, prazo, status, obrigatoriedade, comentários |
| Decisão | Prazo relativo ao kickoff; ajuste manual auditado |
| Decisão | Fila de pendências por implantador no lugar de notificações |
| Decisão | Tarefas têm um indicador de visibilidade para o cliente; comentários são internos (R2-10) |
| Fora do escopo | Subtarefas, anexos, campos personalizados, tempo gasto, dependência entre tarefas |
| Pendência | Ver com suporte e cliente o que eles precisam ver (Reunião 3) |
