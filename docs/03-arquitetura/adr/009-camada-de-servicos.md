# ADR-009: Camada de serviços e Server Actions

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [ADR-001](001-framework.md) · [ADR-006](006-controle-de-acesso.md) · [ADR-005](005-auditoria.md)

## Contexto
Preciso que as regras de negócio sejam testáveis sem subir o Next, que autorização e auditoria nunca sejam esquecidas e que o código seja fácil de explicar. O briefing pede testes de integração "para a API".

## Alternativas
1. Lógica dentro das Server Actions e páginas. Rápido, difícil de testar.
2. API REST completa (`/api/...`) consumida pela interface. Mais código, duas fronteiras.
3. **Três camadas simples:** `domain` (funções puras), `services` (casos de uso com banco, autorização e auditoria) e `app` (páginas e Server Actions que só validam a entrada e chamam um serviço).

## Decisão
Opção 3.
- `src/domain`: prazo, atraso, progresso, permissões, token. Sem banco, sem Next.
- `src/server/services`: uma função por caso de uso, recebendo o ator e a entrada já validada. Cada uma checa permissão, usa transação e audita.
- `src/app`: Server Actions finas (autentica, chama o serviço, trata o erro e revalida) e páginas. A **validação com Zod fica dentro de cada serviço** (`parseInput`), para que ninguém dependa de a interface ter validado. Route handlers só onde HTTP é a interface natural: healthcheck.

## Por quê
Os serviços são a "API" da aplicação: testo os casos de uso contra um PostgreSQL real, sem depender de HTTP. As regras puras têm testes unitários rápidos.

## Trade-off
Os testes de integração não cobrem a fronteira HTTP/Server Action; isso fica para os testes E2E. Se eu publicar uma API REST no futuro, os serviços já estão prontos para serem reutilizados. **Ao documentar os testes, vou chamar de "integração dos serviços", sem fingir que são testes de endpoints REST.**

## Quando eu mudaria
Se surgir um cliente externo da API, exponho os serviços em route handlers com os mesmos schemas Zod.
