# Reunião 3: suporte/CS e cliente

**Objetivo:** entender a implantação do ponto de vista de quem a recebe e de quem atende depois.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Patrícia Nogueira (suporte/CS), Sérgio Batista (dono da Distribuidora Santa Rita Alimentos, cliente fictício) e eu
Relacionados: [Reunião 2](05-reuniao-2-lideranca-e-implantador.md) · [Personas](03-stakeholders-e-personas.md) · [Problemas](08-problemas-priorizados.md)

> Reunião simulada (roteirizada por mim para este caso de portfólio). Pessoas e empresa fictícias.

## Transcrição (trechos principais)

**João:** Patrícia, como o suporte entra na história da implantação?

**Patrícia:** Entra quando o cliente já está no ar. Só que ele liga e fala "isso não foi o que combinaram com o Diego". E eu não tenho como saber. Pergunto pro Diego, que está em outro cliente. [R3-01]

**João:** Com que frequência?

**Patrícia:** Toda semana. E tem o "e a minha implantação, como está?" Umas dez vezes por semana, pelo WhatsApp. [R3-02] Eu queria poder consultar sozinha o que foi feito.

**João:** Você precisa editar ou só consultar?

**Patrícia:** Consultar e comentar. Editar tarefa não.

**João:** Sérgio, como foi a sua implantação?

**Sérgio:** Boa, mas eu vivia no escuro. Mandava a planilha de produtos e não sabia se estava certa. Ligava pro Diego. Ele estava em outro cliente. [R3-03]

**João:** O que você precisava saber?

**Sérgio:** O que falta, e o que é comigo. Eu tenho cinco funcionários, não tenho tempo pra ler e-mail comprido. [R3-04]

**João:** Se existisse uma página com isso, você faria um cadastro e senha?

**Sérgio:** Não. Eu não crio conta em nada. Se vier um link no WhatsApp eu abro. [R3-05] E abro no celular, no balcão.

**João:** E se o link vazar, por exemplo, você encaminha para o contador?

**Sérgio:** Eu encaminho mesmo. Mas não quero que outro cliente veja meus dados. [R3-06]

> **Restrição que mudou o escopo (a segunda):** o cliente não faz login. O acesso é por **link com token**, só de leitura, pensado para celular. Isso gera requisitos de segurança: token difícil de adivinhar, expiração e revogação (decididos na Fase 3).

**João:** O que você gostaria de ver nessa página?

**Sérgio:** Uma barra de quanto já foi, o que vem agora e o que está comigo.

**João:** E as tarefas internas do pessoal da Rota Fácil?

**Sérgio:** Não preciso ver. Só o que me diz respeito.

**Patrícia:** Eu acho que o cliente devia ver tudo, assim ele confia mais. [R3-07]

**João:** A Camila disse na reunião anterior que não quer expor tarefas internas nem comentários. Como você vê isso?

**Patrícia:** Tá, comentários não. Mas as etapas deviam aparecer.

> **Contradição registrada:** a suporte quer transparência total (R3-07); a líder quer proteger o interno (R2-10); o cliente só quer o que lhe diz respeito (R3-04). **Decisão:** cada tarefa tem a marca "visível ao cliente". Comentários nunca aparecem no portal. As etapas aparecem, e as tarefas só quando marcadas.

**João:** Sérgio, o que você acharia de receber um e-mail automático a cada etapa?

**Sérgio:** Eu não leio e-mail. Pode mandar o link no zap uma vez e eu olho quando precisar.

**João:** Obrigado, isso confirma a decisão da primeira reunião.

## Ata

| Item | Registro |
|---|---|
| Decisão | Portal do cliente por link com token, somente leitura, mobile first |
| Decisão | Marca "visível ao cliente" por tarefa; comentários nunca expostos |
| Decisão | Suporte tem papel Implantador (consulta e comenta) |
| Requisito de segurança | Token difícil de adivinhar, com expiração e revogação; um token dá acesso a uma só implantação (R3-06) |
| Hipótese a validar | O portal reduz as consultas "como está minha implantação?" (R3-02). **É hipótese; não há medição.** |
