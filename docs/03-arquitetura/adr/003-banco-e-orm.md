# ADR-003: Banco e ORM — PostgreSQL com Prisma

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [Modelo de dados](../modelo-de-dados.md) · [ADR-008](008-hospedagem.md)

## Contexto
Os dados são relacionais (clientes, modelos, implantações, tarefas, comentários) e precisam de transações (status + auditoria juntos, RNF-12).

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| **PostgreSQL + Prisma** | Relacional, transações, tipos `DATE` e `enum`; Prisma dá tipos e migrations versionadas; plano gratuito em Neon/Supabase | Prisma adiciona uma camada e um passo de geração de cliente |
| PostgreSQL + Drizzle/Kysely | SQL mais explícito, mais leve | Menos familiar para mim; menos conforto nas migrations |
| SQLite | Simples, zero infraestrutura | Não combina com serverless na Vercel (disco efêmero) e diverge da produção |
| MongoDB | Flexível | O domínio é relacional; auditoria e relatórios ficariam mais difíceis |

## Decisão
PostgreSQL (local via Docker, produção em Neon) com Prisma ORM e migrations versionadas no repositório.

## Por quê
Tipos fortes de ponta a ponta, migrations revisáveis e a mesma engine em desenvolvimento, CI e produção (RK-10).

## Trade-off
Queries complexas de relatório ficam menos transparentes que SQL puro. Se precisar, uso `$queryRaw` pontual. Também aceito o peso do cliente gerado em ambiente serverless.

## Quando eu mudaria
Se a performance de relatórios virasse problema real, adicionaria visões SQL ou trocaria para uma ferramenta mais próxima do SQL.
