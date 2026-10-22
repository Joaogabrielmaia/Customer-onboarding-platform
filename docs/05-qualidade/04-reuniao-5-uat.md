# Reunião 5: teste de aceitação (UAT) com a líder de implantação

**Objetivo:** executar os critérios de aceite da Fase 2 no sistema real e registrar o que passou e o que falhou.
**Data:** 2026-10-22 (documento) · **Status:** concluído
Participantes: Camila Tavares (líder de implantação) e eu
Relacionados: [Histórias e critérios](../02-definicao/04-historias-de-usuario.md) · [Resultado da execução](02-resultado-da-ultima-execucao.md) · [Limitações](03-limitacoes-conhecidas.md)

> Reunião simulada com o Claude (Anthropic) no papel dos stakeholders, a partir do meu briefing. Pessoas e empresa fictícias.
>
> **O que é real e o que é roteiro:** a conversa com a Camila foi simulada com o Claude. Os **resultados dos critérios e os problemas abaixo são reais**: eu executei cada critério no sistema (por teste automatizado ou pela exploração manual descrita) e os defeitos D3 e D4 foram de fato encontrados e corrigidos. Nenhum defeito foi inventado para dar drama ao UAT.

## Transcrição (trechos)

**João:** Camila, vamos passar pelos critérios de aceite, história por história. Eu faço a ação, você confirma se é o que esperava.

**Camila:** Começa pelo painel. É o que o Ricardo vai olhar.

**João:** (abre o painel como administradora) Cinco em andamento, duas atrasadas, uma aguardando cliente, duas concluídas.

**Camila:** A Serra Azul está em oito dias de atraso e a Vale Verde aparece separada, como aguardando cliente. Isso bate com o que combinamos. Agora abre no celular.

**João:** (abre a lista de clientes em 390 px) A tela rola para o lado.

**Camila:** Rola mesmo. Isso eu não aceito, o implantador vai usar no carro, na porta do cliente.

> **Defeito real D3.** Primeiro registro: a página `/clientes` tinha 53 px de rolagem horizontal. Causa: o cabeçalho de tabela `sr-only` é posicionado de forma absoluta e escapava do contêiner com rolagem. Corrigi e criei `responsive.spec.ts`, que percorre 11 telas em 390 px.

**Camila:** Agora ajusta um prazo. Muda sem motivo.

**João:** Recusa e pede o motivo. Agora com motivo: salvou, e a tarefa mostra o prazo original ao lado.

**Camila:** E se eu clicar em salvar sem mudar nada?

**João:** (clica) Responde "Ajuste salvo."

**Camila:** Mas não mudou nada. Isso engana quem lê o histórico depois.

> **Defeito real D4.** O serviço aceitava um ajuste sem alteração e a tela dizia que salvou. Passou a recusar com "Nenhuma alteração para salvar". Teste de regressão em integração e em E2E.

**Camila:** Último: o link do cliente. Gera, abre numa janela sem login.

**João:** O cliente vê o andamento e o que depende dele, sem comentários nem tarefas internas. Revogo, e o link deixa de abrir.

**Camila:** Beleza. Aceito. Mas na semana que vem eu vou querer tirar um relatório disso para mostrar ao cliente.

**João:** Anotei como candidato à primeira evolução depois do lançamento.

## Resultado por critério de aceite

Legenda: ✅ passou · ⚠️ passou depois de correção · ➖ não verificado.

| História | Critério | Resultado | Como foi verificado |
|---|---|:-:|---|
| US-01 | CA1 entrar com credenciais corretas | ✅ | integração (`auth.test.ts`) e E2E |
| US-01 | CA2 mensagem única para senha errada | ✅ | integração e E2E |
| US-01 | CA3 usuário desativado recusado | ✅ | integração |
| US-01 | CA4 sem sessão vai ao login | ✅ | E2E |
| US-02 | CA1 cadastrar cliente | ✅ | integração e E2E |
| US-02 | CA2 erro por campo sem gravar | ✅ | integração e E2E |
| US-02 | CA3 arquivar com implantação em andamento | ✅ | integração e E2E |
| US-03 | CA1 admin cria usuário que entra | ✅ | integração |
| US-03 | CA2 implantador sem acesso | ✅ | integração e E2E |
| US-03 | CA3 histórico do desativado visível | ➖ | não testado explicitamente |
| US-04 | CA1 criar modelo com etapa e tarefa | ✅ | integração e E2E |
| US-04 | CA2 prazo negativo recusado | ✅ | integração e E2E |
| US-04 | CA3 implantador não edita modelo | ✅ | integração e E2E |
| US-05 | CA1, CA2 datas calculadas (inclui fim de semana) | ✅ | unitário, integração e E2E |
| US-05 | CA3 modelo alterado não afeta implantação | ✅ | integração |
| US-05 | CA4 tarefa do cliente sem usuário interno | ✅ | integração e E2E |
| US-06 | CA1 status recalcula progresso e audita | ✅ | integração e E2E |
| US-06 | CA2 última tarefa conclui a implantação | ✅ | integração |
| US-06 | CA3 obrigatória não vira "não aplicável" | ✅ | integração |
| US-06 | CA4 não responsável negado | ✅ | integração e E2E |
| US-07 | CA1 prazo com motivo audita | ✅ | integração e E2E |
| US-07 | CA2 prazo sem motivo recusado | ✅ | integração e E2E |
| US-07 | (extra) ajuste sem mudança | ⚠️ | D4 |
| US-08 | CA1, CA2 comentar e entrar no histórico | ✅ | integração e E2E |
| US-08 | CA3 histórico em ordem e não editável | ✅ | integração (ordem); não existe função de edição |
| US-09 | CA1 contagens | ✅ | integração e E2E |
| US-09 | CA2, CA3 atraso em destaque e espera do cliente | ✅ | integração e E2E |
| US-09 | CA4 tempo médio | ✅ | integração e E2E |
| US-09 | CA5 estado vazio do painel | ➖ | não testado automaticamente |
| US-10 | CA1, CA2 fila ordenada e por implantador | ✅ | unitário, integração e E2E |
| US-11 | CA1, CA2 tolerância e só admin | ✅ | unitário e integração |
| US-12 | CA1 link mostrado uma vez | ✅ | E2E |
| US-12 | CA2 novo link revoga o anterior | ✅ | integração |
| US-12 | CA3 revogado ou expirado, mensagem amigável | ✅ | integração e E2E |
| US-13 | CA1, CA2, CA3 portal sem dados internos, token inválido | ✅ | integração e E2E |
| US-13 | CA4 sem rolagem horizontal em tela pequena | ✅ | E2E em 360 px (o defeito D3 estava em outra tela, `/clientes`) |
| US-14 | CA1, CA2 seed variado e fictício | ✅ | integração |
| RNF-06 | Telas internas sem rolagem horizontal em 390 px | ⚠️ | D3 |
| RNF-07 | Regras automáticas de acessibilidade | ✅ | axe em 6 telas (D1 corrigido antes) |

**Resumo:** a tabela tem 39 linhas (algumas agrupam mais de um critério). **35 passaram sem correção, 2 passaram depois de correção (D3 e D4) e 2 não foram verificados.** O defeito D1 (ids repetidos) foi achado e corrigido antes desta rodada, e os defeitos completos estão no [resultado da execução](02-resultado-da-ultima-execucao.md).

## Decisão da líder (roteiro)

Aceita para o piloto, com a ressalva de ver exportação de relatório na primeira evolução. Verificação manual de teclado e leitor de tela ficou como pendência registrada nas [limitações](03-limitacoes-conhecidas.md).
