# ADR-004: Modelagem de tarefas e prazos relativos

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [Regras RN-01, RN-10, RN-11](../../02-definicao/03-regras-de-negocio.md) · [Modelo de dados](../modelo-de-dados.md)

## Contexto
O implantador pensa em "D+3 após o kickoff" (R2-08). O modelo precisa servir para muitas implantações, e cada implantação precisa de datas reais que podem ser ajustadas sem mexer no modelo.

## Alternativas
1. **Referência viva ao modelo:** a implantação lê o modelo e calcula tudo na hora. Simples, mas mudar o modelo altera implantações em andamento e o histórico perde sentido.
2. **Cópia na criação (escolhida):** etapas e tarefas do modelo são copiadas para tabelas da implantação, com a data já calculada.
3. **Prazo relativo a outras tarefas (grafo de dependências):** mais fiel, mas exige recalcular em cadeia e detectar ciclos.

## Decisão
Cópia na criação (RN-10). A tarefa da implantação guarda `dueDate` (data real) e `originalDueDate` (a calculada). O offset em dias fica só no modelo (`offsetDays`). As datas usam o tipo `DATE` (dia civil, sem hora). O cálculo é uma função pura `computeDueDate(kickoff, offsetDays)`: soma dias corridos e, se cair no fim de semana, vai para a segunda.

## Por quê
Preserva o que foi combinado com o cliente mesmo que o modelo evolua, e deixa o ajuste manual (RN-11) ser só uma mudança de `dueDate` com auditoria. Usar `DATE` evita bugs de fuso horário que surgem com `timestamp` em prazos que são "dias".

## Trade-off
- Duplicação de dados (cada implantação tem sua cópia).
- Corrigir um erro no modelo não corrige implantações existentes.
- Sem dependências, um atraso do cliente não empurra as demais datas automaticamente.

## Quando eu mudaria
Se o uso mostrasse que dependências são frequentes, adicionaria `dependsOnTaskId` e uma função de recálculo, testada à parte.
