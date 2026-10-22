# "Me fale sobre esse projeto"

**Objetivo:** respostas curtas para entrevista: 30 segundos e 2 minutos.
**Data:** 2026-10-22 · **Status:** rascunho para você adaptar com as suas palavras
Relacionados: [README](../../README.md) · [Perguntas de entrevista por fase](../entrevista/)

> Comece sempre dizendo que é um **projeto de portfólio com caso simulado**. Quem pergunta respeita mais a clareza do que o efeito.

## Versão de 30 segundos

"É um projeto de portfólio com caso simulado. Imaginei uma software house pequena que conduz implantações em planilha e WhatsApp e descobre atrasos tarde. Fiz o discovery, defini o escopo e construí a **Trilha**: ela cria a implantação a partir de um modelo, calcula os prazos, mostra o que está atrasado e dá ao cliente um link de leitura, sem cadastro. Tem testes automatizados, deploy documentado e uma evolução depois do lançamento. O que mais me interessou foi o caminho do problema até o uso, não só o código."

## Versão de 2 minutos

"É um **projeto de portfólio com caso simulado**: a empresa, as pessoas, as reuniões e os dados são fictícios, e eu deixo isso explícito em tudo.

**O problema.** A Rota Fácil, uma software house de uns doze funcionários, implanta o sistema nos clientes com planilhas, WhatsApp e e-mail. O fundador só descobre atraso quando o cliente liga, os combinados se perdem e cada implantação segue um roteiro diferente.

**Discovery e escopo.** Escrevi três reuniões simuladas com perguntas que eu faria de verdade. Por exemplo, o fundador pediu um 'painel bonito'; perguntei qual decisão ele tomaria olhando e cheguei a um requisito concreto: quais estão atrasadas, de quem e há quanto tempo. Houve contradições, como simples contra detalhado, e restrições que mudaram o escopo: o WhatsApp automático saiu por custo, e o cliente não queria criar conta, então entrou o portal por link.

**A solução.** A Trilha cria a implantação a partir de um modelo com prazos relativos ao kickoff, separa o atraso da equipe da espera do cliente, guarda o histórico de alterações e tem um portal de leitura com link que expira e pode ser revogado.

**Decisões.** Documentei nove ADRs. Duas que gosto de explicar: copiar o modelo para a implantação, para o que foi combinado não mudar; e recusar que o cliente escreva no portal, porque o link não tem login e isso comprometeria o dado que o fundador usa para decidir.

**Qualidade e entrega.** Escrevi 156 testes, com integração contra PostgreSQL real e E2E, e registrei os defeitos reais que encontrei, como uma rolagem horizontal no celular. Deixei pronto o deploy, o treinamento, o plano de rollout e o runbook, e fiz uma evolução depois do lançamento, a exportação em CSV, já pensando em injeção de fórmula.

**Limites.** Não é um sistema em uso com clientes e não tenho resultados medidos. O CI está configurado mas eu ainda ia rodá-lo no GitHub; eu digo isso."

## Perguntas que costumam vir depois (com onde está a resposta)

| Pergunta | Onde olhar |
|---|---|
| "Por que não Auth.js?" | [ADR-002](../03-arquitetura/adr/002-autenticacao.md) |
| "Como garante que o implantador não altera o que não deve?" | [ADR-006](../03-arquitetura/adr/006-controle-de-acesso.md) e [fase 3](../entrevista/fase-3-arquitetura.md) |
| "Qual foi o maior problema técnico?" | [fase 5](../entrevista/fase-5-implementacao.md) |
| "Qual a cobertura?" | [fase 6](../entrevista/fase-6-qualidade.md): não medi, e digo por quê |
| "O que você faria diferente?" | [retrospectiva final](../07-pos-go-live/retrospectiva-final.md) |
| "Como isso se liga à sua experiência?" | Preencher no README com a sua experiência real |

> Ajuste a frase "eu ainda ia rodá-lo no GitHub" para o tempo verbal certo depois de rodar o CI.
