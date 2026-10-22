# Entrevista: Fase 7 (deploy)

**Objetivo:** preparar respostas sobre publicação, configuração e operação mínima.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Deploy](../06-deploy-e-go-live/deploy.md) · [ADR-008](../03-arquitetura/adr/008-hospedagem.md)

### 1. Como as migrations chegam ao banco de produção?
O comando de start na Render (`npm run start:render`) roda `prisma migrate deploy`, depois um bootstrap e só então `next start`. Assim cada subida aplica as migrations pendentes antes de atender requisições. Uso `render.yaml` (Blueprint) para criar o banco e o serviço juntos e ligar a `DATABASE_URL` automaticamente. Se a migration falhar, o serviço não sobe e a versão anterior continua no ar.

### 2. Como o primeiro usuário é criado sem terminal?
O plano gratuito da Render não tem shell, então escrevi um bootstrap que roda a cada subida e só age se o banco não tiver nenhum usuário: cria o administrador a partir de variáveis de ambiente ou carrega os dados de exemplo. Em reinícios ele não faz nada, então nunca apaga dados. Testei os casos: banco vazio, banco já com usuários e senha curta.

### 3. Quais os limites do plano gratuito?
O serviço web dorme sem acesso e a primeira visita seguinte demora; o banco gratuito expira depois de algumas semanas, então para manter o ambiente é preciso um plano pago. Uso comercial pela Rota Fácil também exigiria plano pago, o que ultrapassa o teto de R$ 100/mês do fundador no cenário. Registrei isso no ADR e na estimativa de custo.
