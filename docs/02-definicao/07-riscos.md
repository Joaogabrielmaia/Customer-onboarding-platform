# Riscos e mitigações

**Objetivo:** antecipar o que pode dar errado e como reduzo o impacto.
**Data:** 2026-10-22 · **Status:** concluído (revisar a cada sprint)
Relacionados: [Backlog](06-backlog-e-sprints.md) · [Escopo](05-priorizacao-e-escopo.md)

Probabilidade e impacto: B (baixo), M (médio), A (alto). São avaliações minhas.

| ID | Risco | Prob. | Impacto | Mitigação | Gatilho para agir |
|---|---|:-:|:-:|---|---|
| RK-01 | Escopo crescer (pedidos de detalhe do implantador) | A | M | Escopo fechado nesta fase; pedidos novos vão para o roadmap | Pedido novo que não cabe na sprint |
| RK-02 | Uma pessoa só: atraso por doença ou imprevisto | M | A | Ordem de corte definida desde o início; sprint 1 já entrega algo demonstrável | Sprint passou da metade sem metade das histórias |
| RK-03 | Cálculo de prazo e atraso com erro sutil (fuso, fim de semana) | M | A | Funções puras com testes de borda; datas tratadas como dia civil, sem hora | Qualquer bug de data |
| RK-04 | Falha de autorização (usuário vê ou altera o que não deve) | M | A | Verificação central no servidor; testes do caso negado | Teste de permissão falhando |
| RK-05 | Vazamento ou adivinhação do token do cliente | B | A | Token aleatório de 32 bytes, hash no banco, expiração e revogação | Suspeita de link vazado: revogar |
| RK-06 | Limite do plano gratuito (banco pausa ou cota) | M | M | Healthcheck, seed reproduzível, runbook de restauração | App fora do ar |
| RK-07 | Cliente não usar o portal (ficar só no WhatsApp) | M | M | Link curto, mobile first, mensagem pronta para enviar | **Hipótese a validar num piloto real** |
| RK-08 | Equipe não preencher o sistema | M | A | Mínimo de campos, tarefas já nascem do modelo, fila de pendências como benefício imediato | Tarefas ficando sem atualização |
| RK-10 | Ambiente local (banco) diferente do de produção | M | M | PostgreSQL em ambos, migrations versionadas, CI com Postgres | Falha só em produção |
