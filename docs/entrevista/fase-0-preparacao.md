# Entrevista: Fase 0 (preparação do repositório)

**Objetivo:** preparar respostas sobre as escolhas de organização do projeto.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [`docs/00-sobre-o-projeto`](../00-sobre-o-projeto/README.md)

### 1. Por que a pasta `docs/` é organizada por etapas numeradas e não por tipo de documento?
Porque a pessoa que lê quer seguir a história: descoberta, definição, arquitetura, construção, qualidade, entrega e evolução. A numeração dá a ordem de leitura sem precisar de explicação. O trade-off é que um documento que cruza etapas (como a matriz de rastreabilidade) fica em uma pasta só e precisa de links. Mudaria para organização por tipo se o projeto virasse um produto vivo, com documentação de referência consultada sem ordem.

### 2. Como você garante que não vaza nenhum segredo no repositório?
O `.gitignore` bloqueia `.env` e variantes, e só o `.env.example` é versionado, com valores claramente ilustrativos. As senhas do seed são só para desenvolvimento e ficam no código do seed. Num ambiente em uso, as variáveis ficariam no gerenciador de segredos da plataforma escolhida, nunca no repositório. Para reforçar, eu rodaria um scanner de segredos no CI (anotado como melhoria possível).
