# Change-log da validação do protótipo

**Objetivo:** registrar cada mudança pedida na Reunião 4, a decisão e o impacto no escopo.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Reunião 4](02-reuniao-4-validacao.md) · [Requisitos](../02-definicao/02-requisitos.md) · [Backlog](../02-definicao/06-backlog-e-sprints.md)

| ID | Pedido (quem) | Decisão | Justificativa | Impacto no escopo |
|---|---|---|---|---|
| CH-01 / M4-01 | Dias de atraso grandes e em vermelho no painel (Ricardo) | **Aceita** | Barato e é o objetivo do painel | Ajuste visual em US-09 CA2; sem novo requisito |
| CH-02 / M4-02 | Filtro do painel por implantador (Camila) | **Aceita** | Necessário para a reunião semanal | RF-18 sobe de Should para **Must**; entra na Sprint 3 junto com o painel |
| CH-03 / M4-03 | Mensagem pronta com o link para copiar (Ricardo) | **Aceita** | Elimina retrabalho do implantador sem custo de API | Novo **RF-19** (Should), Sprint 3, dentro da US-12 |
| CH-04 / M4-04 | Cliente marcar tarefa como entregue no portal (Ricardo) | **Recusada** | O portal é um link sem login; permitir escrita deixaria qualquer pessoa com o link alterar o andamento que o fundador usa para decidir, e o histórico perderia o autor identificável (RN-13, RN-15, ADR-007). O cliente continua avisando e o implantador marca | Nenhum. Registrado como ideia para v2 com confirmação por e-mail (ver CH-05) |
| CH-05 / M4-05 | Anotar o botão "já enviei" para a v2 (Ricardo) | **Adiada** | Depende de e-mail para confirmar a identidade | Roadmap v2 |
| CH-06 / M4-06 | Datas seguintes se ajustam sozinhas quando o cliente atrasa (Camila) | **Adiada** | É dependência entre tarefas (ADR-004); exige recálculo em cadeia | Roadmap v2. Enquanto isso, ajuste manual com motivo (RN-11) |
| CH-07 / M4-07 | Exportar o painel em PDF (Ricardo) | **Adiada** | Útil, mas não é o essencial; quero ver se usam o painel antes | Candidato à v1.1 (exportação) |
| CH-08 / M4-08 | Calendário semanal com prazos (Camila) | **Adiada** | A fila de pendências já responde "o que vence" | Roadmap v1.2 ou v2 |

## Efeitos nos documentos
- [Requisitos](../02-definicao/02-requisitos.md): RF-18 vira Must; RF-19 criado.
- [Rastreabilidade](../02-definicao/08-rastreabilidade.md): RF-19 adicionado.
- [Escopo](../02-definicao/05-priorizacao-e-escopo.md): lista de fora do escopo ganha o botão "já enviei" e o calendário.

## Por que mostro a recusa
Aceitar tudo teria sido mais agradável na reunião, mas piora o produto e a segurança. A recusa traz o motivo, a alternativa (o implantador marca) e o gatilho para reconsiderar (se virar dor, entra na v2 com confirmação por e-mail).
