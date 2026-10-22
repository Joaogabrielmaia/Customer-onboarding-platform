
import type { AssigneeKind, Plan } from "@/generated/prisma/enums";

export const SEED_ADMIN_PASSWORD = "Admin-Trilha-2026";
export const SEED_USER_PASSWORD = "Usuario-Trilha-2026";
export const SEED_PORTAL_TOKEN = "portal-santa-rita-token-0001";

export const seedUsers = [
  { key: "camila", name: "Camila Tavares", email: "admin@rotafacil.example", role: "ADMIN", admin: true },
  { key: "ricardo", name: "Ricardo Almeida", email: "fundador@rotafacil.example", role: "ADMIN", admin: true },
  { key: "diego", name: "Diego Ferreira", email: "implantador@rotafacil.example", role: "IMPLEMENTER", admin: false },
  { key: "larissa", name: "Larissa Prado", email: "larissa@rotafacil.example", role: "IMPLEMENTER", admin: false },
  { key: "patricia", name: "Patrícia Nogueira", email: "suporte@rotafacil.example", role: "IMPLEMENTER", admin: false },
] as const;

export const seedClients: {
  key: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  plan: Plan;
  contractDaysAgo: number;
}[] = [
  { key: "santaRita", companyName: "Distribuidora Santa Rita Alimentos", cnpj: "00.000.001/0001-00", contactName: "Sérgio Batista", contactEmail: "sergio@santarita.example", contactPhone: "(31) 90000-0001", plan: "PROFESSIONAL", contractDaysAgo: 40 },
  { key: "valeVerde", companyName: "Bebidas Vale Verde", cnpj: "00.000.002/0001-00", contactName: "Marlene Cardoso", contactEmail: "marlene@valeverde.example", contactPhone: "(31) 90000-0002", plan: "ESSENTIAL", contractDaysAgo: 24 },
  { key: "horizonte", companyName: "Comercial Horizonte Limpeza", cnpj: "00.000.003/0001-00", contactName: "Paulo Henrique Lacerda", contactEmail: "paulo@horizonte.example", contactPhone: "(31) 90000-0003", plan: "PROFESSIONAL", contractDaysAgo: 14 },
  { key: "serraAzul", companyName: "Atacado Serra Azul", cnpj: "00.000.004/0001-00", contactName: "Fernanda Moura", contactEmail: "fernanda@serraazul.example", contactPhone: "(31) 90000-0004", plan: "NETWORK", contractDaysAgo: 50 },
  { key: "paoProsa", companyName: "Distribuidora Pão e Prosa", cnpj: "00.000.005/0001-00", contactName: "Rogério Teixeira", contactEmail: "rogerio@paoeprosa.example", contactPhone: "(31) 90000-0005", plan: "ESSENTIAL", contractDaysAgo: 6 },
  { key: "boaMesa", companyName: "Central de Frios Boa Mesa", cnpj: "00.000.006/0001-00", contactName: "Aline Siqueira", contactEmail: "aline@boamesa.example", contactPhone: "(31) 90000-0006", plan: "PROFESSIONAL", contractDaysAgo: 115 },
  { key: "armazem", companyName: "Armazém do Vale Distribuição", cnpj: "00.000.007/0001-00", contactName: "Jorge Antunes", contactEmail: "jorge@armazemdovale.example", contactPhone: "(31) 90000-0007", plan: "ESSENTIAL", contractDaysAgo: 80 },
  { key: "costaLima", companyName: "Costa Lima Embalagens e Distribuição", cnpj: "00.000.008/0001-00", contactName: "Beatriz Costa Lima", contactEmail: "beatriz@costalima.example", contactPhone: "(31) 90000-0008", plan: "NETWORK", contractDaysAgo: 3 },
];

type T = [title: string, offsetDays: number, assigneeKind: AssigneeKind, required: boolean, visibleToClient: boolean];

