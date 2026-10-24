# 05 · Modelo de dados

**Objetivo:** documentar o banco como está implementado: modelo ER, dicionário de dados, integridade, índices, migrations, seed e regras de retenção.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [04 Arquitetura](04-arquitetura-e-adrs.md) · [Modelo de dados original](../03-arquitetura/modelo-de-dados.md) · [schema.prisma](../../prisma/schema.prisma)

O diagrama e o dicionário foram conferidos contra o [schema](../../prisma/schema.prisma) e a [migration](../../prisma/migrations/20261022122435_init/migration.sql): 13 tabelas, 6 enums e uma migration. Nada aqui é planejado: o que não existe está na seção final.

## Modelo entidade-relacionamento

![Modelo entidade-relacionamento com as 13 tabelas: usuário, sessão, cliente, modelo, etapa e tarefa do modelo, implantação, etapa e tarefa da implantação, comentário, auditoria, link do portal e configuração](diagramas/er.png)

*Fonte editável: [er.mmd](diagramas/er.mmd). A tabela `AuditLog` guarda `taskId` como texto, sem chave estrangeira.*

## Dicionário de dados

PK: chave primária. FK: chave estrangeira. Os identificadores são `cuid` em texto, exceto `Setting.id`.

### Acesso e configuração

| Tabela | Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|---|
| User | id, name | texto | PK; obrigatório | Usuário interno |
| User | email | texto | Único | Login |
| User | passwordHash | texto | Obrigatório | Hash scrypt; a senha nunca é guardada |
| User | role | enum Role | ADMIN ou IMPLEMENTER | Papel |
| User | active | booleano | Padrão verdadeiro | Desativar impede o login e preserva o histórico (RN-18) |
| User | createdAt | data e hora | Padrão agora | Criação |
| Session | id | texto | PK | Sessão |
| Session | userId | texto | FK User, apaga em cascata | Dono da sessão |
| Session | tokenHash | texto | Único | Hash do token do cookie |
| Session | expiresAt, createdAt | data e hora | Obrigatório | Validade e criação |
| Setting | id | inteiro | PK, padrão 1 | Sempre uma linha |
| Setting | overdueToleranceDays | inteiro | Padrão 0 | Tolerância de atraso (RN-02) |
| Setting | portalLinkDays | inteiro | Padrão 60 | Validade do link do cliente (RN-13) |

### Clientes e modelos

| Tabela | Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|---|
| Client | id, companyName, contactName, contactEmail | texto | PK; obrigatório | Empresa e contato |
| Client | cnpj, contactPhone | texto | Opcional | CNPJ de exemplo, claramente fictício |
| Client | plan | enum Plan | ESSENTIAL, PROFESSIONAL ou NETWORK | Plano |
| Client | contractDate | data | Obrigatório | Data do contrato |
| Client | archivedAt | data e hora | Opcional | Arquivamento no lugar de exclusão (RN-16) |
| Template | id, name | texto | PK; obrigatório | Modelo de implantação |
| Template | description, archivedAt | texto, data e hora | Opcional | Descrição e arquivamento |
| TemplateStage | id, name | texto | PK; obrigatório | Etapa do modelo |
| TemplateStage | templateId | texto | FK Template, cascata | Modelo dono |
| TemplateStage | position | inteiro | Obrigatório | Ordem |
| TemplateTask | id, title | texto | PK; obrigatório | Tarefa do modelo |
| TemplateTask | stageId | texto | FK TemplateStage, cascata | Etapa dona |
| TemplateTask | offsetDays | inteiro | Obrigatório | O n do prazo D+n |
| TemplateTask | assigneeKind | enum AssigneeKind | IMPLEMENTER, CLIENT ou ADMIN | Responsável padrão (RN-09) |
| TemplateTask | required, visibleToClient | booleano | Padrões verdadeiro e falso | Obrigatória e visível ao cliente |
| TemplateTask | description, position | texto, inteiro | Opcional, obrigatório | Descrição e ordem |

### Implantação

