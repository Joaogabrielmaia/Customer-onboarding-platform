# Diagramas

**Objetivo:** reunir as fontes editáveis (Mermaid) e as imagens exportadas dos diagramas do ciclo de vida.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](../README.md) · [04 Arquitetura](../04-arquitetura-e-adrs.md) · [05 Modelo de dados](../05-modelo-de-dados.md)

Cada diagrama tem a fonte (`.mmd`) e a imagem (`.png`). As imagens foram geradas a partir das fontes com o Mermaid CLI, que também validou a sintaxe. Para alterar um diagrama, edite o `.mmd` e exporte de novo; as imagens e as páginas que as usam devem ser atualizadas juntas.

| Diagrama | Fonte | Imagem | Usado em | Natureza |
|---|---|---|---|---|
| Fluxo das fases do ciclo de vida | [ciclo-de-vida.mmd](ciclo-de-vida.mmd) | [PNG](ciclo-de-vida.png) | [Índice](../README.md) | Planejamento |
| Cronograma acadêmico | [cronograma-academico.mmd](cronograma-academico.mmd) | [PNG](cronograma-academico.png) | [Índice](../README.md) | Planejamento |
| Histórico observado | [historico-observado.mmd](historico-observado.mmd) | [PNG](historico-observado.png) | [Índice](../README.md) | Observado |
| AS-IS e TO-BE | [as-is-to-be.mmd](as-is-to-be.mmd) | [PNG](as-is-to-be.png) | [01](../01-visao-e-discovery.md) | Observado no cenário e no código |
| Contexto | [contexto.mmd](contexto.mmd) | [PNG](contexto.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Contêineres | [containers.mmd](containers.mmd) | [PNG](containers.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Sequência: criar implantação | [seq-criar-implantacao.mmd](seq-criar-implantacao.mmd) | [PNG](seq-criar-implantacao.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Sequência: atualizar tarefa | [seq-status-auditoria.mmd](seq-status-auditoria.mmd) | [PNG](seq-status-auditoria.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Sequência: portal por token | [seq-portal.mmd](seq-portal.mmd) | [PNG](seq-portal.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Estados da tarefa | [estado-tarefa.mmd](estado-tarefa.mmd) | [PNG](estado-tarefa.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Estados da implantação e do link | [estado-implantacao-e-link.mmd](estado-implantacao-e-link.mmd) | [PNG](estado-implantacao-e-link.png) | [04](../04-arquitetura-e-adrs.md) | Observado no código |
| Modelo ER | [er.mmd](er.mmd) | [PNG](er.png) | [05](../05-modelo-de-dados.md) | Observado no schema |
| Rastreabilidade | [rastreabilidade.mmd](rastreabilidade.mmd) | [PNG](rastreabilidade.png) | [03](../03-requisitos-e-rastreabilidade.md) | Observado |
| Pirâmide de testes | [piramide-de-testes.mmd](piramide-de-testes.mmd) | [PNG](piramide-de-testes.png) | [07](../07-testes-e-qualidade.md) | Observado na CI |
| Rollout | [rollout.mmd](rollout.mmd) | [PNG](rollout.png) | [08](../08-implantacao-e-operacao.md) | Planejamento |
| Evolução | [evolucao.mmd](evolucao.mmd) | [PNG](evolucao.png) | [09](../09-evolucao-e-roadmap.md) | Entregue e proposta |
| Fluxo entre as sprints | [fluxo-das-sprints.mmd](fluxo-das-sprints.mmd) | [PNG](fluxo-das-sprints.png) | [Sprints](../sprints/README.md) | Planejamento |
