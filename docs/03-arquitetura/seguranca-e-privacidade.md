# Segurança e privacidade

**Objetivo:** registrar as medidas de segurança e privacidade do projeto e o que ficou de fora.
**Data:** 2026-10-22 · **Status:** concluído (revisar na Fase 6, com o que foi realmente implementado)
Relacionados: [ADR-002](adr/002-autenticacao.md) · [ADR-006](adr/006-controle-de-acesso.md) · [ADR-007](adr/007-portal-por-token.md) · RNF-02 a RNF-05, RNF-09

> Este não é um laudo de segurança. É a lista do que projetei e do que consigo verificar com testes. Não afirmo que o sistema é "seguro", apenas que estas medidas existem.

## Medidas

| Tema | Medida | Onde se verifica |
|---|---|---|
| Autorização | Verificada no **servidor**, em todo serviço, com `can()` (ADR-006); a interface só esconde opções | Testes de permissão e de acesso negado |
| Autenticação | Sessão com token aleatório em cookie `httpOnly`, `sameSite=lax`, `secure` em produção; hash do token no banco; expiração; logout apaga a sessão | Testes de login e de sessão |
| Senha | scrypt (N=2^15, r=8, p=3) com sal; mínimo de 10 caracteres; mensagem de erro única para e-mail ou senha incorretos | Teste unitário do hash |
| Validação | Zod dentro de cada serviço (`parseInput`), então a regra vale mesmo para quem chamar o serviço sem passar pela tela | Testes com entradas inválidas |
| Injeção | Acesso a dados só via Prisma (consultas parametrizadas); sem SQL montado com texto do usuário | Revisão de código |
| XSS | React escapa por padrão; não uso `dangerouslySetInnerHTML`; comentários são texto puro | Revisão de código |
| CSRF | Server Actions do Next verificam a origem; cookie `sameSite=lax` | Comportamento do framework |
| Token do cliente | 32 bytes aleatórios, só o SHA-256 no banco, expira, revoga, um link ativo por implantação, resposta idêntica para inválido/expirado/revogado (ADR-007) | Testes do portal |
| Portal | Devolve apenas campos permitidos (RN-14); cabeçalhos `Referrer-Policy: no-referrer` e `noindex` | Teste de que comentários e tarefas internas não aparecem |
| Cabeçalhos | `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy` configurados em `next.config.ts` | Inspeção manual; no portal, `no-referrer` e `noindex` são checados no E2E |
| Segredos | Só em variáveis de ambiente; `.env` no `.gitignore`; `.env.example` sem valores reais | Revisão do repositório |
| Logs | Sem senha, token ou dados pessoais | Revisão de código |

## Privacidade (LGPD básica)

| Pergunta | Resposta |
|---|---|
| Que dados pessoais existem? | Nome, e-mail e telefone do contato do cliente; nome e e-mail dos usuários internos |
| Por que existem? | Finalidade única: conduzir a implantação e permitir login |
| Dados sensíveis? | Nenhum. Não pede CPF, documento, dado de saúde ou financeiro |
| Minimização | Telefone e CNPJ são opcionais |
| Quem acessa? | Usuários internos autenticados; o cliente vê só o que RN-14 permite |
| Correção/exclusão | Cliente pode ser editado; o contato pode ser anonimizado ao arquivar (melhoria prevista; hoje o arquivamento preserva o dado). **Limitação registrada** |
| Retenção | Sem política automática no MVP. **Limitação registrada** |

## O que **não** guardo
Senha em texto; token do cliente em texto; IP e navegador do cliente no portal; cookies de rastreamento; analytics de terceiros.

## Limitações conhecidas (não resolvidas no MVP)
- Sem limite de tentativas de login nem de acessos ao portal (apenas atraso proporcional do scrypt). Em produção real eu adicionaria rate limit.
- Sem MFA.
- Sem recuperação de senha por e-mail; o admin redefine.
- Auditoria imutável apenas por convenção da aplicação (ADR-005).
- Sem política de retenção e sem anonimização automática.
