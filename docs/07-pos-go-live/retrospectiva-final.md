# Retrospectiva final

**Objetivo:** olhar para o projeto inteiro: o que fiz bem, o que faria diferente e o que aprendi.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Resultado da execução](../05-qualidade/02-resultado-da-ultima-execucao.md) · [Roadmap](roadmap.md) · [Perguntas de entrevista](../entrevista/)

> Escrita em primeira pessoa sobre **este projeto**, com base no que está no repositório. Não é sobre a minha experiência profissional anterior; essa conexão fica para eu preencher no README.

## O que fiz bem

- **Comecei pelo problema, não pela tela.** O discovery e a definição vieram antes do código, e várias decisões do produto só existem por causa deles: o status "aguardando cliente" separado do atraso, o portal por link sem login, o WhatsApp fora do MVP.
- **Mantive a rastreabilidade.** Dá para sair de uma regra (RN), passar pela história e chegar ao teste e à tela. Isso me deixa responder "por que isto existe?" e "isto tem teste?".
- **Regras importantes ficaram em funções puras**, com testes de borda (fim de semana, virada de ano, tolerância). Foi onde mais fácil errar, e onde o teste mais compensou.
- **Testei contra um PostgreSQL real**, não contra mock, e verifiquei também o que **não** pode aparecer (o portal não vaza comentário nem tarefa interna).
- **Fui honesto nos documentos.** Registrei o que falhou, o que não testei e o que depende de contas minhas. O resultado de teste que cito é o que saiu do terminal.
- **Recusei escopo com justificativa** (cliente escrever no portal sem login) e deixei o caminho para a v2.

## O que eu faria diferente

- **Sprints de verdade.** Construí na ordem das dependências (domínio, serviços, telas) e não em três blocos separados no tempo. Para um projeto solo foi eficiente, mas o histórico não mostra o ritmo de sprints que o backlog descreve. Eu teria feito commits por história desde o primeiro serviço.
- **Explorar o produto cedo, em tela pequena.** Os defeitos de rolagem horizontal e de ajuste sem mudança apareceram só no fim, na exploração do UAT. Uma passada exploratória a cada sprint teria achado antes.
- **Teste manual de acessibilidade.** Rodei o axe, que é útil, mas não fiz teclado e leitor de tela de forma sistemática. Está registrado como pendência, e eu o incluiria na Definition of Done.
- **Medir desempenho e cobertura.** Declarei metas (RNF-01) que não medi. Prefiro dizer "não medi" a inventar, mas o ideal seria medir.
- **Rodar o CI no GitHub antes de escrever "CI" nos documentos.** Escrevi o workflow e testei os mesmos comandos localmente, mas o primeiro resultado real no GitHub ainda não existe.
- **Um teste de falha na transação de auditoria.** Provei que o registro existe junto com a mudança, não que tudo reverte se o registro falhar.

## O que aprendi

- **Pedido vago vira requisito com uma boa pergunta.** "Painel bonito" virou "quais estão atrasadas, de quem e há quanto tempo".
- **Contradição entre stakeholders não se resolve escolhendo um lado.** A pergunta "se só pudesse entregar três campos, quais seriam?" fez o implantador e a líder convergirem.
- **O que o sistema esconde importa tanto quanto o que mostra.** O trabalho mais cuidadoso do portal foi garantir o que não aparece.
- **Dado de demonstração precisa de design.** Datas relativas a hoje e cenários com pivô fazem a demo sempre mostrar atrasada, aguardando e concluída.
- **Segurança tem detalhes pequenos e concretos:** hash do token, mensagem única de login, injeção de fórmula em CSV, rota de arquivo respondendo 401.
- **Testes sobrevivem a mudanças de plano:** a primeira rodada do E2E teve 8 falhas e todas eram do teste. Foi útil separar "o produto está errado" de "meu seletor está ruim".
- **Honestidade rende:** documentar limitações e o que não foi verificado deixa o restante mais confiável.

## Próximos passos pessoais (fora do repositório)

Executar as [ações manuais](../06-deploy-e-go-live/acoes-manuais.md), ver o primeiro CI rodar no GitHub, gravar o vídeo e preencher a conexão com a minha experiência real no README.
