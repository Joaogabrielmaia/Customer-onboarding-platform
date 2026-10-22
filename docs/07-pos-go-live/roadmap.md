# Roadmap: v1.2 e v2

**Objetivo:** mostrar o que fica para depois e por quê.
**Data:** 2026-10-22 · **Status:** proposta (sem datas, de propósito)
Relacionados: [Retrospectiva](reuniao-6-retrospectiva.md) · [Escopo](../02-definicao/05-priorizacao-e-escopo.md) · [Change-log](../04-prototipo/03-change-log.md)

Não coloco datas porque seriam palpites. A ordem é por impacto na dor relatada e por dependência técnica.

## Já entregue

| Versão | Conteúdo |
|---|---|
| v1.0.0 | MVP: login e papéis, clientes, modelos, implantações com prazos relativos, tarefas, comentários, auditoria, painel, regra de atraso, portal do cliente |
| v1.1.0 | Exportar relatório da implantação e lista de implantações em CSV |

## v1.2: avisar e reduzir cliques

| Item | Por que | Pré-requisito / risco |
|---|---|---|
| **Alerta de atraso por e-mail** | O fundador quer ser avisado (retrospectiva) | Provedor de e-mail, remetente verificado, preferência de quem recebe, descadastro. Começar por um resumo diário para evitar ruído |
| **Recuperação de senha por e-mail** | Hoje o admin redefine | Vem junto com o e-mail |
| **Concluir várias tarefas de uma vez** | Dor do implantador no fim do dia | Manter uma linha de auditoria por tarefa |
| **Feriados no cálculo de prazo** | Prazos caem em feriado | Calendário por região, configurável |
| **Estado vazio e atomicidade com teste** | Lacunas conhecidas de qualidade | Só trabalho de teste |
| **Limite de tentativas de login e de acessos ao portal** | Lacuna de segurança conhecida | Armazenamento de contador (banco ou serviço) |

## v2: o que muda o modelo

| Item | Por que | O que perco se fizer errado |
|---|---|---|
| **Dependência entre tarefas** | A realidade é encadeada (CH-06) | Recálculo em cadeia e ciclos; precisa de ADR novo |
| **Botão "já enviei" no portal, com confirmação** | O cliente avisa sem WhatsApp | Segurança: hoje o link não escreve (CH-04); exigiria segundo fator por e-mail |
| **Subtarefas, anexos e campos personalizados** | Pedido do implantador (R2-06) | Peso do preenchimento: validar antes se o MVP é usado |
| **Calendário semanal** | CH-08 | — |
| **Integração com CRM/ERP** | Criar a implantação ao fechar contrato | Precisa de um sistema de origem definido |
| **Multiempresa (multi-tenant)** | Virar produto para outras software houses | Dobra a complexidade de dados e permissões |
| **Painel em PDF** | CH-07 | Layout e dependência de geração |
| **WhatsApp** | O cliente prefere | Custo por conversa e aprovação de modelos |

## O que provavelmente **nunca** entra

Cobrança, assinatura digital e app mobile nativo. Não resolvem a dor central e o portal responsivo cobre o uso do cliente.

## Critério para decidir a ordem

Antes de qualquer item da v2, **olhar o uso real**: se a equipe não preencher o MVP (RK-08), de nada adianta acrescentar campos.
