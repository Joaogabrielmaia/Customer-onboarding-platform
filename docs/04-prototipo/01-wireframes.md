# Wireframes das telas principais

**Objetivo:** desenhar as telas antes de construir, para validar com o fundador e a líder (Reunião 4).
**Data:** 2026-10-22 · **Status:** concluído (versão **após** a Reunião 4; as mudanças estão no [change-log](03-change-log.md))
Relacionados: [Rastreabilidade (telas T01 a T11)](../02-definicao/08-rastreabilidade.md) · [Reunião 4](02-reuniao-4-validacao.md)

Os dados nos desenhos são fictícios. Legenda: `[ ]` botão ou campo, `▓` barra de progresso, `🔴` atraso da equipe, `🟡` aguardando cliente.

## T01 · Login

```
┌──────────────────────────────┐
│  Trilha                      │
│  Implantação de clientes     │
│                              │
│  E-mail  [__________________]│
│  Senha   [__________________]│
│                              │
│  [        Entrar          ]  │
│                              │
│  Demonstração: caso simulado │
│  (credenciais no README)     │
└──────────────────────────────┘
```

## T02 · Painel (decidido com o fundador: responder "o que está atrasado, de quem e há quanto tempo")

```
┌───────────────────────────────────────────────────────────────────────┐
│ Trilha   Painel  Clientes  Modelos  Pendências        Camila ▾ [Sair] │
├───────────────────────────────────────────────────────────────────────┤
│ Implantador: [Todos ▾]                                                │
│                                                                       │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────────────┐    │
│ │ Em        │ │ 🔴        │ │ Concluídas│ │ Tempo médio          │    │
│ │ andamento │ │ Atrasadas │ │           │ │ 34 dias              │    │
│ │    5      │ │    2      │ │    3      │ │ (só dados de demo)   │    │
│ └───────────┘ └───────────┘ └───────────┘ └──────────────────────┘    │
│                                                                       │
│ Atenção primeiro                                                      │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 Distribuidora Santa Rita   ▓▓▓▓▓░░░░░ 52%   Diego   5 dias     │ │
│ │    Pendência: Parametrização fiscal                               │ │
│ │ 🟡 Bebidas Vale Verde         ▓▓▓░░░░░░░ 30%   Larissa 2 dias     │ │
│ │    Aguardando cliente: planilha de produtos                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ Em andamento no prazo        (lista com progresso e próximo prazo)    │
│ Pendências por implantador   Diego 4 · Larissa 3 · Camila 1           │
└───────────────────────────────────────────────────────────────────────┘
Vazio: "Nenhuma implantação ainda. [Criar a primeira implantação]"
```

## T03/T04 · Clientes

```
Clientes                                         [ + Novo cliente ]
Buscar [__________]   Plano [Todos ▾]   [ ] Mostrar arquivados
┌───────────────────────┬─────────────────┬──────────────┬──────────┐
│ Empresa               │ Contato         │ Plano        │ Contrato │
├───────────────────────┼─────────────────┼──────────────┼──────────┤
│ Distribuidora S. Rita │ Sérgio Batista  │ Profissional │ 12/01/26 │
└───────────────────────┴─────────────────┴──────────────┴──────────┘
Formulário: Empresa* · CNPJ · Contato* · E-mail* · Telefone · Plano* · Data do contrato*
```

## T06 · Editor de modelo (somente Admin)

```
Modelo: Implantação Padrão — Plano Profissional            [ Salvar ]
▾ Etapa 1 · Kickoff e dados
   #  Tarefa                         Prazo  Responsável    Obrig. Cliente vê
   1  Realizar kickoff               D+0    Implantador    [x]    [x]
   2  Receber planilha de produtos   D+7    Cliente        [x]    [x]
   3  Conferir importação            D+10   Implantador    [x]    [ ]
   [ + Tarefa ]
▸ Etapa 2 · Fiscal
▸ Etapa 3 · Treinamento e go-live            [ + Etapa ]
```

## T07 · Nova implantação

```
Cliente*   [Distribuidora Santa Rita ▾]
Modelo*    [Implantação Padrão — Plano Profissional ▾]
Implantador* [Diego Ferreira ▾]
Kickoff*   [02/03/2026]
Prévia: "Receber planilha de produtos" → 09/03/2026 (seg)
        "Conferir importação" → 12/03/2026 (qui)
[ Criar implantação ]
```

## T08 · Detalhe da implantação (a tela mais usada)

```
Distribuidora Santa Rita · Implantador: Diego · Kickoff 02/03/2026
▓▓▓▓▓▓░░░░ 52% (11 de 21)      🔴 1 em atraso   [ Link do cliente ]
┌ Abas: Tarefas | Histórico ─────────────────────────────────────────┐
│ ▾ Etapa 2 · Fiscal                                                 │
│  [✓] Cadastrar certificado           10/03   Diego   Concluída     │
│  [ ] 🔴 Parametrização fiscal        12/03   Diego   Em andamento  │
│       atrasada há 5 dias  · prazo original 10/03                   │
│       Status [Em andamento ▾]  [Ajustar prazo]  Visível ao cliente │
│       💬 2 comentários  [ Comentar ]                               │
│  [ ] 🟡 Enviar contrato social       15/03   Cliente   Aguardando  │
└────────────────────────────────────────────────────────────────────┘
Histórico: 10/03 14:02 · Diego · prazo alterado 08/03 → 12/03 · "contador de férias"
```

## T09 · Minhas pendências

```
Minhas pendências (Diego)          Ordenadas por atraso
 🔴 Parametrização fiscal · S. Rita · 5 dias de atraso
 🔴 Revisar importação · Vale Verde · 1 dia de atraso
    Conferir estoque inicial · S. Rita · vence 14/03
Vazio: "Nenhuma pendência. Bom trabalho."
```

## T10 · Configurações (Admin)

```
Regra de atraso
Tolerância: [0] dias após o prazo       Link do cliente expira em: [60] dias
Usuários: Nome | E-mail | Papel | Ativo | [ + Novo usuário ]
```

## T11 · Portal do cliente (mobile first, somente leitura)

```
┌─────────────────────┐
│ Rota Fácil Software │
│ Implantação de      │
│ Distribuidora       │
│ Santa Rita          │
│                     │
│ ▓▓▓▓▓░░░░░  52%     │
│                     │
│ Com você            │
│ 🟡 Enviar contrato  │
│    social  até 15/03│
│                     │
│ Próximas etapas     │
│ • Parametrização fiscal│
│ • Treinamento       │
│                     │
│ Concluído ▸         │
│ Somente leitura.    │
│ Dúvidas: fale com   │
│ seu implantador.    │
└─────────────────────┘
Link inválido: "Este link não está mais disponível. Peça um novo ao seu implantador."
```

## Estados tratados em todas as telas
Carregando (esqueleto), vazio (mensagem + ação), erro (mensagem em linguagem simples + tentar de novo) e acesso negado.
