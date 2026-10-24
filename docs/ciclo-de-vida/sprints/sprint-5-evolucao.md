# Sprint 5 · Evolução v1.1

**Objetivo:** entregar a exportação do relatório em CSV, pedida na validação do protótipo, sem abrir brechas de segurança.
**Data:** janela acadêmica de 19 a 21/10/2026 · **Status:** concluída
Relacionados: [Sprints](README.md) · [Índice do ciclo de vida](../README.md) · [09 Evolução e roadmap](../09-evolucao-e-roadmap.md) · [Sprint 4](sprint-4-qualidade.md) · [PR da v1.1.0](../../07-pos-go-live/pr-v1.1.0.md)

## Escopo

| Item | Origem | Prioridade |
|---|---|---|
| RF-20: relatório da implantação em CSV, uma linha por tarefa | Pedido M4-07 e UAT; PDF adiado no [change-log](../../04-prototipo/03-change-log.md) (CH-07) | Could, escolhido para a primeira evolução |
| Lista de implantações em CSV, respeitando os filtros | Mesmo pedido | Could |
| Script de redefinição de senha pelo terminal | Citado no [runbook](../../07-pos-go-live/runbook.md) | Operação |

## Critérios de conclusão da sprint

- O CSV neutraliza texto que começa com `=`, `+`, `-`, `@` ou tabulação.
- A rota de download responde 401 sem sessão e 403 sem permissão.
- O relatório não inclui comentários nem o histórico de auditoria.
- Separador `;` e BOM UTF-8, para abrir com acentos no Excel em português.
- Testes novos: 6 unitários, 6 de integração e 3 E2E.

## Planejamento

A escolha da exportação em CSV, e não em PDF, vem do custo: o PDF exigiria layout e geração, e o CSV atende o pedido de abrir o relatório no Excel. O risco de segurança específico é a injeção de fórmula, tratada por desenho. A decisão de ordem está na [reunião 6](../../07-pos-go-live/reuniao-6-retrospectiva.md), uma retrospectiva simulada: não houve piloto real.

## Review

Entregue: exportação do relatório da implantação e da lista, com os critérios acima. Ficaram fora, de propósito: PDF, alerta de atraso por e-mail e concluir tarefas em lote ([roadmap](../../07-pos-go-live/roadmap.md)). A [versão](../../../CHANGELOG.md) registra 156 testes na execução local de 2026-10-22.

## Retrospectiva

- A injeção de fórmula foi tratada por desenho e testada, e não corrigida depois.
- O D5 (`.env.example` com `DIRECT_URL=""` quebrava a migration) só apareceu ao conferir os passos do README em um clone limpo; a verificação ficou registrada no [resultado da execução](../../05-qualidade/02-resultado-da-ultima-execucao.md).

## Evidências

| Evidência | Registro |
|---|---|
| Feature RF-20 | Commit `a2da0bc` |
| Release v1.1.0 | Commit `fc42c5c`; merge `a16b9bf`; tag `v1.1.0` em 2026-10-22 |
| Testes | [CSV](../../../tests/unit/csv.test.ts), [relatórios](../../../tests/integration/reports.test.ts), [exportação E2E](../../../tests/e2e/export-csv.spec.ts) |
| Tela | [Lista de implantações](../../imagens/12-lista-implantacoes.png) com o botão Exportar CSV |
