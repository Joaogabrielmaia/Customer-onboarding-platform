# Processo atual (AS-IS) da implantação

**Objetivo:** mostrar como a implantação funciona hoje na Rota Fácil e onde estão os gargalos.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Reunião 2](05-reuniao-2-lideranca-e-implantador.md) · [Problemas priorizados](08-problemas-priorizados.md)

> Processo montado a partir das reuniões simuladas. Cenário fictício.

```mermaid
flowchart TD
    A([Contrato assinado]) --> B[Comercial avisa a líder<br/>por WhatsApp]
    B --> C[Líder escolhe implantador<br/>de cabeça]
    C --> D[Implantador cria planilha<br/>do próprio jeito]:::gargalo1
    D --> E[Kickoff com o cliente]
    E --> F[Pede dados: produtos,<br/>clientes, preços]
    F --> G{Cliente enviou<br/>os dados?}
    G -- não --> H[Cobra por WhatsApp<br/>várias vezes]:::gargalo2
    H --> G
    G -- sim --> I[Importa e confere dados]
    I --> J[Parametrização fiscal<br/>depende do contador]:::gargalo3
    J --> K[Agenda treinamento<br/>com o dono]:::gargalo4
    K --> L[Treinamento]
    L --> M[Acompanhamento<br/>da 1ª semana]
    M --> N([Go-live])
    N --> O[Combinados ficam<br/>no WhatsApp]:::gargalo5
    O --> P[Suporte atende sem<br/>saber o que foi combinado]:::gargalo5

    Q[Reunião de segunda:<br/>fundador pergunta à líder]:::gargalo6 -.-> D

    classDef gargalo1 fill:#fde2e2,stroke:#c0392b
    classDef gargalo2 fill:#fde2e2,stroke:#c0392b
    classDef gargalo3 fill:#fde2e2,stroke:#c0392b
    classDef gargalo4 fill:#fde2e2,stroke:#c0392b
    classDef gargalo5 fill:#fde2e2,stroke:#c0392b
    classDef gargalo6 fill:#fde2e2,stroke:#c0392b
```

## Gargalos marcados (em vermelho)

| ID | Onde | O que acontece | Evidência |
|---|---|---|---|
| G1 | Criação da planilha | Cada implantador monta a sua; etapas obrigatórias dependem de memória | R2-01, R2-02 |
| G2 | Espera pelos dados do cliente | Dados chegam atrasados e bagunçados; cobrança manual por WhatsApp | R2-03, R3-03 |
| G3 | Parametrização fiscal | Depende do contador do cliente, fora do controle da equipe | R2-04 |
| G4 | Agenda de treinamento | Depende da disponibilidade do dono do cliente | R2-03 |
| G5 | Combinados no WhatsApp | O que se combina não é registrado; o suporte não consegue consultar | R2-05, R3-01 |
| G6 | Acompanhamento semanal | O fundador só descobre atrasos na reunião de segunda ou quando o cliente liga | R1-01, R1-02 |
