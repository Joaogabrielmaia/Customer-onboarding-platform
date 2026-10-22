# Entrevista: Fase 2 (definição)

**Objetivo:** preparar respostas sobre requisitos, regras e planejamento.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Definição](../02-definicao/) · [Regras de negócio](../02-definicao/03-regras-de-negocio.md)

### 1. Como você definiu o que conta como "atraso"? Por que não foi só "passou do prazo"?
Porque atraso da equipe e espera do cliente são problemas diferentes, e misturar os dois gera discussão toda segunda-feira. A regra RN-02 conta atraso da equipe só para tarefas não concluídas, fora de "aguardando cliente", com `hoje > prazo + tolerância`. A RN-03 faz o atraso do cliente aparecer, em outra cor, mas fora da conta da equipe. A tolerância é configurável porque a empresa pode querer um dia de folga. O trade-off é uma regra mais difícil de explicar do que "venceu, atrasou"; por isso ela tem teste unitário com os casos de borda.

### 2. Por que prazo relativo ao kickoff e não datas fixas? E por que não relativo a outras tarefas?
Datas fixas obrigam o implantador a refazer tudo quando o kickoff muda, o que ele já fazia de cabeça (R2-08). Prazo relativo (D+n) resolve isso e permite reutilizar o modelo. Relativo a outra tarefa seria mais fiel à realidade, mas exige recalcular em cadeia e tratar ciclos. Para o MVP, aceitei o ajuste manual com motivo e auditoria. Mudaria isso se, depois de usar, o time pedisse dependências com frequência.

### 3. Como você garantiu que os requisitos são rastreáveis?
Todo requisito tem ID (RF, RNF, RN), vem de uma evidência do discovery (R1-xx a R3-xx) e aponta para uma história, um teste planejado e uma tela na matriz de rastreabilidade. Isso me deixa responder dois tipos de pergunta: "por que existe essa tela?" e "esta regra tem teste?". Sou honesto sobre o status: os testes estavam planejados na Fase 2 e a matriz foi atualizada conforme eu os escrevi de fato.
