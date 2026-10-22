# Entrevista: Fase 10 (README e vitrine)

**Objetivo:** preparar respostas sobre como apresento o projeto.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [README](../../README.md) · [Vitrine](../vitrine/)

### 1. Como você estruturou o README para quem lê em três minutos?
Resumo de cinco linhas logo depois do título (problema, solução, para quem, stack, status), depois a linha do tempo do discovery até a v1.1 com link para cada pasta, as cinco decisões mais importantes com o trade-off de cada uma, a arquitetura em diagrama, as funcionalidades com prints, como rodar e testar, e por fim qualidade, limitações e roadmap. Quem tem pouco tempo entende o que é e como foi conduzido sem abrir um documento.

### 2. Por que só cita números que saíram do seu terminal?
Porque número sem origem não aguenta a primeira pergunta. Cito 156 testes passando porque rodei e guardei a saída; não cito cobertura porque não medi; e não prometo ganho de produtividade porque não há linha de base. Deixo explícito o que ainda falta, como rodar o CI no GitHub.

### 3. Como você garantiu que o passo a passo do README funciona?
Conferi cada comando contra o código e, ao fazer isso, encontrei um defeito: o `.env.example` trazia uma variável vazia que quebrava a migration. Reproduzi o erro, corrigi e depois validei seguindo os passos em um clone limpo do repositório. Documentar sem executar é a forma mais fácil de publicar instruções que não funcionam.
