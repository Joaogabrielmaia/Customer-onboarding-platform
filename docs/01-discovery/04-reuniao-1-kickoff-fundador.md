# Reunião 1: kickoff com o fundador

**Objetivo:** entender a visão, o orçamento, o prazo e o que o fundador quer enxergar.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Ricardo Almeida (fundador) e eu (João Gabriel)
Relacionados: [Personas](03-stakeholders-e-personas.md) · [Reunião 2](05-reuniao-2-lideranca-e-implantador.md) · [Problemas](08-problemas-priorizados.md)

> Reunião simulada; pessoas e empresa fictícias.

## Transcrição (trechos principais)

Marco com **[R1-xx]** as falas que uso depois como evidência.

**João:** Ricardo, obrigado pelo tempo. Antes de falar de tela, queria entender o problema. Me conta a última implantação que deu dor de cabeça.

**Ricardo:** A da distribuidora de bebidas, em setembro. Combinamos entrar em produção numa segunda e só fui saber na quinta anterior que a importação dos produtos nem tinha começado. [R1-01] Eu fico sabendo de atraso quando o cliente me liga.

**João:** E como você acompanha hoje?

**Ricardo:** Pergunto pra Camila na reunião de segunda. Ela puxa de cabeça ou de umas planilhas. [R1-02]

**João:** O que você quer que o sistema faça?

**Ricardo:** Quero algo simples. Um painel bonito onde eu olho e sei.

**João:** "Saber" o quê, exatamente? Se você abrisse esse painel agora, qual decisão você tomaria a partir dele?

**Ricardo:** Hmm. Ligaria pro implantador das que estão atrasadas. E se for cliente grande, eu mesmo entro na conversa. [R1-03]

**João:** Então o painel precisa responder: quais implantações estão atrasadas, de quem é a pendência e há quanto tempo. É isso?

**Ricardo:** É isso. O resto eu nem olho.

> **Por que perguntei assim:** "painel bonito" é um pedido vago. Perguntar qual decisão ele toma transforma o desejo em requisito: lista de atrasadas com responsável e tempo de atraso.

**João:** O que significa "atrasada" pra você?

**Ricardo:** Passou do prazo. Simples.

**João:** Se o cliente prometeu mandar a planilha de produtos na terça e não mandou, a implantação está atrasada?

**Ricardo:** Ah... na prática sim, mas não é culpa nossa. Eu não quero que meu time apareça como atrasado por culpa do cliente. Mas também não quero esconder. [R1-04]

**João:** Então talvez precise existir um estado "aguardando cliente", que aparece, mas separado do atraso da equipe.

**Ricardo:** Isso. Perfeito.

> **Por que perguntei assim:** a definição de atraso muda o número que ele vai ver. Sem separar atraso interno de espera do cliente, o painel geraria discussão toda segunda-feira.

**João:** Orçamento e prazo?

**Ricardo:** Não posso colocar mais que uns cem reais por mês de custo. E quero uma primeira versão que o time use em uns três meses. [R1-05] Os devs estão presos no produto, então é você sozinho.

**João:** Entendido. E sobre integração com o sistema de vocês?

**Ricardo:** Seria ótimo mas não agora.

**Ricardo:** Ah, e eu queria que mandasse mensagem automática no WhatsApp pro cliente quando uma etapa terminasse. Isso o cliente ia adorar. [R1-06]

**João:** Sabe como vocês enviam hoje, pelo número do suporte?

**Ricardo:** É, um chip normal.

**João:** Mensagem automática exige a API oficial do WhatsApp Business, que cobra por conversa e exige aprovação de modelos de mensagem. Com o teto de cem reais e o prazo, não consigo prometer isso na primeira versão. Uma alternativa é o cliente ter uma página com o andamento sempre atualizado, que ele acessa quando quiser.

**Ricardo:** Hum. Um link que eu mando uma vez e ele acompanha? Isso resolve metade. Deixa o automático pra depois. [R1-07]

> **Restrição que mudou o escopo:** notificações por WhatsApp saíram do MVP por custo e prazo (R1-05, R1-06). No lugar entra o **portal do cliente por link** (R1-07).

**João:** Última pergunta: o que seria sucesso daqui a seis meses?

**Ricardo:** Eu parar de ser o gerente de projeto das implantações. [R1-08]

## Ata

| Item | Registro |
|---|---|
| Decisão | Foco em implantação (não em chamados nem cobrança) |
| Decisão | Painel responde: o que está atrasado, de quem e há quanto tempo |
| Decisão | Existe estado "aguardando cliente", separado de atraso da equipe |
| Decisão | WhatsApp automático fora do MVP; entra portal do cliente por link |
| Restrição | Custo recorrente máximo de cerca de R$ 100/mês; prazo de cerca de 3 meses; um desenvolvedor |
| Pendência | Validar o conceito de "aguardando cliente" com a líder de implantação (Reunião 2) |
| Pendência | Descobrir o que a equipe de implantação precisa registrar (Reunião 2) |
