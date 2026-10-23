# Runbook de operação

**Objetivo:** dizer como investigar problemas, fazer backup, reverter e quem faz o quê.
**Data:** 2026-10-22 · **Status:** concluído 
Relacionados: [Checklist de entrada em uso](../06-treinamento-e-rollout/02-checklist-de-entrada-em-uso.md) · [Limitações](../05-qualidade/03-limitacoes-conhecidas.md)

> Este runbook usa só o que o projeto tem hoje (healthcheck, logs em JSON e Prisma). Ele descreve como eu operaria a Trilha num ambiente em uso; o projeto roda apenas localmente e o procedimento não foi exercitado com usuários reais.

## 1. Quem faz o quê

| Papel | Pessoa (cenário) | Responsabilidade |
|---|---|---|
| Responsável técnico | Desenvolvedor da Trilha | Banco, migrations, backup, correção de defeitos |
| Dona do processo | Líder de implantação | Modelos, regra de atraso, usuários, priorizar pedidos |
| Usuários | Implantadores e suporte | Reportar problema com o que estavam fazendo |
| Decisor | Fundador | Aprovar mudanças de escopo e custo |

## 2. Primeiros passos diante de um problema

```mermaid
flowchart TD
    A[Alguém reporta um problema] --> B[Abrir /api/health]
    B -->|503 ou não abre| C[Banco ou app fora]
    B -->|200 ok| D[Reproduzir com o relato]
    C --> C1[Conferir se o PostgreSQL está de pé]
    C1 --> C3[Ver os logs do app: healthcheck_database_failed]
    D --> D1[Ver logs: unexpected_error e access_denied]
    D1 --> D2[Consultar o Histórico da implantação]
    D2 --> E[Corrigir ou contornar e registrar]
```

1. **Healthcheck:** `GET /api/health` devolve `{"status":"ok","database":"ok"}` (200) ou `degraded` (503). Se der 503, o app está no ar mas o banco não responde.
2. **Logs:** o app escreve os logs na saída padrão. Cada linha é um JSON com `event`. Os principais: `login_failed`, `login_ok`, `access_denied`, `unexpected_error` e `healthcheck_database_failed`. Os logs **não têm senha, token nem e-mail**.
3. **Histórico da implantação:** a aba *Histórico* mostra quem mudou prazo, status ou responsável, útil para "quem mexeu nisso?".
4. **Reproduzir** com a conta e a implantação do relato (ver permissões: só o responsável altera).

## 3. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Primeira página demora muito | Banco sobrecarregado ou reiniciando | Ver o consumo do banco e os logs do app |
| "Algo deu errado" em várias telas | Banco fora ou migration pendente | `/api/health`; conferir se as migrations pendentes foram aplicadas (`prisma migrate deploy`) |
| Usuário não consegue entrar | Senha errada, usuário desativado ou sessão expirada | Admin confere em *Usuários* e redefine a senha |
| O único admin perdeu o acesso | — | Ver "Redefinir senha pelo terminal" abaixo |
| Cliente diz que o link não abre | Link expirado, revogado ou digitado errado | Gerar novo link na implantação |
| Tudo aparece atrasado depois de dias parado | O seed envelheceu | Rodar o seed de novo |
| Implantador não altera uma tarefa | Não é o responsável | Pedir ao responsável ou à líder (regra RN-12) |

### Redefinir senha pelo terminal

Quando ninguém com papel de administrador consegue entrar:

```bash
# com DATABASE_URL apontando para o banco certo
npm run admin:reset-password -- <email> <nova-senha-com-10-ou-mais-caracteres>
```

O comando redefine a senha, reativa o usuário se estiver desativado e encerra as sessões dele. Troque a senha pela interface depois.

## 4. Backup e restauração

- **O que preciso proteger:** o banco PostgreSQL. O código está no Git.
- **Como:** cópia periódica com `pg_dump`, e sempre antes de uma migration arriscada:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=trilha-$(date +%F).dump
```

- **Restaurar:** criar um banco novo e usar `pg_restore`. **Teste a restauração ao menos uma vez** antes de depender dela.
- **Dados do seed** não precisam de backup: o seed os recria.

## 5. Reverter uma migration

O Prisma **não** tem rollback automático. Caminhos, do mais seguro ao mais drástico:

1. **Migration ainda não aplicada fora da minha máquina:** apagar a pasta da migration e recriar (`prisma migrate dev`).
2. **Já aplicada e sem dados em risco:** escrever uma **nova migration que desfaz** a anterior (`prisma migrate dev --name desfaz_...`) e aplicá-la com `prisma migrate deploy`.
3. **Já aplicada e destrutiva** (apagou coluna ou tabela): restaurar o backup anterior à migration e voltar o código à versão anterior (`git revert`).
4. **Migration que falhou no meio:** `prisma migrate resolve --rolled-back <nome>` marca como revertida depois de corrigir o banco à mão. Só com cuidado.

**Regra:** toda migration que remove ou altera tipo de coluna exige backup antes e duas etapas (primeiro o código que não usa mais a coluna, depois a migration).

## 6. Rotina

| Quando | Tarefa |
|---|---|
| A cada atualização do app | Conferir `/api/health` e entrar com um usuário |
| Quando os dados de exemplo envelhecerem | Rodar `npm run db:seed` |
| A cada mês | Revisar usuários ativos; remover contas que saíram |
| A cada trimestre | Rodar `npm audit` e atualizar dependências com os testes verdes |
| Depois de qualquer incidente | Registrar o que houve, a causa e a mudança, sem culpar pessoas |

## 7. Severidade e prazo de resposta (propostos)

| Nível | Exemplo | Resposta desejada |
|---|---|---|
| Alta | Sistema fora do ar; usuário vê dado que não deveria | Imediata; considerar voltar o código à versão anterior |
| Média | Uma tela com erro; link de cliente não abre | No mesmo dia útil |
| Baixa | Texto errado; melhoria | Entra no backlog |

Os prazos são **propostas**; não há compromisso (SLA).
