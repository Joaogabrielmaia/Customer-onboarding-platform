# ADR-005: Estratégia de auditoria

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [RN-15](../../02-definicao/03-regras-de-negocio.md) · [Modelo de dados](../modelo-de-dados.md)

## Contexto
O implantador quer provar o que foi combinado (R2-05) e o suporte quer consultar o histórico (R3-01). Preciso saber quem mudou o quê, quando e por quê.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| Triggers no banco | Captura tudo, até alterações fora do app | Não sabe quem é o usuário da aplicação; lógica escondida no banco |
| Event sourcing | Histórico completo e reconstruível | Complexo demais para o prazo |
| Extensão do Prisma que audita tudo | Automático | Registra detalhes técnicos, não eventos de negócio com motivo |
| **Registro explícito na camada de serviços** | Eventos de negócio legíveis, com motivo; mesma transação | Preciso lembrar de chamar em cada operação (mitigo com testes) |

## Decisão
Tabela `AuditLog` só de inserção. Cada serviço que altera uma implantação grava o registro **dentro da mesma transação** da alteração. Campos: autor, ação, entidade, campo, valor anterior, valor novo, motivo e data. A aplicação não expõe edição nem exclusão de registros.

## Por quê
O histórico é uma funcionalidade para pessoas, então os eventos precisam ter linguagem de negócio ("prazo alterado de 10/03 para 14/03, motivo: cliente pediu"). A transação garante que não exista mudança sem registro, nem registro sem mudança (RNF-12).

## Trade-off
Alterações feitas direto no banco (fora do app) não são registradas. A imutabilidade é por convenção da aplicação, não por permissão do banco.

## Quando eu mudaria
Se houvesse exigência de conformidade forte, adicionaria permissão de banco só de INSERT e hash encadeado nos registros.
