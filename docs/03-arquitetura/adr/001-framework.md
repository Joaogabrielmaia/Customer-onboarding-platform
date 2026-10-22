# ADR-001: Framework web — Next.js (App Router) com TypeScript

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [ADR-009](009-camada-de-servicos.md) · [ADR-008](008-hospedagem.md)

## Contexto
Preciso de uma aplicação web com telas autenticadas, uma página pública (portal do cliente) e um backend simples, feita por uma pessoa só, publicada sem custo recorrente e que eu consiga explicar linha por linha.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| **Next.js (App Router)** | Front e back no mesmo projeto; Server Components e Server Actions reduzem código; roda como um serviço Node comum; é o que domino | App Router tem curva e algumas arestas (cache, fronteira cliente/servidor) |
| React (Vite) + API Express separada | Separação clara; sem mágica | Dois projetos, dois deploys, CORS, mais código para a mesma coisa |
| Remix / React Router | Bom modelo de formulários | Menos familiar para mim; menos material de apoio |
| Rails/Django | Muito produtivo para CRUD | Fora da stack que quero usar |

## Decisão
Next.js com App Router e TypeScript em modo estrito.

## Por quê
Uma base de código só para interface, regras e acesso a dados cabe no prazo de um desenvolvedor. A stack é a mesma que uso profissionalmente e a que o briefing pede.

## Trade-off
Acoplamento ao ecossistema Next e à sua forma de cache. Mitigo mantendo as regras de negócio em funções puras fora do framework (ADR-009), o que deixa a migração viável.

## Quando eu mudaria
Se a API precisasse atender outros clientes (app mobile, integrações), eu extrairia uma API própria.