export const seedTemplates: {
  key: string;
  name: string;
  description: string;
  stages: { name: string; tasks: T[] }[];
}[] = [
  {
    key: "professional",
    name: "Implantação Padrão — Plano Profissional",
    description: "Roteiro completo para distribuidoras de médio porte, de 6 a 7 semanas.",
    stages: [
      {
        name: "Kickoff e planejamento",
        tasks: [
          ["Realizar reunião de kickoff", 0, "IMPLEMENTER", true, true],
          ["Definir responsáveis do lado do cliente", 2, "CLIENT", true, true],
          ["Enviar checklist de dados necessários", 2, "IMPLEMENTER", true, true],
        ],
      },
      {
        name: "Dados do cliente",
        tasks: [
          ["Receber planilha de produtos", 9, "CLIENT", true, true],
          ["Receber lista de clientes e tabelas de preço", 12, "CLIENT", true, true],
          ["Conferir e importar produtos e clientes", 16, "IMPLEMENTER", true, true],
          ["Validar estoque inicial com o cliente", 19, "IMPLEMENTER", false, true],
        ],
      },
      {
        name: "Fiscal e financeiro",
        tasks: [
          ["Receber certificado digital e dados do contador", 21, "CLIENT", true, true],
          ["Parametrização fiscal", 25, "IMPLEMENTER", true, true],
          ["Configurar contas a receber e formas de pagamento", 28, "IMPLEMENTER", true, false],
          ["Revisão interna da parametrização", 29, "ADMIN", true, false],
        ],
      },
      {
        name: "Treinamento e go-live",
        tasks: [
          ["Treinamento de pedidos e estoque", 33, "IMPLEMENTER", true, true],
          ["Treinamento do financeiro", 35, "IMPLEMENTER", false, true],
          ["Configurar roteirização das entregas", 36, "IMPLEMENTER", false, true],
          ["Go-live: início do uso em produção", 40, "IMPLEMENTER", true, true],
          ["Acompanhamento da primeira semana", 47, "IMPLEMENTER", true, true],
        ],
      },
    ],
  },
  {
    key: "essential",
    name: "Implantação Essencial (enxuta)",
    description: "Roteiro curto para distribuidoras pequenas, de 3 a 4 semanas.",
    stages: [
      {
        name: "Início",
        tasks: [
          ["Realizar reunião de kickoff", 0, "IMPLEMENTER", true, true],
          ["Enviar checklist de dados necessários", 1, "IMPLEMENTER", true, true],
        ],
      },
      {
        name: "Dados e configuração",
        tasks: [
          ["Receber planilha de produtos", 7, "CLIENT", true, true],
          ["Importar produtos e clientes", 10, "IMPLEMENTER", true, true],
          ["Parametrização fiscal básica", 14, "IMPLEMENTER", true, true],
          ["Revisão interna", 15, "ADMIN", false, false],
        ],
      },
      {
        name: "Treinamento e go-live",
        tasks: [
          ["Treinamento geral", 18, "IMPLEMENTER", true, true],
          ["Go-live: início do uso em produção", 21, "IMPLEMENTER", true, true],
          ["Acompanhamento da primeira semana", 28, "IMPLEMENTER", false, true],
        ],
      },
    ],
  },
  {
    key: "network",
    name: "Implantação Rede — multifilial",
    description: "Roteiro para clientes com várias filiais: começa por uma filial piloto.",
    stages: [
      {
        name: "Planejamento",
        tasks: [
          ["Realizar reunião de kickoff", 0, "IMPLEMENTER", true, true],
          ["Mapear filiais e usuários", 3, "IMPLEMENTER", true, true],
          ["Definir a filial piloto", 5, "CLIENT", true, true],
        ],
      },
      {
        name: "Dados",
        tasks: [
          ["Receber cadastros de produtos de todas as filiais", 12, "CLIENT", true, true],
          ["Consolidar e importar cadastros", 18, "IMPLEMENTER", true, true],
          ["Conferir estoque por filial", 22, "IMPLEMENTER", true, true],
        ],
      },
      {
        name: "Fiscal e integrações",
        tasks: [
          ["Receber certificado digital de cada filial", 24, "CLIENT", true, true],
          ["Parametrização fiscal por filial", 30, "IMPLEMENTER", true, true],
          ["Revisão interna da parametrização", 31, "ADMIN", true, false],
          ["Configurar transferência entre filiais", 34, "IMPLEMENTER", false, true],
        ],
      },
      {
        name: "Treinamento e go-live",
        tasks: [
          ["Treinamento da filial piloto", 38, "IMPLEMENTER", true, true],
          ["Go-live da filial piloto", 42, "IMPLEMENTER", true, true],
          ["Expansão para as demais filiais", 56, "IMPLEMENTER", true, true],
          ["Acompanhamento pós-expansão", 63, "IMPLEMENTER", true, true],
        ],
      },
    ],
  },
];

export interface DeploymentScenario {
  client: string;
  template: string;
  implementer: string;
  pivotTitle?: string;
  pivotDaysAgo?: number;
  pivotStatus?: "PENDING" | "IN_PROGRESS" | "WAITING_CLIENT";
  finishDelayDays?: number;
  pivotPostponedByDays?: number;
  pivotPostponeReason?: string;
  pivotComment?: { author: string; body: string };
  portalToken?: string;
}

export const seedScenarios: DeploymentScenario[] = [
  {
    client: "santaRita", template: "professional", implementer: "diego",
    pivotTitle: "Parametrização fiscal", pivotDaysAgo: 5, pivotStatus: "IN_PROGRESS",
    pivotPostponedByDays: 3, pivotPostponeReason: "Contador do cliente ficou de férias até o fim da semana.",
    pivotComment: { author: "diego", body: "Combinado com o Sérgio por telefone: o módulo de entregas entra depois do go-live, na fase 2." },
    portalToken: SEED_PORTAL_TOKEN,
  },
  {
    client: "valeVerde", template: "essential", implementer: "larissa",
    pivotTitle: "Receber planilha de produtos", pivotDaysAgo: 2, pivotStatus: "WAITING_CLIENT",
    pivotComment: { author: "larissa", body: "Cobrei a planilha pelo WhatsApp. Marlene disse que envia amanhã, mas o arquivo anterior veio com colunas trocadas." },
  },
  {
    client: "horizonte", template: "professional", implementer: "diego",
    pivotTitle: "Conferir e importar produtos e clientes", pivotDaysAgo: -2, pivotStatus: "IN_PROGRESS",
  },
  {
    client: "serraAzul", template: "network", implementer: "larissa",
    pivotTitle: "Parametrização fiscal por filial", pivotDaysAgo: 8, pivotStatus: "IN_PROGRESS",
    pivotPostponedByDays: 4, pivotPostponeReason: "Duas filiais ainda não enviaram o certificado digital.",
    pivotComment: { author: "larissa", body: "Filiais de Betim e Contagem pendentes de certificado. Falar com a Fernanda na terça." },
  },
  {
    client: "paoProsa", template: "essential", implementer: "diego",
    pivotTitle: "Receber planilha de produtos", pivotDaysAgo: -3, pivotStatus: "PENDING",
  },
  { client: "boaMesa", template: "professional", implementer: "larissa", finishDelayDays: 12 },
  { client: "armazem", template: "essential", implementer: "diego", finishDelayDays: 6 },
];
