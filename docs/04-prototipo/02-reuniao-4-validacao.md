# Reunião 4: validação do protótipo

**Objetivo:** mostrar os wireframes ao fundador e à líder de implantação e colher mudanças.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Ricardo Almeida (fundador), Camila Tavares (líder de implantação) e eu
Relacionados: [Wireframes](01-wireframes.md) · [Change-log](03-change-log.md) · [Escopo](../02-definicao/05-priorizacao-e-escopo.md)

> Reunião simulada com o Claude (Anthropic) no papel dos stakeholders, a partir do meu briefing. Pessoas e empresa fictícias.

## Transcrição (trechos principais)

**João:** Vou mostrar o painel primeiro. A pergunta é: ele responde o que você disse que queria, ver o que está atrasado, de quem e há quanto tempo?

**Ricardo:** Responde. Mas quero ver os dias de atraso grandes, em vermelho. Se tiver que apertar o olho, não adianta. [M4-01]

**Camila:** E eu preciso filtrar por implantador. Na segunda eu converso com cada um. [M4-02]

**João:** O filtro já estava como "se der tempo". Posso subir para obrigatório.

**Ricardo:** Quando você gera o link do cliente, o que acontece?

**João:** Aparece o endereço uma vez, com botão de copiar.

**Ricardo:** Hoje o Diego manda o link por WhatsApp escrevendo uma mensagem toda vez. Dá pra já vir uma mensagem pronta? "Olá, segue o link para acompanhar sua implantação…" [M4-03]

**João:** Isso eu consigo: um texto pronto com o link, para copiar. Não envia nada, só facilita.

**Ricardo:** Serve.

**Ricardo:** Agora uma coisa importante. Se o cliente enviar o arquivo, podia ele mesmo marcar a tarefa como entregue no portal. Aí o Diego nem precisa fazer nada. [M4-04]

**João:** Entendo o ganho. Mas o portal hoje é um link sem login. Se qualquer pessoa com o link puder marcar tarefa como concluída, e o link for encaminhado, alguém de fora altera o andamento de uma implantação. Além disso, o histórico deixaria de ter um autor identificável.

**Ricardo:** Mas ninguém ia mexer nisso.

**João:** Provavelmente não. Mas o risco é de integridade do dado que o fundador usa para decidir. Proponho manter o portal só leitura. O cliente avisa e o implantador marca, com o autor no histórico. Se isso virar dor, a versão 2 pode ter um botão "já enviei" com confirmação por e-mail.

**Ricardo:** Tá, deixa então. Mas anota pra v2. [M4-05]

**Camila:** Eu queria que, se o cliente atrasa uma etapa, as datas seguintes se ajustassem sozinhas. [M4-06]

**João:** Isso é a dependência entre tarefas que a gente conversou. Exige recalcular em cadeia e decidir regras (o que empurra o quê). Hoje o ajuste manual com motivo cobre o caso, ainda que dê trabalho.

**Camila:** Dá trabalho mesmo. Mas entendo. Fica pra depois.

**Ricardo:** E o painel em PDF pra eu levar na reunião de segunda? [M4-07]

**João:** Entra como candidato à primeira evolução depois do lançamento. Eu prefiro entregar o essencial funcionando e ver se vocês realmente usam antes.

**Camila:** Última: uma visão de calendário por semana, com os prazos de todo mundo. [M4-08]

**João:** A fila de pendências cobre o "o que vence". Calendário eu deixo para uma versão futura.

## Ata

Todas as mudanças estão no [change-log](03-change-log.md). Resumo: 3 aceitas (M4-01, M4-02, M4-03), 4 adiadas (M4-06, M4-07, M4-08 e o botão "já enviei" de M4-05) e 1 recusada com justificativa (M4-04).
