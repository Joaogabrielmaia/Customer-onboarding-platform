# ADR-006: Controle de acesso por papel

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [RN-12](../../02-definicao/03-regras-de-negocio.md) · [Segurança](../seguranca-e-privacidade.md)

## Contexto
Dois papéis internos (Admin, Implantador) e uma regra que depende do recurso: o implantador só altera tarefas das implantações em que é o responsável, mas comenta em qualquer uma.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| Só esconder botões e proteger rotas por middleware | Fácil | Não protege nada: a Server Action ainda pode ser chamada direto |
| Biblioteca de políticas (CASL) | Expressiva | Dependência e linguagem nova para uma matriz pequena |
| Row Level Security no Postgres | Defesa em profundidade | Complexo com Prisma e conexões em pool |
| **Função pura `can(actor, action, resource)` + guarda em todo serviço** | Simples, testável, explicável | Depende de eu chamá-la em todo serviço |

## Decisão
`can(actor, action, resource?)` em `src/domain/permissions.ts`, uma função pura que implementa a matriz da RN-12. Todo serviço começa chamando `assertCan(...)`, que lança erro de acesso negado. A interface usa a mesma função só para esconder o que não está disponível, nunca como proteção.

## Por quê
Uma matriz pequena cabe em uma função que tem teste unitário exaustivo (papel × ação × recurso). A autorização fica no servidor, como o RNF-02 exige.

## Trade-off
Se alguém criar um serviço novo e esquecer o `assertCan`, a falha é silenciosa. Mitigo com testes do caso negado por serviço e com o checklist da Definition of Done.

## Quando eu mudaria
Com mais papéis ou permissões por campo, adotaria CASL ou RLS.
