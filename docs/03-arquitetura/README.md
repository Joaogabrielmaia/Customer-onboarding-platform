# Episódio 3 — Arquitetura

Oito decisões de arquitetura (ADR) registram contexto, alternativas, escolha, custo aceito e quando mudar. Três delas definem o comportamento do produto: sessão própria no banco em vez de biblioteca de autenticação, auditoria gravada na mesma transação da mudança e portal do cliente por token opaco, guardado como hash.

Os demais documentos mostram o sistema visto de fora e por dentro (contexto e componentes), o modelo relacional e as medidas de segurança e privacidade, com o que ficou de fora do MVP.

| Documento | O que contém | Itens |
|---|---|---|
| [Contexto e componentes](contexto-e-componentes.md) | Sistema visto de fora, peças internas e fluxo de uma alteração | 2 diagramas |
| [Modelo de dados](modelo-de-dados.md) | Modelo relacional, escolhas e o que não é guardado | — |
| [Segurança e privacidade](seguranca-e-privacidade.md) | Medidas, privacidade básica (LGPD) e limitações | — |
| [ADR-001](adr/001-framework.md) | Next.js (App Router) com TypeScript | aceito |
| [ADR-002](adr/002-autenticacao.md) | Sessão própria em cookie, senha com scrypt | aceito |
| [ADR-003](adr/003-banco-e-orm.md) | PostgreSQL com Prisma | aceito |
| [ADR-004](adr/004-tarefas-e-prazos-relativos.md) | Modelo copiado para a implantação; prazo D+n | aceito |
| [ADR-005](adr/005-auditoria.md) | Auditoria na mesma transação | aceito |
| [ADR-006](adr/006-controle-de-acesso.md) | Papéis e autorização no servidor | aceito |
| [ADR-007](adr/007-portal-por-token.md) | Portal por token opaco, hash no banco, somente leitura | aceito |
| [ADR-008](adr/008-camada-de-servicos.md) | Camada de serviços com validação, autorização e auditoria | aceito |

← [Episódio 2: Definição](../02-definicao/README.md) · [Índice](../INDEX.md) · [Episódio 4: Protótipo](../04-prototipo/README.md) →
