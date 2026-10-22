# Entrevista: Fase 3 (arquitetura e decisões)

**Objetivo:** preparar respostas sobre as decisões técnicas.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [ADRs](../03-arquitetura/adr/) · [Segurança](../03-arquitetura/seguranca-e-privacidade.md)

### 1. Por que você não usou Auth.js (NextAuth)?
O requisito era desativar um usuário e isso valer na hora. Com o provedor de credenciais do Auth.js a sessão é um JWT, então eu teria de consultar o banco a cada requisição de qualquer forma, e perderia a vantagem. Com sessão própria (cookie opaco e tabela `Session`) o logout e a desativação são imediatos e são poucas linhas que consigo explicar. O custo é eu responder pelos detalhes de segurança; mitiguei com cookie `httpOnly`, hash do token no banco e senha com scrypt. Se precisasse de login social ou MFA, usaria Auth.js ou um provedor gerenciado.

### 2. Como você garante que o implantador não altera o que não deve, se alguém chamar a Server Action direto?
A autorização não está na interface. Todo serviço começa com `assertCan(ator, ação, recurso)`, uma função pura que implementa a matriz de permissões, e a Server Action chama o serviço. Esconder um botão é só conveniência. Cada serviço tem teste do caso negado. O ponto fraco que reconheço é esquecer a chamada em um serviço novo; o checklist da Definition of Done e os testes por serviço mitigam, mas não eliminam.

### 3. Por que copiar as tarefas do modelo para cada implantação em vez de referenciar o modelo?
Porque uma implantação registra o que foi combinado com aquele cliente. Se o modelo mudasse e alterasse implantações em andamento, o histórico e os prazos perderiam sentido. A cópia custa duplicação e impede que correções do modelo cheguem às implantações existentes, e aceito isso. Também guardo `originalDueDate` ao lado de `dueDate` para mostrar o quanto um prazo foi movido. Se dependências entre tarefas ficarem comuns, adiciono `dependsOnTaskId` e uma função de recálculo.
