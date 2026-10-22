# Regras de negócio

**Objetivo:** fixar as regras que o sistema aplica, de forma precisa e testável.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Requisitos](02-requisitos.md) · [Histórias](04-historias-de-usuario.md)

| ID | Regra |
|---|---|
| RN-01 | **Prazo relativo.** O prazo de uma tarefa é `data do kickoff + n dias corridos` (D+n). Se o resultado cair em sábado ou domingo, desloca para a segunda-feira seguinte. Feriados não são considerados no MVP. |
| RN-02 | **Atraso da equipe.** Uma tarefa está atrasada quando não está concluída nem não aplicável, não está aguardando cliente, e `hoje > prazo + tolerância`. A tolerância é configurável (padrão 0 dias). |
| RN-03 | **Espera do cliente.** Tarefa com status "aguardando cliente" ou de responsabilidade do cliente, vencida, é contada como **atraso do cliente**, aparece destacada com outra cor e não entra na contagem de atrasos da equipe. |
| RN-04 | **Implantação atrasada.** É a que tem pelo menos uma tarefa em atraso da equipe. Atrasada é calculada na leitura, não é gravada. |
| RN-05 | **Progresso.** `tarefas concluídas ÷ (total − não aplicáveis)`, em porcentagem inteira. |
| RN-06 | **Conclusão.** Quando todas as tarefas, exceto as não aplicáveis, estão concluídas, a implantação passa a "concluída" e grava a data. Se uma tarefa for reaberta, a implantação volta a "em andamento". |
| RN-07 | **Não aplicável.** Só tarefas não obrigatórias podem ficar "não aplicável". |
| RN-08 | **Tempo médio.** Média de `data de conclusão − data do kickoff`, em dias, das implantações concluídas. Calculado só sobre os dados existentes. |
| RN-09 | **Responsável padrão.** Cada tarefa do modelo tem um tipo de responsável: *implantador* (vira o implantador da implantação), *cliente* (sem usuário interno) ou *admin*. Pode ser trocado por usuário específico na implantação. |
| RN-10 | **Cópia do modelo.** Ao criar a implantação, as tarefas são copiadas do modelo. Alterar o modelo depois não muda implantações já criadas. |
| RN-11 | **Alteração de prazo.** Exige motivo (texto) e gera registro de auditoria com data anterior e nova. |
| RN-12 | **Quem altera o quê.** Ver matriz abaixo. |
| RN-13 | **Link do cliente.** Token aleatório de 32 bytes, em base64url. O sistema guarda só o hash (SHA-256). Cada link dá acesso a uma única implantação, só leitura, expira em 60 dias (padrão) e pode ser revogado. Gerar novo link revoga o anterior. |
| RN-14 | **O que o cliente vê.** Nome da empresa, nome da etapa, progresso, tarefas marcadas como visíveis ao cliente (título, prazo, status e se a responsabilidade é dele) e as próximas pendências. Nunca vê comentários, histórico de auditoria, nomes de outros clientes nem tarefas internas. |
| RN-15 | **Auditoria.** São registrados: criação da implantação; mudança de status, prazo e responsável de tarefa; comentário criado; geração e revogação do link; alteração de configuração. Cada registro guarda quem, quando, o quê, valor anterior, valor novo e motivo (quando houver). Registros não podem ser editados nem apagados pela aplicação. |
| RN-16 | **Arquivamento.** Clientes e modelos são arquivados, não excluídos. Um cliente com implantação em andamento não pode ser arquivado. |
| RN-17 | **Senha.** Mínimo de 10 caracteres. |
| RN-18 | **Usuário desativado** não consegue entrar, mas seu histórico é preservado. |

## Matriz de permissões (RN-12)

| Ação | Admin | Implantador | Cliente (link) |
|---|:-:|:-:|:-:|
| Gerenciar usuários | ✅ | ❌ | ❌ |
| Configurar regra de atraso | ✅ | ❌ | ❌ |
| Criar/editar/arquivar modelos | ✅ | ❌ | ❌ |
| Ver modelos | ✅ | ✅ | ❌ |
| Criar/editar/arquivar clientes | ✅ | ✅ | ❌ |
| Criar implantação | ✅ | ✅ | ❌ |
| Alterar status de tarefa | ✅ | só se for o responsável da implantação ou da tarefa | ❌ |
| Ajustar prazo/responsável | ✅ | só se for o responsável da implantação | ❌ |
| Comentar em tarefa | ✅ | ✅ (em qualquer implantação) | ❌ |
| Ver histórico | ✅ | ✅ | ❌ |
| Ver painel e todas as implantações | ✅ | ✅ | ❌ |
| Gerar/revogar link do cliente | ✅ | só se for o responsável da implantação | ❌ |
| Ver portal da própria implantação | ❌ | ❌ | ✅ (leitura) |

A regra "Implantador comenta em qualquer implantação, mas só altera onde é responsável" vem da Reunião 3: o suporte precisa consultar e comentar, não editar.
