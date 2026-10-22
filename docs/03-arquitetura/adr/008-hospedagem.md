# ADR-008: Hospedagem — Render

**Data:** 2026-10-22 · **Status:** aceito (substitui a escolha inicial por Vercel + Neon)
Relacionados: [Custo](../custo-hospedagem.md) · [ADR-003](003-banco-e-orm.md) · [Deploy](../../06-deploy-e-go-live/deploy.md)

## Contexto
Publicação sem custo recorrente (teto do cenário: R$ 100/mês, R1-05). Preciso de um app Next.js e de um PostgreSQL gerenciado, e quero subir tudo com poucos cliques.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| **Render (web service + PostgreSQL)** | Um painel só para app e banco; Blueprint (`render.yaml`) cria tudo; é um processo Node comum, sem particularidades de serverless | Plano gratuito: o serviço dorme sem acesso e o banco expira depois de algumas semanas; sem terminal no gratuito |
| Vercel + Neon | Deploy direto do GitHub; Postgres com pooling | Dois painéis; o plano Hobby é só para uso não comercial |
| Railway / Fly.io | Rodam app e banco juntos | Planos gratuitos mudam muito |
| VPS próprio | Controle total | Eu operaria servidor, TLS e backup |

## Decisão
Render: um web service Node e um PostgreSQL, criados por Blueprint. As migrations rodam a cada subida e um bootstrap cria o primeiro administrador quando o banco está vazio (o plano gratuito não tem terminal).

## Por quê
É o caminho de menor atrito para ter app e banco no ar, e como o app é um processo Node comum, o mesmo código roda localmente, no CI e na Render sem adaptações.

## Trade-off
- O serviço gratuito dorme e a primeira visita seguinte demora; o banco gratuito expira, então para manter o ambiente é preciso plano pago (conferir o plano vigente).
- Sem shell, preciso do bootstrap (código a mais, mas testado).
- Uso comercial pela Rota Fácil exigiria planos pagos (ver custo).

## Quando eu mudaria
Para uso real: planos pagos de serviço e banco, com backup. Se o app precisasse escalar, reavaliaria serverless ou um host de containers.
