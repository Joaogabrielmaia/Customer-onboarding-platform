# Histórias de usuário e critérios de aceite

**Objetivo:** descrever o comportamento esperado em Dado/Quando/Então, para guiar a implementação e o UAT.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Requisitos](02-requisitos.md) · [Regras](03-regras-de-negocio.md) · [Rastreabilidade](08-rastreabilidade.md)

Cada história indica os requisitos (RF), as regras (RN) e a sprint.

### US-01 Entrar no sistema (RF-01, RF-02, RN-17, RN-18) · Sprint 1
Como usuário interno, quero entrar com e-mail e senha para acessar apenas o que meu papel permite.
- **CA1** Dado um usuário ativo, quando informa e-mail e senha corretos, então vai para o painel.
- **CA2** Dado qualquer usuário, quando informa senha errada, então vê "E-mail ou senha incorretos" sem revelar qual deles falhou.
- **CA3** Dado um usuário desativado, quando tenta entrar, então é recusado com a mesma mensagem.
- **CA4** Dado um visitante sem sessão, quando abre uma página interna, então é levado ao login.

### US-02 Gerenciar clientes (RF-03, RN-16) · Sprint 1
Como implantador, quero cadastrar clientes para poder iniciar implantações.
- **CA1** Dado o formulário com empresa, contato, e-mail do contato, plano e data de contrato válidos, quando salvo, então o cliente aparece na lista.
- **CA2** Dado um campo obrigatório vazio, quando salvo, então vejo a mensagem do campo e nada é gravado.
- **CA3** Dado um cliente com implantação em andamento, quando tento arquivar, então o sistema recusa e explica o motivo.

### US-03 Gerenciar usuários (RF-17, RN-18) · Sprint 1
Como admin, quero criar e desativar usuários para controlar quem acessa.
- **CA1** Dado um admin, quando cria um implantador com senha de 10+ caracteres, então o usuário consegue entrar.
- **CA2** Dado um implantador, quando abre a tela de usuários, então recebe acesso negado.
- **CA3** Dado um usuário desativado, então o histórico dele permanece visível nas implantações.

### US-04 Criar modelo de implantação (RF-04, RF-05, RN-07, RN-09) · Sprint 2
Como admin, quero montar um modelo com etapas e tarefas para padronizar as implantações.
- **CA1** Dado um modelo novo, quando adiciono etapa "Dados do cliente" e tarefa "Receber planilha de produtos" com D+7, responsável cliente e obrigatória, então ela é salva na ordem.
- **CA2** Dado uma tarefa com prazo negativo, quando salvo, então o sistema recusa.
- **CA3** Dado um implantador, quando tenta editar um modelo, então a ação é negada no servidor.

### US-05 Iniciar implantação (RF-06, RN-01, RN-09, RN-10) · Sprint 2
Como implantador, quero criar a implantação de um cliente a partir de um modelo e ver as datas calculadas.
- **CA1** Dado cliente, modelo, implantador e kickoff na segunda 2026-03-02, quando crio, então a tarefa D+3 vence na quinta 2026-03-05.
- **CA2** Dado kickoff na quinta 2026-03-05 e tarefa D+3 (cai no domingo), então o prazo é segunda 2026-03-09.
- **CA3** Dado que alterei o modelo depois, então a implantação já criada não muda.
- **CA4** Dado uma tarefa de responsável "cliente", então ela nasce sem usuário interno e marcada como do cliente.

### US-06 Atualizar tarefas (RF-07, RN-05, RN-06, RN-07, RN-12) · Sprint 2
Como implantador, quero mudar o status das tarefas para refletir o andamento.
- **CA1** Dado uma tarefa pendente, quando marco como concluída, então o progresso é recalculado e o evento é auditado.
- **CA2** Dado a última tarefa pendente, quando a concluo, então a implantação fica "concluída" com a data de hoje.
- **CA3** Dado uma tarefa obrigatória, quando tento marcar "não aplicável", então o sistema recusa.
- **CA4** Dado um implantador que não é o responsável da implantação, quando tenta alterar o status, então a ação é negada.

