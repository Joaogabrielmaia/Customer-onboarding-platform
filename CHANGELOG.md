# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [Não lançado]

### Adicionado
- `npm run setup` para subir o banco local, aplicar as migrations e carregar o seed.

### Corrigido
- `.env.example` trazia `DIRECT_URL=""` e a migration falhava com "Connection url is empty" para quem copiasse o arquivo (D5). Agora a linha vem comentada e o `prisma.config.ts` usa `||`.
- Documentação: README, retrospectiva final e verificação em clone limpo.

## [1.1.0] - 2026-10-22

Evolução pós-lançamento definida na [retrospectiva simulada](docs/07-pos-go-live/reuniao-6-retrospectiva.md).

### Adicionado
- **Exportar o relatório da implantação em CSV** (botão "Exportar CSV" no detalhe da implantação): uma linha por tarefa, com responsável, prazo, prazo original, status, situação do prazo e dias de atraso. (RF-20)
- **Exportar a lista de implantações em CSV**, respeitando os filtros da tela. (RF-20)
- Script `npm run admin:reset-password` para redefinir a senha de um usuário pelo terminal (citado no [runbook](docs/07-pos-go-live/runbook.md)).

### Segurança
- O CSV **neutraliza injeção de fórmula**: texto que começa com `=`, `+`, `-`, `@` ou tab recebe um apóstrofo, pois o Excel e o Calc o interpretariam como fórmula.
- A rota de download responde **401** sem sessão (em vez de redirecionar) e **403** sem permissão.
- O relatório não inclui comentários nem o histórico de auditoria.

### Detalhes
- Separador `;` e BOM UTF-8, para abrir com acentos no Excel em português.
- Testes novos: 6 unitários, 6 de integração e 3 E2E. Total na execução local: 156 testes passando.

### Fora desta versão (de propósito)
- Exportação em PDF; alerta de atraso por e-mail; concluir tarefas em lote. Ver [roadmap](docs/07-pos-go-live/roadmap.md).

## [1.0.0] - 2026-10-22

Primeira versão: o MVP.

### Adicionado
- Login por e-mail e senha com sessão própria; papéis Administrador e Implantador; autorização no servidor.
- Cadastro de clientes e de usuários.
- Modelos de implantação com etapas e tarefas, prazo relativo (D+n), responsável padrão, obrigatoriedade e visibilidade ao cliente.
- Implantação criada a partir de um modelo, com datas calculadas, status, responsável, comentários e histórico de alterações.
- Painel com implantações em andamento, atrasadas, aguardando cliente e concluídas, tempo médio das concluídas, filtro por implantador e fila de pendências.
- Regra de atraso configurável.
- Portal do cliente por link com token (leitura, com expiração e revogação) e mensagem pronta para enviar o link.
- Seed com dados de exemplo; healthcheck e logs mínimos.
- Testes (46 unitários, 64 de integração e 31 E2E) e workflow de CI.

### Corrigido durante a construção
- Ids repetidos em campos de formulário; mensagem de erro duplicada; rolagem horizontal no celular em `/clientes`; ajuste de prazo sem mudança dizia "salvo". Ver [resultado da execução](docs/05-qualidade/02-resultado-da-ultima-execucao.md).
