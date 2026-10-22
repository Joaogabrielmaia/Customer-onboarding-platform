# Ações manuais que dependem de você

**Objetivo:** lista única do que depende das minhas contas e de passos manuais.
**Data:** 2026-10-22 · **Status:** pendente
Relacionados: [Deploy](deploy.md) · [Go-live](01-plano-de-rollout.md)

Marque cada item ao concluir.

## A. Publicar o código

- [ ] Criar um repositório no GitHub (sugestão: `trilha-implantacao`, público).
- [ ] Conferir o autor dos commits: `git log --format="%an <%ae>" | sort -u`. Se não for o que você quer exibir no GitHub, configure `git config user.name` e `user.email` e, se necessário, reescreva o autor antes de publicar.
- [ ] Adicionar o remoto e enviar: `git remote add origin <url>` e `git push -u origin main`.
- [ ] Abrir a aba *Actions* e conferir o **primeiro resultado real do CI**. **Se falhar, me diga**; o que eu registrei foi a execução local, não a do GitHub.
- [ ] Depois do CI passar, trocar o selo do README (ver item F).

## B. Render

- [ ] Criar conta na Render e conectar o GitHub.
- [ ] **New → Blueprint**, escolher o repositório e aplicar (o `render.yaml` cria banco e serviço).
- [ ] Informar `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` (senha forte, 10+ caracteres).
- [ ] Esperar o primeiro build e abrir `/api/health`.

## C. Dados

- [ ] Decidir: com dados de exemplo (`SEED_EXAMPLE_DATA=true`, padrão) ou só o administrador (`false`).
- [ ] Lembrar que o banco gratuito da Render expira depois de algumas semanas (ver o [deploy](deploy.md)).

## E. Verificar no ar

- [ ] `/api/health` devolve `ok`.
- [ ] Login com o administrador que você definiu funciona.
- [ ] Um link de cliente gerado na tela abre sem login.
- [ ] Anotar o resultado real (e qualquer problema) para atualizar o README e o [runbook](../07-pos-go-live/runbook.md).

## F. Completar o README

- [ ] Colocar o link da aplicação no README.
- [ ] Trocar o selo do CI pelo do seu repositório.
- [ ] Conferir se o nome do titular na licença MIT está como você quer.

## G. Divulgação

- [ ] Conferir e ajustar os textos de [`docs/vitrine/`](../vitrine/) antes de publicar no LinkedIn e no currículo.

## H. Verificações que faltam

- [ ] Itens que eu não pude verificar e que valem uma olhada manual: teste de teclado e leitor de tela nas telas principais; abertura do portal em um celular real; Firefox e Safari. Registro em [limitações](../05-qualidade/03-limitacoes-conhecidas.md).
