# Diagramas de contexto e de componentes

**Objetivo:** mostrar o sistema visto de fora e suas peças internas.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [ADR-009](adr/009-camada-de-servicos.md) · [Modelo de dados](modelo-de-dados.md)

## Contexto

```mermaid
flowchart LR
    Admin([Admin<br/>fundador, líder]) -->|navegador| T[Trilha<br/>Next.js na Render]
    Impl([Implantador<br/>e suporte]) -->|navegador| T
    Cli([Cliente<br/>link com token]) -->|celular, leitura| T
    T -->|SQL via Prisma| DB[(PostgreSQL<br/>Render)]
    T -.fora do escopo.-> W[WhatsApp / e-mail]
    T -.fora do escopo.-> E[CRM / ERP]
```

## Componentes

```mermaid
flowchart TB
    %% Zod valida dentro dos serviços (ADR-009)
    subgraph app["src/app (Next.js)"]
        P[Páginas<br/>Server Components]
        A[Server Actions<br/>finas]
        H[Route handler<br/>/api/health]
        PO[Portal /p/token]
    end
    subgraph srv["src/server"]
        S[Serviços<br/>casos de uso]
        AU[Sessão e senha]
        DBc[Cliente Prisma]
    end
    subgraph dom["src/domain (puro)"]
        D1[Prazos]
        D2[Atraso e progresso]
        D3[Permissões can]
        D4[Token do portal]
    end
    P --> S
    A --> S
    PO --> S
    H --> DBc
    S --> D1 & D2 & D3 & D4
    S --> AU
    S --> DBc
    DBc --> PG[(PostgreSQL)]
```

**Regra de dependência:** `domain` não importa nada de fora; `services` usa `domain` e o banco; `app` só chama `services`. Assim as regras são testadas sem Next e sem banco.

## Fluxo de uma alteração (exemplo: concluir tarefa)

```mermaid
sequenceDiagram
    participant U as Implantador
    participant A as Server Action
    participant S as Serviço
    participant D as Domínio
    participant B as Banco
    U->>A: concluir tarefa (formulário)
    A->>S: updateTaskStatus(ator, entrada)
    S->>S: valida a entrada (Zod)
    S->>D: can(ator, "task:update-status", recurso)
    D-->>S: permitido
    S->>B: início da transação
    S->>B: atualiza tarefa
    S->>D: calcula progresso e conclusão
    S->>B: atualiza implantação (se concluída)
    S->>B: grava AuditLog
    S->>B: fim da transação
    S-->>A: resultado
    A-->>U: página atualizada
```
