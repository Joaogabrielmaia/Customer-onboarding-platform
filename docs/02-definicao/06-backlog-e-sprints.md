# Backlog em 3 sprints

**Objetivo:** organizar a entrega em três sprints, com Definition of Ready e Definition of Done.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Histórias](04-historias-de-usuario.md) · [Riscos](07-riscos.md) · [Rastreabilidade](08-rastreabilidade.md)

Sou uma pessoa só, então "sprint" aqui é um bloco de entrega com objetivo, não uma cerimônia de time. Não estimei em horas: seria um número inventado. Ordeno por dependência e risco.

| Sprint | Objetivo | Histórias | Requisitos principais |
|---|---|---|---|
| **1. Fundação** | Projeto no ar localmente, login com papéis, clientes e usuários, banco e seed base | US-01, US-02, US-03, US-14 (parte) | RF-01, RF-02, RF-03, RF-17, RF-16 |
| **2. Núcleo** | Modelo → implantação → tarefas, comentários e auditoria funcionando de ponta a ponta | US-04, US-05, US-06, US-07, US-08 | RF-04 a RF-10 |
| **3. Visão e cliente** | Painel, atraso, pendências, portal por token, seed completo e acabamento | US-09, US-10, US-11, US-12, US-13, US-14 | RF-11 a RF-15, RF-18, RF-19 |

**Primeiro corte se o tempo apertar:** RF-19 (mensagem pronta) e RF-17 (gestão de usuários pela interface). Depois, o portal.

## Definition of Ready (história pronta para começar)

- Tem requisitos e regras associados com IDs.
- Tem critérios de aceite em Dado/Quando/Então.
- Dependências conhecidas e já entregues.
- Não exige decisão de arquitetura em aberto (ADR escrito).

## Definition of Done (história pronta para entregar)

- Critérios de aceite atendidos e verificados.
- Regras de negócio com teste unitário; endpoints com teste de integração.
- Autorização verificada no servidor, com teste do caso negado.
- Entrada validada com Zod.
- Estados de carregamento, vazio e erro tratados na tela.
- Lint, tipos e testes passando.
- Commit referenciando o ID (`feat(US-05): ...`).
- Documentação atualizada (rastreabilidade e review da sprint).
