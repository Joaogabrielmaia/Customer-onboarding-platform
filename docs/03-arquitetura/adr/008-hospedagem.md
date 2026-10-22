# ADR-008: Hospedagem — Vercel + Neon

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [Custo](../custo-hospedagem.md) · [ADR-003](003-banco-e-orm.md)

## Contexto
Publicação sem custo recorrente (teto do cenário: R$ 100/mês, R1-05). Preciso de app Next.js e PostgreSQL gerenciado.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| **Vercel (Hobby) + Neon (plano gratuito)** | Deploy direto do GitHub; Neon é Postgres puro, com pooling, compatível com Prisma | O banco gratuito suspende por inatividade (primeira requisição demora); limites de uso |
| Vercel + Supabase | Banco + extras (auth, storage) | Eu não usaria os extras; mais superfície para configurar |
| Render / Railway / Fly.io | Rodam app e banco juntos | Planos gratuitos mudam muito; menos integrados ao Next |
| VPS próprio | Controle total | Eu operaria servidor, TLS e backup; fora do foco |

## Decisão
Vercel Hobby para o app e Neon (plano gratuito) para o PostgreSQL. As migrations rodam no deploy e o seed é um comando manual.

## Por quê
É o caminho de menor atrito para publicar e custa zero. Neon entrega Postgres puro, sem acoplar o código a um fornecedor.

## Trade-off
- A inatividade suspende o banco; a primeira visita pode demorar alguns segundos (documentado como limitação).
- O plano Hobby da Vercel é para uso não comercial. **Uso comercial pela Rota Fácil exigiria plano pago** (ver custo).

## Quando eu mudaria
Para uso real: plano pago da Vercel ou migração para um host de containers, e um plano de banco com backup e sem suspensão.
