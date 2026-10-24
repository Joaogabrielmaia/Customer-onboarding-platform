# 06 · Desenvolvimento e gestão de configuração

**Objetivo:** explicar como o código é organizado, versionado e verificado, e como o repositório evoluiu.
**Data:** 2026-10-24 · **Status:** concluído
Relacionados: [Índice do ciclo de vida](README.md) · [04 Arquitetura](04-arquitetura-e-adrs.md) · [07 Testes e qualidade](07-testes-e-qualidade.md) · [09 Evolução](09-evolucao-e-roadmap.md) · [CHANGELOG](../../CHANGELOG.md) · [CONTRIBUTING](../../CONTRIBUTING.md)

Tudo o que está aqui foi confirmado no repositório em 2026-10-24. O que foi criado e depois removido aparece como tal.

## Organização do código

| Pasta | Conteúdo | Regra |
|---|---|---|
| `src/domain` | Prazo, atraso, progresso, permissões, token e CSV | Funções puras, sem banco nem framework |
| `src/server` | Serviços, sessão, senha, auditoria, seed | Um caso de uso por função, com autorização, validação e transação |
| `src/app` | Páginas, Server Actions e healthcheck | Finas: autenticam, chamam o serviço e tratam o erro |
| `src/components` | Componentes de interface | Sem regra de negócio |
| `prisma` | Schema, migration, seed e redefinição de senha | Versionados |
| `tests` | Unitários, integração, E2E e geração dos prints | Um diretório por camada |

## Branches e pull requests

| Item | Prática observada |
|---|---|
| Branch principal | `main` |
| Branches de trabalho | `feat/v1.1-exportar-csv` (RF-20), `docs/apresentacao`, `docs/readme-venda` e `docs/ciclo-de-vida` |
| Pull requests | PR 1 (apresentação e correção do D6) e PR 2 (README), com merge commit e branch apagada depois |
| Revisão de código | Um único autor; não há revisão humana registrada. O critério de merge nos PRs 1 e 2 foi a CI verde |
| Merge | Merge commit; a v1.1.0 entrou por merge local (`a16b9bf`), antes de existir PR |

## Convenção de commits e versionamento

Commits seguem Conventional Commits e citam o ID do requisito ou da história quando há (`feat(RF-20)`, `fix(RNF-06,US-07)`). O versionamento é semântico e o [CHANGELOG](../../CHANGELOG.md) segue o formato Keep a Changelog.

| Tag | Commit | Data | Conteúdo |
|---|---|---|---|
| `v1.0.0` | `e71efb7` | 2026-10-22 | MVP |
| `v1.1.0` | `a16b9bf` | 2026-10-22 | Exportação em CSV (RF-20) |

As duas tags são anotadas e têm release no GitHub, com as notas do CHANGELOG.

## CI/CD

| Item | Estado | Fonte |
|---|---|---|
| CI | Existe | [ci.yml](../../.github/workflows/ci.yml) |
| Gatilhos | Push na `main` e pull request | `on:` do workflow |
| Passos | Instalar dependências, lint, tipos, testes unitários, testes de integração com PostgreSQL 16 como serviço, build, instalar o Chromium e testes E2E; guarda o relatório se falhar | `jobs.quality` |
| Ambiente do job | `ubuntu-latest`, Node.js 24 | Workflow |
| CD | Não existe | Não há workflow de deploy |

Execuções registradas: falha em 2026-10-23 (D6) e verde em 2026-10-24, ver [execução na CI](../05-qualidade/05-execucao-ci-2026-10-24.md).

## Ambientes e configuração

| Ambiente | Existe | Observação |
|---|---|---|
| Desenvolvimento local | Sim | PostgreSQL em Docker; instruções no [CONTRIBUTING](../../CONTRIBUTING.md) |
| CI | Sim | PostgreSQL como serviço do job, credenciais descartáveis do próprio job |
| Teste e E2E | Sim | Bancos separados (`trilha_test` e `trilha_e2e`); a porta do E2E vem de `E2E_PORT`, com 3100 como padrão |
| Homologação e produção | Não | Sem deploy de aplicação |

Variáveis de ambiente (de [`.env.example`](../../.env.example)): `DATABASE_URL`, `DIRECT_URL` (opcional), `AUTH_SECRET`, `APP_URL` e `SEED_CONFIRM_RESET` (só para o seed contra banco não local).

## Gestão de dependências e segredos

| Tema | Prática |
|---|---|
| Dependências | `package-lock.json` versionado; 9 dependências e 14 de desenvolvimento; instalação por `npm ci` na CI |
| Segredos | `.env` fora do Git (`.gitignore`); `.env.example` só com valores ilustrativos; a CI usa valores descartáveis no próprio workflow |
| Credenciais locais | As do Docker local aparecem no `docker-compose.yml`, em testes e no `.env.example` e são válidas só para a máquina de desenvolvimento |
| Varredura | Em 2026-10-24 não havia chave de API nem chave privada no histórico; só URLs de banco locais |

## Histórico de mudanças relevantes

| Commit | Data | Mudança |
|---|---|---|
| `e17e719` | 2026-10-22 | Estrutura, schema Prisma e regras de domínio |
| `a2da0bc` | 2026-10-22 | RF-20: exportação em CSV |
| `a32c706` | 2026-10-22 | Primeira configuração de deploy: build com migration, proteção do seed e `vercel.json` |
| `51588fe` | 2026-10-22 | Troca `vercel.json` por Blueprint da Render e adiciona o bootstrap do primeiro administrador |
| `8e5854d` | 2026-10-23 | Remove `render.yaml`, o bootstrap e o workflow de reseed: a configuração passa a ser só local |
| `7de1de4` | 2026-10-24 | Correção do D6 no portal |
| `a9066fe` | 2026-10-24 | Merge do PR 1 |

A configuração de deploy foi preparada e depois removida: hoje não há deploy de aplicação.

## Dívida técnica

| Item | Origem | Prioridade | Estratégia |
|---|---|---|---|
| Teste de falha na transação de auditoria (prova de que tudo reverte) | [Retrospectiva final](../07-pos-go-live/retrospectiva-final.md) | Alta | Teste de integração que força falha após a mudança |
| Cobertura de código não medida | [Limitações](../05-qualidade/03-limitacoes-conhecidas.md) | Média | Medir antes de definir meta |
| Acessibilidade manual (teclado e leitor de tela) | Retrospectiva final | Média | Incluir na Definition of Done |
| Sem limite de requisições no portal | [ADR-007](../03-arquitetura/adr/007-portal-por-token.md) | Média | Limitar antes de qualquer exposição pública |
| Imutabilidade da auditoria por convenção | [ADR-005](../03-arquitetura/adr/005-auditoria.md) | Baixa | Permissão de banco só de INSERT, se houver exigência de conformidade |
| Navegadores além do Chromium | Limitações | Baixa | Ampliar a matriz da CI |

## Evolução entre versões

A v1.1.0 só acrescentou: novas rotas de download, um script de redefinição de senha e testes. Não criou migration (o banco continua na `init`) e não mudou comportamento existente, então não há impacto de compatibilidade da v1.0.0 para a v1.1.0.
