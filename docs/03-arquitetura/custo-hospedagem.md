# Estimativa de custo de hospedagem

**Objetivo:** estimar o custo de hospedagem no plano gratuito e em uso comercial.
**Data:** 2026-10-22 · **Status:** concluído (**estimativa**; preços e limites mudam, conferir nas páginas oficiais antes de decidir)
Relacionados: [ADR-008](adr/008-hospedagem.md) · [Visão](../02-definicao/01-visao-e-metas.md)

> São estimativas feitas por mim a partir do que conheço dos planos públicos. Não são cotações nem medições de consumo.

| Cenário | Componentes | Custo mensal estimado |
|---|---|---|
| **Plano gratuito (como está hoje)** | Render (serviço web e PostgreSQL gratuitos) + GitHub | **R$ 0**, com o serviço dormindo sem acesso e o banco expirando depois de algumas semanas |
| Uso real, equipe pequena | Render: serviço web pago de entrada + PostgreSQL pago | Da ordem de **US$ 15 a US$ 30** (aprox. R$ 85 a R$ 170, conforme o câmbio); conferir a página de preços |
| Uso real alternativo | Um host de containers pequeno + Postgres gerenciado básico | Da ordem de **US$ 10 a US$ 30** |

## Leitura

- No **plano gratuito** o custo é zero, dentro do que o cenário permite.
- Para **uso real**, o teto de R$ 100/mês dito pelo fundador (R1-05) provavelmente seria ultrapassado se ele quisesse backup, banco sem suspensão e licença comercial de hospedagem. Registro isso como um **ponto a renegociar**, não como detalhe.
- O que mais pesa no custo não é o tráfego (poucos usuários e um portal leve), e sim as garantias: banco sem suspensão e backup.

## Hipóteses de volume

Cerca de 10 usuários internos, cerca de 45 clientes, poucas implantações simultâneas e acessos ao portal esporádicos. Com esse perfil não esperaria consumo próximo de limites de planos pagos de entrada, mas **não medi**.
