# Limitações conhecidas

**Objetivo:** listar com franqueza o que a Trilha não faz, não testa ou faz de forma limitada.
**Data:** 2026-10-22 · **Status:** concluído (atualizar a cada versão)
Relacionados: [Resultado da execução](02-resultado-da-ultima-execucao.md) · [Segurança](../03-arquitetura/seguranca-e-privacidade.md) · [Escopo](../02-definicao/05-priorizacao-e-escopo.md)

## Produto

| Limitação | Motivo / efeito |
|---|---|
| Sem notificações por e-mail ou WhatsApp | Custo e prazo (R1-05, R1-06); fora do MVP |
| Sem recuperação de senha por e-mail | O admin redefine a senha |
| Prazos não consideram feriados | Só fim de semana (RN-01) |
| Sem dependência entre tarefas | Ajuste manual com motivo (CH-06) |
| Exportação só em CSV; sem PDF | CSV abre no Excel e é simples de testar (v1.1.0) |
| Um único fuso (America/Sao_Paulo) e um único idioma (pt-BR) | Cenário de uma empresa brasileira |
| Sem política automática de retenção nem anonimização de contato | LGPD básica só no desenho |

## Segurança

- Sem limite de tentativas de login nem de acessos ao portal (apenas o custo do scrypt).
- Sem autenticação em dois fatores.
- A auditoria é imutável por convenção da aplicação, não por permissão do banco (ADR-005).
- Quem tem o link do cliente acessa o portal; o conteúdo exposto é pouco sensível por desenho (ADR-007).
- As contas criadas pelo seed têm senhas fixas em `src/server/seed-data.ts`: servem só para desenvolvimento e teste. Num uso real, trocar.

## Qualidade e testes

- **Cobertura de código não medida.**
- Testes automatizados só em **Chromium**. Firefox, Safari e celular físico não testados.
- **Acessibilidade:** só o axe automático. Não fiz teste manual completo de teclado nem com leitor de tela.
- **Não testado automaticamente:** estado vazio do painel (US-09 CA5), preservação do histórico de usuário desativado na tela (US-03 CA3) e atomicidade da transação de auditoria sob falha (os testes provam que o registro existe junto com a mudança, não que tudo reverte se o registro falhar).
- Sem teste de carga ou desempenho. A meta de 2 s (RNF-01) é uma hipótese não medida.
- O CI (GitHub Actions) roda só Chromium em Linux. Primeira execução em 2026-10-23: falha em um teste E2E do portal (D6); execução de 2026-10-24: verde ([registro](05-execucao-ci-2026-10-24.md)).
- O projeto **não está hospedado**: roda apenas localmente (Docker + `npm run dev`). Não há ambiente online, nem teste com usuários reais.