| Tabela | Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|---|
| Deployment | id, templateName | texto | PK; obrigatório | Implantação; guarda o nome do modelo de origem |
| Deployment | clientId | texto | FK Client, restringe exclusão | Cliente |
| Deployment | templateId | texto | FK Template, vira nulo ao excluir | Modelo de origem |
| Deployment | implementerId | texto | FK User, restringe exclusão | Implantador responsável |
| Deployment | kickoffDate | data | Obrigatório | Dia 0 dos prazos |
| Deployment | status | enum DeploymentStatus | IN_PROGRESS ou COMPLETED | Situação gravada; "atrasada" não é gravada (RN-04) |
| Deployment | completedAt | data | Opcional | Data de conclusão |
| DeploymentStage | id, name | texto | PK; obrigatório | Etapa copiada |
| DeploymentStage | deploymentId, position | texto, inteiro | FK Deployment, cascata | Implantação dona e ordem |
| DeploymentTask | id, title | texto | PK; obrigatório | Tarefa copiada |
| DeploymentTask | deploymentId, stageId | texto | FK, cascata | Implantação e etapa |
| DeploymentTask | dueDate, originalDueDate | data | Obrigatório | Prazo atual e prazo original calculado |
| DeploymentTask | assigneeKind | enum AssigneeKind | Obrigatório | Tipo de responsável |
| DeploymentTask | assigneeId | texto | FK User, opcional, vira nulo | Responsável interno; vazio para tarefa do cliente |
| DeploymentTask | required, visibleToClient | booleano | Obrigatório | Copiados do modelo |
| DeploymentTask | status | enum TaskStatus | PENDING, IN_PROGRESS, WAITING_CLIENT, DONE, NOT_APPLICABLE | Status |
| DeploymentTask | completedAt, description, position | data, texto, inteiro | Opcional, opcional, obrigatório | Conclusão, descrição e ordem |

### Histórico e portal

| Tabela | Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|---|
| Comment | id, body | texto | PK; obrigatório | Comentário interno |
| Comment | taskId | texto | FK DeploymentTask, cascata | Tarefa comentada |
| Comment | authorId | texto | FK User, restringe exclusão | Autor |
| AuditLog | id | texto | PK | Registro de auditoria |
| AuditLog | action | enum AuditAction | 10 valores (criação, conclusão, reabertura, status, prazo, responsável, comentário, link criado, link revogado, configuração) | Evento de negócio (RN-15) |
| AuditLog | deploymentId | texto | FK Deployment, opcional, cascata | Implantação afetada |
| AuditLog | actorId | texto | FK User, opcional, vira nulo | Quem fez |
| AuditLog | taskId, field, oldValue, newValue, reason | texto | Opcional | Detalhes legíveis; `taskId` sem FK |
| PortalLink | id | texto | PK | Link do cliente |
| PortalLink | deploymentId | texto | FK Deployment, cascata | Implantação compartilhada |
| PortalLink | tokenHash | texto | Único | SHA-256 do token; o token nunca é guardado (RN-13) |
| PortalLink | expiresAt, revokedAt | data e hora | Obrigatório, opcional | Validade e revogação |
| PortalLink | createdById | texto | Obrigatório, sem FK | Quem gerou |

## Normalização e justificativas

Cada fato fica em uma tabela, com três duplicações deliberadas:

| Duplicação | Motivo | Custo |
|---|---|---|
| Tabelas do modelo e da implantação separadas, com cópia na criação | RN-10: mudar o modelo não pode alterar o que foi combinado ([ADR-004](../03-arquitetura/adr/004-tarefas-e-prazos-relativos.md)) | Dados duplicados |
| `Deployment.templateName` além da FK | Preserva o nome se o modelo for arquivado | Redundância pequena |
| `dueDate` e `originalDueDate` | Mostrar quanto o prazo foi movido | Uma coluna a mais |

A situação "atrasada" não é coluna, porque depende de "hoje" e da tolerância; é calculada na leitura (RN-04).

## Índices e integridade

