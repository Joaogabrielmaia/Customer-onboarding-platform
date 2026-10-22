# Modelo de dados

**Objetivo:** apresentar o modelo relacional e explicar as escolhas.
**Data:** 2026-10-22 · **Status:** concluído (o schema Prisma implementa este desenho)
Relacionados: [ADR-003](adr/003-banco-e-orm.md) · [ADR-004](adr/004-tarefas-e-prazos-relativos.md) · [ADR-005](adr/005-auditoria.md) · [ADR-007](adr/007-portal-por-token.md)

```mermaid
erDiagram
    User ||--o{ Session : tem
    User ||--o{ Deployment : "é implantador de"
    User ||--o{ Comment : escreve
    User ||--o{ AuditLog : "é autor de"
    Client ||--o{ Deployment : possui
    Template ||--o{ TemplateStage : contém
    TemplateStage ||--o{ TemplateTask : contém
    Template |o--o{ Deployment : "origem de"
    Deployment ||--o{ DeploymentStage : contém
    DeploymentStage ||--o{ DeploymentTask : contém
    Deployment ||--o{ DeploymentTask : agrupa
    DeploymentTask ||--o{ Comment : recebe
    Deployment ||--o{ AuditLog : registra
    Deployment ||--o{ PortalLink : compartilha

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | IMPLANTADOR"
        bool active
    }
    Session {
        string id PK
        string tokenHash UK
        datetime expiresAt
    }
    Setting {
        int id PK "sempre 1"
        int overdueToleranceDays
        int portalLinkDays
    }
    Client {
        string id PK
        string companyName
        string cnpj "fictício"
        string contactName
        string contactEmail
        enum plan "ESSENCIAL | PROFISSIONAL | REDE"
        date contractDate
        datetime archivedAt
    }
    Template {
        string id PK
        string name
        datetime archivedAt
    }
    TemplateTask {
        string id PK
        string title
        int offsetDays
        enum assigneeKind "IMPLANTADOR | CLIENTE | ADMIN"
        bool required
        bool visibleToClient
    }
    Deployment {
        string id PK
        string templateName "cópia"
        date kickoffDate
        enum status "EM_ANDAMENTO | CONCLUIDA"
        date completedAt
    }
    DeploymentTask {
        string id PK
        string title
        date dueDate
        date originalDueDate
        enum assigneeKind
        enum status "PENDENTE | EM_ANDAMENTO | AGUARDANDO_CLIENTE | CONCLUIDA | NAO_APLICAVEL"
        bool required
        bool visibleToClient
    }
    Comment {
        string id PK
        string body
        datetime createdAt
    }
    AuditLog {
        string id PK
        string action
        string field
        string oldValue
        string newValue
        string reason
        datetime createdAt
    }
    PortalLink {
        string id PK
        string tokenHash UK
        datetime expiresAt
        datetime revokedAt
    }
```

## Escolhas e motivos

| Escolha | Motivo | Custo |
|---|---|---|
| Tabelas separadas para modelo (`Template*`) e implantação (`Deployment*`) | RN-10: a implantação é uma cópia; alterar o modelo não a afeta | Duplicação de dados |
| `dueDate` e `originalDueDate` como `DATE` | Prazo é dia civil; evita bug de fuso (RK-03). O original permite mostrar o quanto o prazo foi movido | Cálculo de "hoje" precisa usar a data local da empresa (America/Sao_Paulo) |
| `Deployment.templateName` copiado além da FK | Mantém o nome mesmo se o modelo for arquivado | Redundância pequena |
| `assigneeKind` + `assigneeId` opcional na tarefa | Tarefa do cliente não tem usuário interno (RN-09) | Duas colunas para um conceito |
| Atrasado **não** é uma coluna | RN-04: depende de "hoje" e da tolerância; guardar geraria dados velhos | Calculado em cada leitura (volume pequeno) |
| `AuditLog` ligado à implantação, com texto livre em valor anterior/novo | Histórico legível por pessoas, simples de consultar | Sem tipagem forte dos valores |
| `PortalLink` guarda só o hash | ADR-007 | Não é possível reexibir o link; precisa gerar outro |
| `Setting` com uma linha | Configuração global pequena (tolerância e validade do link) | Não escala para multiempresa (fora do escopo) |
| Arquivamento (`archivedAt`) em vez de exclusão | RN-16: preservar histórico | Listas precisam filtrar arquivados |
| Índices em `Deployment(status)`, `DeploymentTask(deploymentId)`, `DeploymentTask(assigneeId, status)` e `AuditLog(deploymentId, createdAt)` | Painel, fila de pendências e histórico são as consultas mais frequentes | Pequeno custo de escrita |

## O que não guardo
Senha em texto, token do cliente em texto, IP do cliente do portal, dados de pagamento, documentos pessoais. O CNPJ é opcional e, na demo, sempre fictício.
