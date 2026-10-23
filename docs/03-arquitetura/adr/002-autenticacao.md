# ADR-002: Autenticação — sessão própria em cookie, senha com scrypt

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [ADR-006](006-controle-de-acesso.md) · [Segurança](../seguranca-e-privacidade.md) · RF-01, RN-17, RN-18

## Contexto
Login com e-mail e senha para usuários internos, com papéis, e **desativação com efeito imediato** (RN-18). Poucos usuários, sem login social.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| Auth.js (NextAuth) com Credentials | Pronto, comunidade grande | O provedor de credenciais força sessão JWT; derrubar usuário desativado na hora exige consultar o banco a cada requisição, anulando a vantagem. Eu teria de explicar uma configuração que não controlo |
| Clerk / Auth0 | Zero código de segurança | Serviço externo, limite no plano gratuito, dado de usuário fora do meu banco, dependência de custo |
| **Sessão própria** (cookie opaco + tabela `Session`) | Controle total, desativação e logout imediatos, poucas linhas | Eu respondo pelos detalhes de segurança |

Para o hash de senha: `bcryptjs`, `argon2` (pacote nativo) ou `crypto.scrypt` do Node.

## Decisão
- **Sessão:** token aleatório de 32 bytes no cookie `httpOnly`, `secure` em produção, `sameSite=lax`. O banco guarda só o SHA-256 do token, com validade. Cada requisição consulta a sessão e o usuário.
- **Senha:** `crypto.scrypt` do Node com N=2^15, r=8, p=3 e sal de 16 bytes, comparação com `timingSafeEqual`.

## Por quê
Sessão no banco me dá logout e desativação imediatos e é pouco código que consigo explicar. O scrypt vem no Node (sem dependência nativa, sem risco de falha de build em outro ambiente), é memória-intensivo e essa combinação de parâmetros consta entre as configurações equivalentes recomendadas pela OWASP.

## Trade-off
- Uma consulta ao banco por requisição autenticada (aceitável no volume previsto).
- Implementar sessão à mão exige disciplina: cookie correto, expiração, token novo a cada login. O argon2id seria a primeira escolha da OWASP; abri mão dele para evitar dependência nativa.

## Quando eu mudaria
Se precisasse de login social, SSO ou MFA, adotaria Auth.js ou um provedor gerenciado. Se o custo de CPU do scrypt incomodasse, migraria para argon2id (o formato guardado inclui os parâmetros, então dá para migrar no próximo login).