| Índice | Tabela e colunas | Para quê |
|---|---|---|
| Único | `User(email)`, `Session(tokenHash)`, `PortalLink(tokenHash)` | Login único e busca por token |
| Comum | `Deployment(status)`, `Deployment(clientId)`, `Deployment(implementerId)` | Painel e filtros |
| Comum | `DeploymentTask(deploymentId)`, `DeploymentTask(assigneeId, status)` | Detalhe e fila de pendências |
| Comum | `AuditLog(deploymentId, createdAt)` | Histórico da implantação |
| Comum | `Session(userId)`, `TemplateStage(templateId)`, `TemplateTask(stageId)`, `DeploymentStage(deploymentId)`, `Comment(taskId)`, `PortalLink(deploymentId)` | Junções por chave estrangeira |

Integridade referencial: as partes dependem do todo e apagam em cascata (etapas e tarefas, comentários, auditoria e links somem com a implantação). Cliente, implantador e autor de comentário têm exclusão restrita. Cliente e modelo são arquivados, não excluídos (RN-16). Não há restrições `CHECK` no banco; as regras de negócio ficam nos serviços.

## Migrations

| Migration | Data do diretório | Conteúdo |
|---|---|---|
| `20261022122435_init` | 2026-10-22 | Cria os 6 enums, as 13 tabelas, os índices e as chaves estrangeiras |

Há uma única migration, versionada em `prisma/migrations`. Mudanças futuras entram como novas migrations; a reversão está descrita no [runbook](../07-pos-go-live/runbook.md).

## Seed e dados de demonstração

O [seed](../../src/server/seed.ts) apaga as tabelas e recria cinco usuários, oito clientes, três modelos e sete implantações em estados variados (duas no prazo, uma aguardando cliente, duas atrasadas e duas concluídas), com datas relativas ao dia da execução. Por isso o "47 dias" de tempo médio do painel é um resultado ilustrativo. O seed só roda contra banco não local com confirmação explícita (`SEED_CONFIRM_RESET`).

## Retenção, auditoria, privacidade e acesso

| Tema | Regra implementada |
|---|---|
| Auditoria | Só inserção: a aplicação nunca edita nem apaga registros; a garantia é da aplicação, não de permissão do banco ([ADR-005](../03-arquitetura/adr/005-auditoria.md)) |
| Retenção | Clientes, modelos e usuários desativados permanecem; implantações não têm exclusão pela interface |
| Privacidade | Não guarda senha em texto, token em texto, IP do cliente do portal, dados de pagamento nem documentos pessoais; o CNPJ é opcional ([segurança e privacidade](../03-arquitetura/seguranca-e-privacidade.md)) |
| Acesso | Autorização central no servidor por papel ([ADR-006](../03-arquitetura/adr/006-controle-de-acesso.md)); o cliente só lê pelo token |

## Fluxo de criação, atualização e consulta

| Operação | O que acontece no banco |
|---|---|
| Criar implantação | Uma transação grava a implantação, copia etapas e tarefas do modelo com datas calculadas e grava a auditoria ([sequência](diagramas/seq-criar-implantacao.mmd)) |
| Atualizar tarefa | Uma transação atualiza a tarefa, grava a auditoria e conclui ou reabre a implantação ([sequência](diagramas/seq-status-auditoria.mmd)) |
| Gerar link | Uma transação revoga o link ativo, cria o novo com o hash e grava a auditoria |
| Consultar o portal | Busca o link pelo hash do token e lê só os campos permitidos ([sequência](diagramas/seq-portal.mmd)) |

Consistência e idempotência: trocar uma tarefa para o status que ela já tem não grava nada. A auditoria é gravada com o `tx` da própria alteração, então não existe mudança sem registro.

## O que não existe

Restrições `CHECK`, permissão de banco apenas de inserção na auditoria, hash encadeado nos registros e multiempresa não existem; os dois primeiros são os gatilhos do [ADR-005](../03-arquitetura/adr/005-auditoria.md) e o último está fora do escopo.
