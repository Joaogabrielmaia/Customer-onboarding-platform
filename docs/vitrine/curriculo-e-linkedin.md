# Currículo e LinkedIn

**Objetivo:** textos prontos para o currículo e para um post sobre a Trilha.
**Data:** 2026-10-22 · **Status:** rascunho
Relacionados: [README](../../README.md) · [Apresentação do projeto](apresentacao-do-projeto.md)

## 3 bullets para o currículo

Seção *Projetos*. Título: **Trilha: plataforma de acompanhamento de implantação de clientes (projeto pessoal)**

- Conduzi o projeto de ponta a ponta: discovery, requisitos rastreáveis (RF/RNF/RN), 9 ADRs, protótipo, construção em 3 sprints, UAT, plano de go-live, runbook e uma evolução pós-lançamento (v1.1.0).
- Desenvolvi a aplicação em **Next.js, TypeScript, PostgreSQL e Prisma**: modelos de implantação com prazos relativos, painel de atrasos, portal do cliente por link com token (expiração e revogação), autorização no servidor e auditoria transacional.
- Cobri o código com **156 testes automatizados** (unitários, integração contra PostgreSQL real e E2E com Playwright, incluindo verificação de acessibilidade com axe) e documentei os defeitos que encontrei e as limitações conhecidas.

Se faltar espaço, use o primeiro e o terceiro.

## Post para o LinkedIn

> Terminei a **Trilha**, um projeto pessoal que me tomou bastante tempo, e queria compartilhar o que mais aprendi.
>
> A ideia: uma software house pequena conduz implantações em planilha e WhatsApp, descobre atraso tarde e perde o que combinou com o cliente. A Trilha cria a implantação a partir de um modelo, calcula os prazos, mostra o que está atrasado e dá ao cliente um link de leitura, sem cadastro.
>
> O que mais me ensinou:
> 🔹 Pedido vago ("quero um painel bonito") vira requisito quando você pergunta qual decisão a pessoa vai tomar com ele.
> 🔹 Separar o atraso da equipe da espera do cliente evita uma discussão toda segunda-feira.
> 🔹 O que o sistema **esconde** importa tanto quanto o que mostra: boa parte do trabalho no portal foi garantir o que não aparece.
> 🔹 Documentar o que falhou e o que eu não testei deixa o resto mais confiável.
>
> Tem discovery, requisitos rastreáveis, ADRs com trade-offs, 156 testes automatizados, plano de rollout e uma evolução depois do lançamento (v1.1).
>
> Código e documentação: [link do repositório]
>
> Se você trabalha com implantação, customer success ou automação, queria ouvir como vocês organizam o primeiro mês de um cliente novo.
>
> #implantação #customersuccess #saas #desenvolvimento

## Antes de publicar

- [ ] O link do repositório está no ar.
- [ ] O CI no GitHub rodou e o número de testes bate com o do README.
- [ ] Cada frase é algo que você consegue explicar em uma conversa.
