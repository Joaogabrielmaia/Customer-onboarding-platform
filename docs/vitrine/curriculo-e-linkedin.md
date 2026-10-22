# Currículo e LinkedIn

**Objetivo:** textos prontos para o currículo e para um post, sempre com a frase honesta de que é projeto de portfólio com caso simulado.
**Data:** 2026-10-22 · **Status:** rascunho para você revisar. **Ajuste ao que for verdadeiro para você**; não inclua nada que o projeto não demonstre.
Relacionados: [README](../../README.md) · [Apresentação do projeto](apresentacao-do-projeto.md)

## 3 bullets para o currículo

Seção sugerida: *Projetos*. Título: **Trilha — plataforma de acompanhamento de implantação (projeto de portfólio, caso simulado)**

- Conduzi, de ponta a ponta, um **projeto de portfólio com caso simulado** (empresa e dados fictícios): discovery com reuniões roteirizadas, requisitos rastreáveis (RF/RNF/RN), 9 ADRs, protótipo, construção em 3 sprints, UAT, plano de go-live, runbook e uma evolução pós-lançamento (v1.1.0).
- Construí a aplicação em **Next.js, TypeScript, PostgreSQL e Prisma**: modelos de implantação com prazos relativos, painel de atrasos, portal do cliente por link com token (expiração e revogação), autorização no servidor e auditoria transacional.
- Cobri o projeto com **156 testes automatizados** (unitários, integração contra PostgreSQL real e E2E com Playwright, incluindo verificação automática de acessibilidade), registrando os defeitos reais encontrados e as limitações conhecidas.

> Se faltar espaço, use só o primeiro e o terceiro. Mantenha "projeto de portfólio com caso simulado" em qualquer versão.

## 1 post para o LinkedIn

> Terminei um projeto de portfólio e queria compartilhar **como** o conduzi, mais do que o que ele faz.
>
> Importante: é um **projeto de portfólio com caso simulado**. A empresa (uma software house fictícia), as pessoas, as reuniões e os dados são inventados por mim, e tudo está marcado assim no repositório. Não há clientes reais nem resultados medidos.
>
> A ideia: uma software house pequena conduz implantações em planilha e WhatsApp. Construí a **Trilha**, que cria a implantação a partir de um modelo, calcula os prazos, mostra o que está atrasado e dá ao cliente um link de leitura, sem cadastro.
>
> O que mais me ensinou:
> 🔹 Pedido vago ("quero um painel bonito") vira requisito quando você pergunta qual decisão a pessoa vai tomar com ele.
> 🔹 Separar o atraso da equipe da espera do cliente evita uma discussão toda segunda-feira.
> 🔹 O que o sistema **esconde** importa tanto quanto o que mostra. Boa parte do trabalho no portal foi garantir o que não aparece.
> 🔹 Documentar o que falhou e o que não testei deixa o resto mais confiável.
>
> Tem discovery, requisitos rastreáveis, ADRs com trade-offs, 156 testes automatizados, plano de rollout e uma evolução pós-lançamento (v1.1).
>
> Código e documentação: [link do repositório]
>
> Se você trabalha com implantação, customer success ou automação, adoraria ouvir como vocês lidam com o primeiro mês de um cliente novo.
>
> #implantação #customersuccess #saas #desenvolvimento #portfólio

## Antes de publicar, confira

- [ ] O link do repositório e da demonstração estão no ar.
- [ ] O CI no GitHub rodou (e o número de testes no post bate com o do README).
- [ ] Você está confortável com cada frase: ela deve ser verdade para você.
- [ ] A conexão com a sua experiência real foi preenchida por você, não por mim.
