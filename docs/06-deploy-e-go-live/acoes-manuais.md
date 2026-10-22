# Ações manuais que dependem de você

**Objetivo:** lista única do que eu não consigo fazer (não tenho acesso às suas contas) e que falta para o projeto ficar completo.
**Data:** 2026-10-22 · **Status:** pendente
Relacionados: [Deploy](deploy.md) · [Go-live](01-plano-de-rollout.md)

Marque cada item ao concluir.

## A. Publicar o código

- [ ] Criar um repositório no GitHub (sugestão: `trilha-implantacao`, público).
- [ ] Conferir o autor dos commits: `git log --format="%an <%ae>" | sort -u`. Se não for o que você quer exibir no GitHub, configure `git config user.name` e `user.email` e, se necessário, reescreva o autor antes de publicar.
- [ ] Adicionar o remoto e enviar: `git remote add origin <url>` e `git push -u origin main`.
- [ ] Abrir a aba *Actions* e conferir o **primeiro resultado real do CI**. **Se falhar, me diga**; o que eu registrei foi a execução local, não a do GitHub.
- [ ] Depois do CI passar, trocar o selo do README (ver item F).

## B. Banco de dados (Neon)

- [ ] Criar conta e projeto na Neon.
- [ ] Copiar a string **com pooler** (`DATABASE_URL`) e a **sem pooler** (`DIRECT_URL`).

## C. Hospedagem (Vercel)

- [ ] Criar conta e importar o repositório.
- [ ] Cadastrar as variáveis: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (gere com `openssl rand -base64 32`), `APP_URL`, `DEMO_MODE=true`.
- [ ] Fazer o deploy (a migration roda sozinha no build).

## D. Dados de demonstração

- [ ] Rodar o seed contra a Neon (passo 3 do [deploy](deploy.md)).
- [ ] Opcional: criar o segredo `DEMO_DATABASE_URL` no GitHub para recarregar a demo toda semana.

## E. Verificar no ar

- [ ] `/api/health` devolve `ok`.
- [ ] Login com as duas contas de demonstração funciona.
- [ ] O link de cliente de demonstração abre sem login.
- [ ] Anotar o resultado real (e qualquer problema) para atualizar o README e o [runbook](../07-pos-go-live/runbook.md).

## F. Completar o README

- [ ] Preencher o link da demonstração (`[PREENCHER: URL da Vercel]`).
- [ ] Trocar o selo do CI pelo do seu repositório.
- [ ] Preencher a seção **"Como isso se conecta à minha experiência real"** (`[ESPAÇO PARA EU PREENCHER]`). **Não escrevi essa parte de propósito**: ela precisa ser verdadeira e só você sabe.
- [ ] Conferir se o nome do titular na licença MIT está como você quer.

## G. Vídeo e divulgação

- [ ] Gravar o vídeo de 2 minutos com o [roteiro](03-roteiro-video-demo.md) e colocar o link no README.
- [ ] Conferir e ajustar os textos de [`docs/vitrine/`](../vitrine/) antes de publicar no LinkedIn e no currículo.

## H. Se algo não saiu como o esperado

- [ ] Itens que eu não pude verificar e que valem uma olhada manual: teste de teclado e leitor de tela nas telas principais; abertura do portal em um celular real; Firefox e Safari. Registro em [limitações](../05-qualidade/03-limitacoes-conhecidas.md).
