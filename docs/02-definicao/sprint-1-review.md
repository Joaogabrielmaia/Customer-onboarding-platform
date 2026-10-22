# Sprint 1 (Fundação): review

**Objetivo da sprint:** projeto no ar localmente, login com papéis, clientes e usuários, banco e seed base.
**Data:** 2026-10-22 · **Status:** concluída
Relacionados: [Backlog](06-backlog-e-sprints.md) · [Sprint 2](sprint-2-review.md) · [Sprint 3](sprint-3-review.md)

## Como conduzi (com honestidade)

Sou uma pessoa só e o ambiente me deixou trabalhar sem cerimônia, então **não separei as três sprints no tempo**. Construí na ordem das dependências: primeiro o domínio e os serviços de todas as histórias, com testes, e depois as telas, agrupadas em commits por história. O histórico do Git mostra isso. Mantive as "sprints" como blocos de entrega para organizar a explicação e os commits de interface.

## Entregue

| História | Resultado |
|---|---|
| US-01 Login | Sessão própria em cookie `httpOnly`, hash do token no banco, senha com scrypt, mensagem única para credencial inválida, desativação com efeito imediato |
| US-02 Clientes | CRUD com validação por campo e arquivamento (bloqueado com implantação em andamento) |
| US-03 Usuários | Criar, desativar, reativar e redefinir senha; só admin |
| US-14 (parte) | Seed com 5 usuários e 8 clientes fictícios |

## Ficou fora

Nada do planejado para esta sprint. Recuperação de senha por e-mail continua fora do MVP.

## O que aprendi

- **Prisma 7 mudou a configuração:** a URL do banco saiu do `schema.prisma` para `prisma.config.ts`, o cliente é gerado dentro do projeto e exige um adaptador de driver (`@prisma/adapter-pg`). Li o que o `migrate dev` exigiu em vez de copiar um tutorial antigo.
- **`useId` em campos de formulário.** Cheguei a escrever campos com `id` igual ao `name`; ao revisar, vi que telas com vários formulários iguais gerariam ids duplicados. Corrigi antes de testar (defeito D1, ver [resultado da execução](../05-qualidade/02-resultado-da-ultima-execucao.md)).
- **Sessão própria dá trabalho, mas é explicável.** Foram poucas linhas, e cada uma tem um motivo no [ADR-002](../03-arquitetura/adr/002-autenticacao.md).
