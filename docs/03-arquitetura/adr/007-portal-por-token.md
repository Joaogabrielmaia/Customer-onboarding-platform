# ADR-007: Portal do cliente por link com token

**Data:** 2026-10-22 · **Status:** aceito
Relacionados: [RN-13, RN-14](../../02-definicao/03-regras-de-negocio.md) · [Segurança](../seguranca-e-privacidade.md) · R3-05, R3-06

## Contexto
O cliente não cria conta (R3-05), abre pelo celular e pode encaminhar o link (R3-06). Quero risco baixo mesmo assim.

## Alternativas
| Opção | Pró | Contra |
|---|---|---|
| Login para o cliente | Mais seguro | O cliente não vai usar; vira mais um chamado |
| JWT assinado no link | Sem consulta ao banco | Revogação é difícil; não dá para "gerar outro e invalidar o anterior" sem lista de bloqueio |
| Código curto + dado pessoal | Camada extra | Pede dado pessoal desnecessário |
| **Token aleatório opaco, guardado como hash** | Revogável, expira, nada útil vaza se o banco vazar | Quem tem o link tem acesso |

## Decisão
Token de 32 bytes aleatórios em base64url, na URL `/p/<token>`. No banco, só o SHA-256 (`PortalLink.tokenHash`). Validade padrão de 60 dias, revogável, **um link ativo por implantação** (gerar outro revoga o anterior). Respostas para token inválido, expirado e revogado são idênticas. A página envia `Referrer-Policy: no-referrer` e `noindex`. O portal devolve só os campos permitidos (RN-14).

## Por quê
Com 256 bits aleatórios, adivinhar é inviável. O hash faz com que vazamento do banco não entregue links utilizáveis. Revogação e expiração tratam o caso de link encaminhado.

## Trade-off
Quem recebe o link acessa o conteúdo (é "link secreto", não autenticação). O conteúdo exposto é pouco sensível por desenho. Não há limite de requisições no MVP; registro como limitação.

## Quando eu mudaria
Se o portal passasse a mostrar dados financeiros ou documentos, exigiria um segundo fator (código por e-mail).
