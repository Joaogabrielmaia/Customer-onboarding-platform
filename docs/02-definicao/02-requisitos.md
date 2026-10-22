# Requisitos funcionais e não funcionais

**Objetivo:** listar o que a Trilha deve fazer (RF) e com que qualidade (RNF), com origem rastreável.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Regras de negócio](03-regras-de-negocio.md) · [Histórias](04-historias-de-usuario.md) · [Rastreabilidade](08-rastreabilidade.md)

> A coluna "Origem" aponta para evidências do [discovery](../01-discovery/) (reuniões simuladas).

## Requisitos funcionais

| ID | Requisito | Origem | MoSCoW |
|---|---|---|---|
| RF-01 | Autenticar usuários internos com e-mail e senha | Premissa do projeto | Must |
| RF-02 | Aplicar papéis (Admin, Implantador) no servidor em toda operação | R2-10, premissa | Must |
| RF-03 | Cadastrar, editar, listar e arquivar clientes (empresa, contato, plano, data de contrato) | Premissa | Must |
| RF-04 | Criar, editar e arquivar modelos de implantação | R2-01, R2-02 | Must |
| RF-05 | Definir em cada modelo etapas e tarefas com prazo relativo (D+n), responsável padrão, obrigatoriedade e visibilidade ao cliente | R2-02, R2-08, R3 (decisão) | Must |
| RF-06 | Criar uma implantação para um cliente a partir de um modelo, informando implantador e data do kickoff, com datas calculadas | R2-08, R1-01 | Must |
| RF-07 | Alterar o status de uma tarefa (pendente, em andamento, aguardando cliente, concluída, não aplicável) | R1-04, R2-03 | Must |
| RF-08 | Ajustar prazo e responsável de uma tarefa, com motivo registrado | R2-08 | Must |
| RF-09 | Comentar em tarefas (comentários internos) | R2-05, R3-01 | Must |
| RF-10 | Consultar o histórico de alterações de uma implantação (auditoria) | R2-05, R3-01 | Must |
| RF-11 | Exibir painel com implantações em andamento, atrasadas e concluídas, progresso por cliente e tempo médio de implantação | R1-01, R1-03, R1-08 | Must |
| RF-12 | Exibir fila de pendências por implantador, ordenada por atraso | R2-09 | Must |
| RF-13 | Configurar a regra de atraso (tolerância em dias) e destacar visualmente o atraso | Premissa, R1-04 | Must |
| RF-14 | Exibir ao cliente, por link com token, o progresso e as próximas etapas em modo leitura | R1-07, R3-05 | Must |
| RF-15 | Gerar, renovar e revogar o link do cliente | R3-06 | Must |
| RF-16 | Carregar dados de demonstração (seed) | Premissa | Must |
| RF-17 | Gerenciar usuários internos (criar, desativar, definir papel) | Premissa | Should |
| RF-18 | Filtrar o painel e a lista de implantações por status, implantador e cliente | R1-03, M4-02 | Must |
| RF-19 | Mostrar, ao gerar o link do cliente, uma mensagem pronta com o link para copiar | M4-03 | Should |

## Requisitos não funcionais

| ID | Categoria | Requisito | Verificação |
|---|---|---|---|
| RNF-01 | Desempenho | As páginas principais devem responder rápido com o volume do seed. **Meta (hipótese): menos de 2 s no carregamento.** | Medição manual na demo; não prometo resultado |
| RNF-02 | Segurança | Autorização verificada no servidor em toda leitura e escrita; esconder botão na interface não conta | Testes de permissão (unitários e de API) |
| RNF-03 | Segurança | Senhas guardadas com hash lento e salgado; nunca em texto | Revisão de código + teste |
| RNF-04 | Segurança | Toda entrada validada com Zod no servidor | Testes de API com entrada inválida |
| RNF-05 | Segurança | Token do cliente: aleatório, só o hash fica no banco, expira e pode ser revogado | Testes do portal |
| RNF-06 | Usabilidade | Uso fluido no celular, em especial o portal do cliente. Estados de carregamento, vazio e erro tratados | E2E em viewport mobile |
| RNF-07 | Acessibilidade | Foco visível, rótulos em todos os campos, contraste adequado, navegação por teclado (referência: WCAG 2.2 AA, sem prometer certificação) | Checklist manual + verificação automatizada onde possível |
| RNF-08 | Disponibilidade | Demonstração em plano gratuito, sem SLA. Healthcheck disponível | Endpoint `/api/health` |
| RNF-09 | LGPD básica | Coletar só o necessário; sem dados sensíveis; contato do cliente é dado pessoal e pode ser corrigido ou anonimizado; dados de demonstração fictícios | Revisão documentada na Fase 3 |
| RNF-10 | Observabilidade | Logs mínimos de erros e de eventos de segurança, sem dados pessoais nem segredos | Revisão de código |
| RNF-11 | Manutenibilidade | Lint, tipos e testes rodando no CI a cada push | GitHub Actions |
| RNF-12 | Consistência | Alterações que afetam várias tabelas (ex.: status + auditoria) ocorrem na mesma transação | Testes de integração |
