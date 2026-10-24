# Sprint 1 · Fundação

**Objetivo:** projeto funcionando localmente, login com papéis, clientes, usuários e seed base.
**Data:** janela acadêmica de 21 a 25/09/2026 · **Status:** concluída
Relacionados: [Sprints](README.md) · [Índice do ciclo de vida](../README.md) · [Review original](../../02-definicao/sprint-1-review.md) · [Sprint 2](sprint-2-nucleo.md)

## Escopo

| História | Requisitos e regras | Prioridade |
|---|---|---|
| [US-01 Entrar no sistema](../../02-definicao/04-historias-de-usuario.md) | RF-01, RF-02, RN-17, RN-18 | Must |
| US-02 Gerenciar clientes | RF-03, RN-16 | Must |
| US-03 Gerenciar usuários | RF-17, RN-18 | Should |
| US-14 Dados de exemplo (parte) | RF-16 | Must |

## Critérios de conclusão da sprint

- Login com sessão própria no banco, mensagem única para credencial inválida e desativação com efeito imediato.
- Cliente com validação por campo e arquivamento bloqueado quando há implantação em andamento.
- Usuários criados, desativados e reativados só por administrador.
- Seed com cinco usuários e oito clientes.
- Definition of Done do [backlog](../../02-definicao/06-backlog-e-sprints.md) cumprida.

## Planejamento

O objetivo da sprint é ter o menor sistema autenticado que sirva de base às demais histórias. A ordem é: estrutura do projeto e schema, regras de domínio com teste, serviços com seed, telas de login, clientes e usuários. O risco em foco é RK-04 (falha de autorização), tratado com uma matriz de permissões central ([ADR-006](../../03-arquitetura/adr/006-controle-de-acesso.md)).

## Review

Entregue: login com sessão em cookie `httpOnly` e senha com scrypt ([ADR-002](../../03-arquitetura/adr/002-autenticacao.md)), cadastro de clientes, gestão de usuários e seed base. Nada do planejado ficou de fora. Recuperação de senha por e-mail continua fora do MVP.

## Retrospectiva

- A configuração do Prisma 7 mudou: a URL do banco saiu do schema, o cliente é gerado no projeto e exige adaptador de driver.
- Campos de formulário com `id` igual ao `name` gerariam ids repetidos em telas com vários formulários iguais; a correção virou o D1.
- A sessão própria deu mais trabalho que uma biblioteca, mas cada linha tem um motivo registrado no ADR-002.

## Evidências

| Evidência | Registro |
|---|---|
| Estrutura, schema e domínio | Commit `e17e719` |
| Serviços, seed e testes de integração | Commit `b1cb861` |
| Login, sessão e layout | Commit `1761ad8` |
| Clientes, usuários e configurações | Commit `5705d29` |
| Testes | [Auth](../../../tests/integration/auth.test.ts), [permissões](../../../tests/unit/permissions.test.ts), [senha](../../../tests/unit/password.test.ts) |