### US-07 Ajustar prazo e responsável (RF-08, RN-11) · Sprint 2
Como implantador, quero ajustar um prazo informando o motivo.
- **CA1** Dado uma tarefa, quando altero o prazo com motivo, então o histórico registra data anterior, nova data, motivo e autor.
- **CA2** Dado a mesma alteração sem motivo, então o sistema recusa.

### US-08 Comentar e ver histórico (RF-09, RF-10, RN-14, RN-15) · Sprint 2
Como suporte, quero consultar o que foi combinado e comentar nas tarefas.
- **CA1** Dado uma tarefa, quando comento, então o comentário aparece com autor e data e entra no histórico.
- **CA2** Dado um implantador que não é o responsável, quando comenta, então é permitido.
- **CA3** Dado o histórico, então registros aparecem do mais recente ao mais antigo e não podem ser editados.

### US-09 Ver o painel (RF-11, RF-13, RN-02 a RN-05, RN-08) · Sprint 3
Como fundador, quero abrir uma tela e ver o que está atrasado.
- **CA1** Dado implantações em estados variados, quando abro o painel, então vejo as contagens de em andamento, atrasadas e concluídas.
- **CA2** Dado uma implantação com tarefa vencida da equipe, então ela aparece em destaque como atrasada, com o responsável e os dias de atraso.
- **CA3** Dado uma tarefa vencida aguardando cliente, então não conta como atraso da equipe e aparece como "aguardando cliente".
- **CA4** Dado implantações concluídas, então o tempo médio é exibido com a indicação de que se baseia nos dados existentes.
- **CA5** Dado nenhuma implantação, então vejo um estado vazio explicativo.

### US-10 Ver minhas pendências (RF-12) · Sprint 3
Como implantador, quero uma fila das minhas tarefas para não esquecer nada.
- **CA1** Dado tarefas minhas em aberto, quando abro "Minhas pendências", então vejo primeiro as mais atrasadas.
- **CA2** Dado o painel de admin, então vejo a fila agrupada por implantador.

### US-11 Configurar regra de atraso (RF-13, RN-02) · Sprint 3
Como admin, quero definir uma tolerância de dias para atraso.
- **CA1** Dado tolerância de 2 dias, quando uma tarefa venceu há 1 dia, então não é atraso; com 3 dias, é.
- **CA2** Dado um implantador, quando tenta alterar a configuração, então a ação é negada.

### US-12 Compartilhar o link com o cliente (RF-15, RN-13) · Sprint 3
Como implantador, quero gerar e revogar o link do cliente.
- **CA1** Dado uma implantação, quando gero o link, então o endereço completo é mostrado uma única vez.
- **CA2** Dado um link existente, quando gero outro, então o anterior deixa de funcionar.
- **CA3** Dado um link revogado ou expirado, quando o cliente abre, então vê uma mensagem amigável pedindo um novo link, sem revelar dados.

### US-13 Cliente acompanha a implantação (RF-14, RN-14) · Sprint 3
Como cliente, quero ver o progresso e o que vem agora pelo celular, sem criar conta.
- **CA1** Dado um link válido, quando abro, então vejo o nome da empresa, a barra de progresso e as próximas pendências.
- **CA2** Dado tarefas internas e comentários, então nada disso aparece.
- **CA3** Dado um token inexistente, então vejo a mesma mensagem de link inválido.
- **CA4** Dado uma tela de 360 px de largura, então tudo é legível sem rolagem horizontal.

### US-14 Dados de exemplo (RF-16) · Sprint 1 e 3
Como usuário, quero encontrar dados de exemplo realistas para conhecer o sistema.
- **CA1** Dado o seed rodado, então existem cerca de 8 clientes, 3 modelos e implantações no prazo, atrasadas e concluídas.
- **CA2** Dado o seed, então os CNPJs são de exemplo, claramente inválidos.
