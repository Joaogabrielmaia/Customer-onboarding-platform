# Entrevista: Fase 6 (qualidade)

**Objetivo:** preparar respostas sobre como testei e o que sei (e não sei) afirmar.
**Data:** 2026-10-22 · **Status:** concluído
Relacionados: [Estratégia de testes](../05-qualidade/01-estrategia-de-testes.md) · [Resultado](../05-qualidade/02-resultado-da-ultima-execucao.md) · [Limitações](../05-qualidade/03-limitacoes-conhecidas.md)

### 1. Qual a sua estratégia de testes e por que ela tem três camadas?
Cada coisa na camada mais barata que a prova. Regras sutis viram unitário (46 testes, rápidos, sem banco). O que depende de banco, transação e permissão vira integração dos serviços contra um PostgreSQL real (64 testes), porque mock do Prisma passaria mesmo com a transação errada. O que só o navegador mostra vira E2E com Playwright (31 testes, incluindo axe para acessibilidade). Chamo de "integração dos serviços" e não de "testes de API", porque a aplicação não expõe uma API REST.

### 2. Qual a cobertura de testes?
Não medi cobertura de código e não vou citar um percentual. Em vez disso, mantenho uma matriz de rastreabilidade regra → teste e registro o que ficou sem teste: desempenho, LGPD, o estado vazio do painel e a reversão da transação de auditoria sob falha. Se medisse, usaria cobertura como alarme nas regras de negócio, não como meta.

### 3. O CI está passando?
O workflow do GitHub Actions está escrito (lint, tipos, unitário, integração com Postgres como serviço, build e E2E), mas eu ainda não o executei no GitHub porque o repositório não foi enviado. O que posso afirmar é a execução local: lint e tipos sem erro, 46 unitários, 64 de integração e 31 E2E passando, nesta máquina. Quando enviar o repositório, o primeiro resultado do CI entra no README, passando ou não.
