# Entrevista: Fase 7 (deploy)

**Objetivo:** preparar respostas sobre publicação, configuração e operação mínima.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Deploy](../06-deploy-e-go-live/deploy.md) · [ADR-008](../03-arquitetura/adr/008-hospedagem.md)

> Preparei tudo para publicar, mas **a publicação depende das minhas contas** e está registrada como ação manual. Em entrevista, digo exatamente isso.

### 1. Como as migrations chegam ao banco de produção?
O `vercel.json` manda a Vercel usar `npm run vercel-build`, que roda `prisma migrate deploy`, `prisma generate` e `next build`. Assim cada deploy aplica as migrations pendentes antes de subir o app. Uso duas strings: `DATABASE_URL` com pooler para o app e `DIRECT_URL` sem pooler para as migrations, porque migrations não devem passar por pooler de transação. Se uma migration falhar, o build falha e a versão anterior continua no ar.

### 2. Por que o seed não roda sozinho no deploy?
Porque o seed apaga tudo. Rodar a cada deploy apagaria dados e é perigoso. Por isso é um comando manual e, em qualquer banco que não seja local, exige `SEED_CONFIRM_RESET=yes`; testei que ele recusa sem isso. Como as datas do seed são relativas a hoje, a demo envelhece, então deixei um workflow agendado opcional que recarrega os dados toda semana, desde que exista um segredo configurado.

### 3. Quais os limites de publicar uma demo com plano gratuito?
O banco gratuito suspende por inatividade, então a primeira visita pode demorar. O plano Hobby da Vercel é para uso não comercial: serve para portfólio, mas uso real da Rota Fácil exigiria plano pago, o que ultrapassa o teto de R$ 100/mês do fundador no cenário. Registrei isso no ADR e na estimativa de custo como um ponto a renegociar, e não como detalhe escondido.
