# Entrevista: Fase 0 (preparação do repositório)

**Objetivo:** preparar respostas sobre as escolhas de organização do projeto.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [`docs/00-sobre-este-caso`](../00-sobre-este-caso/README.md) · [`CLAUDE.md`](../../CLAUDE.md)

### 1. Por que deixar tão explícito que o caso é simulado?
Porque a credibilidade vale mais que o efeito. Um recrutador que descobre sozinho que "o cliente" era inventado desconfia de todo o resto. Dizendo logo no topo, o foco passa para o que é verificável: o código, as decisões, os testes e o processo. Por isso também não coloco nenhum número de resultado: só hipóteses rotuladas como tal.

### 2. Por que a pasta `docs/` é organizada por etapas numeradas e não por tipo de documento?
Porque a pessoa que lê quer seguir a história: descoberta, definição, arquitetura, construção, qualidade, entrega e evolução. A numeração dá a ordem de leitura sem precisar de explicação. O trade-off é que um documento que cruza etapas (como a matriz de rastreabilidade) fica em uma pasta só e precisa de links. Mudaria para organização por tipo se o projeto virasse um produto vivo, com documentação de referência consultada sem ordem.

### 3. Como você garante que não vaza nenhum segredo no repositório?
O `.gitignore` bloqueia `.env` e variantes, e só o `.env.example` é versionado, com valores claramente ilustrativos. As credenciais de demonstração são públicas e fictícias de propósito, documentadas à parte. Em produção, as variáveis ficam no painel da Vercel. Para reforçar, eu rodaria um scanner de segredos no CI (anotado como melhoria possível).
