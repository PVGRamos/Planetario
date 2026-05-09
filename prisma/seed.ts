import { PrismaClient, TransactionType, PaymentMethod, TransactionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Usuário admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@planetacargas.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@planetacargas.com.br",
      password: hashedPassword,
    },
  });
  console.log("✅ Usuário admin criado:", admin.email);

  // Empresas
  await prisma.company.upsert({
    where: { id: "company-brasilia" },
    update: {},
    create: { id: "company-brasilia", name: "Brasília" },
  });
  await prisma.company.upsert({
    where: { id: "company-goiania" },
    update: {},
    create: { id: "company-goiania", name: "Goiânia" },
  });
  console.log("✅ Empresas criadas");

  // Centros de Custo
  const costCenters = [
    { id: "cc-financeiro", name: "Financeiro" },
    { id: "cc-diretoria", name: "Diretoria" },
    { id: "cc-comercial", name: "Comercial" },
    { id: "cc-operacional", name: "Operacional" },
    { id: "cc-administrativo", name: "Administrativo" },
    { id: "cc-rh", name: "RH" },
    { id: "cc-mkt", name: "MKT" },
  ];
  for (const cc of costCenters) {
    await prisma.costCenter.upsert({
      where: { id: cc.id },
      update: {},
      create: cc,
    });
  }
  console.log("✅ Centros de custo criados");

  // Categorias de DESPESA
  const expenseCategories: { id: string; name: string; subcategories: string[] }[] = [
    {
      id: "cat-desp-administrativas",
      name: "Despesas Administrativas",
      subcategories: [
        "Refeições e Lanches",
        "Festas e Eventos",
        "Correios e Aéreos",
        "Material de Escritório",
        "Departamento Jurídico",
        "Medicamentos",
        "Plano de Saúde",
        "Informática e Internet",
        "Móveis e Utensílios",
        "Ajuda de Custo",
        "Prolabore",
        "Telefones",
        "Cartório",
        "Copa",
        "Contabilidade",
      ],
    },
    {
      id: "cat-desp-financeiras",
      name: "Despesas Financeiras",
      subcategories: [
        "Desp Financeira",
        "Cartões de Crédito",
        "Empréstimo Bancário",
        "Lucros e Perdas",
        "Encargos Financeiros",
        "IOF",
        "Previdência Privada",
        "Tarifas Bancárias",
      ],
    },
    {
      id: "cat-desp-operacionais",
      name: "Despesas Operacionais",
      subcategories: [
        "Abastecimento",
        "Seguro de Carro",
        "Sinistro",
        "Embalagem",
        "Licenciamento",
        "Multas de Trânsito",
        "Seguro Obrigatório",
        "Terceirizados",
        "Redespacho",
        "Veículos",
        "Despesas de Viagem",
        "Gratificações",
        "Equipamentos",
      ],
    },
    {
      id: "cat-desp-folha-beneficios",
      name: "Folha e Benefícios",
      subcategories: [
        "Salários",
        "Adiantamento Salarial",
        "13º Salário",
        "Férias e 1/3 de Férias",
        "Encargos Sociais",
        "Benefícios",
        "Plano de Saúde / Odontológico",
        "Exames Ocupacionais",
        "Equipamento de Segurança e Uniformes",
        "Rescisões e Multas Trabalhistas",
        "Cursos e Treinamentos",
      ],
    },
    {
      id: "cat-desp-impostos",
      name: "Impostos",
      subcategories: [
        "Simples Nacional",
        "IRRF – DARF",
        "IPTU",
        "IPVA",
        "Alvará de Funcionamento",
        "Taxas Sindicais",
        "Taxas de Conselhos",
      ],
    },
    {
      id: "cat-desp-instalacoes",
      name: "Instalações",
      subcategories: [
        "Segurança Instalações",
        "Limpeza e Conservação",
        "Aluguel",
        "Conta de Água",
        "Conta de Luz",
        "Manutenção Predial",
      ],
    },
    {
      id: "cat-desp-investimentos",
      name: "Investimentos",
      subcategories: [
        "Consórcio",
        "Financiamento de Veículos",
        "Aquisição de Imóveis",
      ],
    },
    {
      id: "cat-desp-marketing-vendas",
      name: "Marketing e Vendas",
      subcategories: [
        "Google Ads",
        "Meta Ads",
        "Agência de Marketing",
        "Freelancers",
        "Material Promocional",
        "Brindes",
        "Comissões de Vendas",
      ],
    },
    {
      id: "cat-desp-tecnologia-software",
      name: "Tecnologia e Software",
      subcategories: [
        "ERP",
        "CRM",
        "Google Workspace",
        "AWS",
        "Hospedagem",
        "Domínios",
        "Softwares Operacionais",
      ],
    },
  ];

  // Categorias de RECEITA
  const incomeCategories: { id: string; name: string; subcategories: string[] }[] = [
    {
      id: "cat-rec-operacional",
      name: "Receita Operacional",
      subcategories: [
        "Frete",
        "Armazenagem",
        "Logística",
        "Entregas",
        "Redespacho",
        "Serviços Operacionais",
      ],
    },
    {
      id: "cat-rec-financeira",
      name: "Receita Financeira",
      subcategories: [
        "Rendimentos Bancários",
        "Aplicações Financeiras",
        "Juros Recebidos",
      ],
    },
    {
      id: "cat-rec-venda-ativos",
      name: "Venda de Ativos",
      subcategories: [
        "Venda de Veículos",
        "Venda de Equipamentos",
        "Venda de Imóveis",
      ],
    },
    {
      id: "cat-rec-outras",
      name: "Outras Receitas",
      subcategories: [
        "Reembolsos",
        "Créditos Recuperados",
        "Receitas Diversas",
      ],
    },
  ];

  function toSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  for (const catData of expenseCategories) {
    const category = await prisma.category.upsert({
      where: { id: catData.id },
      update: { name: catData.name, type: TransactionType.EXPENSE },
      create: { id: catData.id, name: catData.name, type: TransactionType.EXPENSE },
    });
    for (const subName of catData.subcategories) {
      const subId = `sub-${catData.id}-${toSlug(subName)}`;
      await prisma.subcategory.upsert({
        where: { id: subId },
        update: {},
        create: { id: subId, name: subName, categoryId: category.id },
      });
    }
  }

  for (const catData of incomeCategories) {
    const category = await prisma.category.upsert({
      where: { id: catData.id },
      update: { name: catData.name, type: TransactionType.INCOME },
      create: { id: catData.id, name: catData.name, type: TransactionType.INCOME },
    });
    for (const subName of catData.subcategories) {
      const subId = `sub-${catData.id}-${toSlug(subName)}`;
      await prisma.subcategory.upsert({
        where: { id: subId },
        update: {},
        create: { id: subId, name: subName, categoryId: category.id },
      });
    }
  }
  console.log("✅ Categorias e subcategorias criadas");

  // Fornecedores
  const suppliers = [
    { id: "sup-posto", name: "Posto Shell Central", email: "posto@shell.com" },
    { id: "sup-mecanica", name: "Mecânica São José", email: "mecanica@saojose.com" },
    { id: "sup-seguradora", name: "Porto Seguro", email: "atendimento@portoseguro.com" },
    { id: "sup-aluguel", name: "Imobiliária Alfa", email: "contato@alfa.com" },
    { id: "sup-energia", name: "CEB — Companhia Energética", email: "ceb@ceb.com.br" },
    { id: "sup-telecom", name: "Claro Empresas", email: "empresas@claro.com.br" },
  ];
  for (const sup of suppliers) {
    await prisma.supplier.upsert({
      where: { id: sup.id },
      update: {},
      create: sup,
    });
  }
  console.log("✅ Fornecedores criados");

  // Clientes
  const customers = [
    { id: "cust-abc", name: "Empresa ABC Logística", email: "contato@abclogistica.com.br", phone: "(61) 98765-4321" },
    { id: "cust-xyz", name: "Transportes XYZ", email: "financeiro@xyz.com.br", phone: "(62) 91234-5678" },
    { id: "cust-silva", name: "João da Silva ME", email: "joao@silvame.com.br", phone: "(11) 99999-0000" },
  ];
  for (const cust of customers) {
    await prisma.customer.upsert({
      where: { id: cust.id },
      update: {},
      create: cust,
    });
  }
  console.log("✅ Clientes criados");

  // Lançamentos fake — criados apenas se o banco estiver vazio
  const existingTxCount = await prisma.transaction.count();
  if (existingTxCount === 0) {
    const y = 2026;
    const d = (month: number, day: number) => new Date(y, month - 1, day);

    const transactions = [
      // ── JANEIRO ──────────────────────────────────────────────
      {
        companyId: "company-brasilia",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-frete",
        costCenterId: "cc-comercial",
        customerId: "cust-abc",
        supplierId: null,
        description: "Frete BSB → SP — Empresa ABC Logística",
        documentRef: "CT-e 000101",
        amount: 15000.00,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 8),
        dueDate: d(1, 8),
        paymentDate: d(1, 8),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-armazenagem",
        costCenterId: "cc-operacional",
        customerId: "cust-xyz",
        supplierId: null,
        description: "Armazenagem — janeiro/2026",
        documentRef: "NFS-e 000045",
        amount: 4500.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 15),
        dueDate: d(1, 20),
        paymentDate: d(1, 19),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-folha-beneficios",
        subcategoryId: "sub-cat-desp-folha-beneficios-salarios",
        costCenterId: "cc-rh",
        supplierId: null,
        customerId: null,
        description: "Folha de pagamento — janeiro/2026",
        documentRef: null,
        amount: 48000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 1),
        dueDate: d(1, 5),
        paymentDate: d(1, 5),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-operacionais",
        subcategoryId: "sub-cat-desp-operacionais-abastecimento",
        costCenterId: "cc-operacional",
        supplierId: "sup-posto",
        customerId: null,
        description: "Abastecimento frota — janeiro/2026",
        documentRef: null,
        amount: 8500.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 10),
        dueDate: d(1, 10),
        paymentDate: d(1, 10),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-instalacoes",
        subcategoryId: "sub-cat-desp-instalacoes-conta-de-luz",
        costCenterId: "cc-administrativo",
        supplierId: "sup-energia",
        customerId: null,
        description: "Conta de luz — sede BSB — janeiro/2026",
        documentRef: "FAT 202601",
        amount: 2200.00,
        paymentMethod: PaymentMethod.BOLETO,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 15),
        dueDate: d(1, 20),
        paymentDate: d(1, 20),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-impostos",
        subcategoryId: "sub-cat-desp-impostos-simples-nacional",
        costCenterId: "cc-financeiro",
        supplierId: null,
        customerId: null,
        description: "DAS — Simples Nacional — janeiro/2026",
        documentRef: "DAS 2026/01",
        amount: 6800.00,
        paymentMethod: PaymentMethod.BOLETO,
        status: TransactionStatus.PAID,
        competencyDate: d(1, 20),
        dueDate: d(1, 20),
        paymentDate: d(1, 20),
        notes: null,
      },

      // ── FEVEREIRO ────────────────────────────────────────────
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-frete",
        costCenterId: "cc-comercial",
        customerId: "cust-xyz",
        supplierId: null,
        description: "Frete GYN → RJ — Transportes XYZ",
        documentRef: "CT-e 000210",
        amount: 22000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 5),
        dueDate: d(2, 12),
        paymentDate: d(2, 11),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-redespacho",
        costCenterId: "cc-operacional",
        customerId: "cust-abc",
        supplierId: null,
        description: "Redespacho — carga GYN→BSB",
        documentRef: "NFS-e 000089",
        amount: 3200.00,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 12),
        dueDate: d(2, 12),
        paymentDate: d(2, 12),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-financeira",
        subcategoryId: "sub-cat-rec-financeira-rendimentos-bancarios",
        costCenterId: "cc-financeiro",
        customerId: null,
        supplierId: null,
        description: "Rendimentos conta PJ — fevereiro/2026",
        documentRef: null,
        amount: 1200.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 28),
        dueDate: d(2, 28),
        paymentDate: d(2, 28),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-folha-beneficios",
        subcategoryId: "sub-cat-desp-folha-beneficios-salarios",
        costCenterId: "cc-rh",
        supplierId: null,
        customerId: null,
        description: "Folha de pagamento — fevereiro/2026",
        documentRef: null,
        amount: 48000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 1),
        dueDate: d(2, 5),
        paymentDate: d(2, 5),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-operacionais",
        subcategoryId: "sub-cat-desp-operacionais-abastecimento",
        costCenterId: "cc-operacional",
        supplierId: "sup-posto",
        customerId: null,
        description: "Abastecimento frota — fevereiro/2026",
        documentRef: null,
        amount: 9200.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 15),
        dueDate: d(2, 15),
        paymentDate: d(2, 15),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-financeiras",
        subcategoryId: "sub-cat-desp-financeiras-tarifas-bancarias",
        costCenterId: "cc-financeiro",
        supplierId: null,
        customerId: null,
        description: "Tarifas bancárias — fevereiro/2026",
        documentRef: null,
        amount: 450.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 28),
        dueDate: d(2, 28),
        paymentDate: d(2, 28),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-marketing-vendas",
        subcategoryId: "sub-cat-desp-marketing-vendas-google-ads",
        costCenterId: "cc-mkt",
        supplierId: null,
        customerId: null,
        description: "Google Ads — campanha fevereiro/2026",
        documentRef: null,
        amount: 3500.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PAID,
        competencyDate: d(2, 28),
        dueDate: d(2, 28),
        paymentDate: d(2, 28),
        notes: null,
      },

      // ── MARÇO ────────────────────────────────────────────────
      {
        companyId: "company-brasilia",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-frete",
        costCenterId: "cc-comercial",
        customerId: "cust-silva",
        supplierId: null,
        description: "Frete BSB → MG — João da Silva ME",
        documentRef: "CT-e 000318",
        amount: 18500.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 7),
        dueDate: d(3, 14),
        paymentDate: d(3, 13),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-logistica",
        costCenterId: "cc-operacional",
        customerId: "cust-abc",
        supplierId: null,
        description: "Gestão logística — contrato março/2026",
        documentRef: "NFS-e 000132",
        amount: 8000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 31),
        dueDate: d(3, 31),
        paymentDate: d(3, 31),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-folha-beneficios",
        subcategoryId: "sub-cat-desp-folha-beneficios-salarios",
        costCenterId: "cc-rh",
        supplierId: null,
        customerId: null,
        description: "Folha de pagamento — março/2026",
        documentRef: null,
        amount: 48000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 1),
        dueDate: d(3, 5),
        paymentDate: d(3, 5),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-instalacoes",
        subcategoryId: "sub-cat-desp-instalacoes-manutencao-predial",
        costCenterId: "cc-administrativo",
        supplierId: null,
        customerId: null,
        description: "Manutenção predial — sede BSB",
        documentRef: "NF 001245",
        amount: 5800.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 12),
        dueDate: d(3, 20),
        paymentDate: d(3, 18),
        notes: "Reforma telhado do galpão",
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-impostos",
        subcategoryId: "sub-cat-desp-impostos-ipva",
        costCenterId: "cc-financeiro",
        supplierId: null,
        customerId: null,
        description: "IPVA frota — março/2026",
        documentRef: "IPVA 2026",
        amount: 4200.00,
        paymentMethod: PaymentMethod.BOLETO,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 10),
        dueDate: d(3, 15),
        paymentDate: d(3, 14),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-operacionais",
        subcategoryId: "sub-cat-desp-operacionais-veiculos",
        costCenterId: "cc-operacional",
        supplierId: "sup-mecanica",
        customerId: null,
        description: "Revisão caminhão Volvo FH — placa GYN-4512",
        documentRef: "NF 004567",
        amount: 7200.00,
        paymentMethod: PaymentMethod.BOLETO,
        status: TransactionStatus.PAID,
        competencyDate: d(3, 20),
        dueDate: d(3, 27),
        paymentDate: d(3, 27),
        notes: null,
      },

      // ── ABRIL ────────────────────────────────────────────────
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-frete",
        costCenterId: "cc-comercial",
        customerId: "cust-xyz",
        supplierId: null,
        description: "Frete GYN → SP — Transportes XYZ",
        documentRef: "CT-e 000425",
        amount: 25000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 3),
        dueDate: d(4, 10),
        paymentDate: d(4, 9),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-armazenagem",
        costCenterId: "cc-operacional",
        customerId: "cust-abc",
        supplierId: null,
        description: "Armazenagem — abril/2026",
        documentRef: "NFS-e 000178",
        amount: 5600.00,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 15),
        dueDate: d(4, 20),
        paymentDate: d(4, 17),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-financeira",
        subcategoryId: "sub-cat-rec-financeira-rendimentos-bancarios",
        costCenterId: "cc-financeiro",
        customerId: null,
        supplierId: null,
        description: "Rendimentos conta PJ — abril/2026",
        documentRef: null,
        amount: 1800.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 30),
        dueDate: d(4, 30),
        paymentDate: d(4, 30),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-folha-beneficios",
        subcategoryId: "sub-cat-desp-folha-beneficios-salarios",
        costCenterId: "cc-rh",
        supplierId: null,
        customerId: null,
        description: "Folha de pagamento — abril/2026",
        documentRef: null,
        amount: 48000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 1),
        dueDate: d(4, 5),
        paymentDate: d(4, 5),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-operacionais",
        subcategoryId: "sub-cat-desp-operacionais-abastecimento",
        costCenterId: "cc-operacional",
        supplierId: "sup-posto",
        customerId: null,
        description: "Abastecimento frota — abril/2026",
        documentRef: null,
        amount: 7800.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 18),
        dueDate: d(4, 18),
        paymentDate: d(4, 18),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-instalacoes",
        subcategoryId: "sub-cat-desp-instalacoes-aluguel",
        costCenterId: "cc-administrativo",
        supplierId: "sup-aluguel",
        customerId: null,
        description: "Aluguel sede BSB — abril/2026",
        documentRef: "NF 000502",
        amount: 12000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 1),
        dueDate: d(4, 5),
        paymentDate: d(4, 5),
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-tecnologia-software",
        subcategoryId: "sub-cat-desp-tecnologia-software-erp",
        costCenterId: "cc-administrativo",
        supplierId: null,
        customerId: null,
        description: "Licença ERP — abril/2026",
        documentRef: null,
        amount: 2800.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PAID,
        competencyDate: d(4, 10),
        dueDate: d(4, 10),
        paymentDate: d(4, 10),
        notes: null,
      },

      // ── MAIO ─────────────────────────────────────────────────
      {
        companyId: "company-brasilia",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-frete",
        costCenterId: "cc-comercial",
        customerId: "cust-abc",
        supplierId: null,
        description: "Frete BSB → PR — Empresa ABC Logística",
        documentRef: "CT-e 000531",
        amount: 19000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PENDING,
        competencyDate: d(5, 6),
        dueDate: d(5, 15),
        paymentDate: null,
        notes: "Aguardando confirmação de entrega",
      },
      {
        companyId: "company-goiania",
        type: TransactionType.INCOME,
        categoryId: "cat-rec-operacional",
        subcategoryId: "sub-cat-rec-operacional-servicos-operacionais",
        costCenterId: "cc-operacional",
        customerId: "cust-xyz",
        supplierId: null,
        description: "Serviços operacionais — contrato maio/2026",
        documentRef: "NFS-e 000210",
        amount: 6800.00,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PENDING,
        competencyDate: d(5, 8),
        dueDate: d(5, 20),
        paymentDate: null,
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-folha-beneficios",
        subcategoryId: "sub-cat-desp-folha-beneficios-salarios",
        costCenterId: "cc-rh",
        supplierId: null,
        customerId: null,
        description: "Folha de pagamento — maio/2026",
        documentRef: null,
        amount: 48000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PENDING,
        competencyDate: d(5, 1),
        dueDate: d(5, 5),
        paymentDate: null,
        notes: null,
      },
      {
        companyId: "company-brasilia",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-instalacoes",
        subcategoryId: "sub-cat-desp-instalacoes-aluguel",
        costCenterId: "cc-administrativo",
        supplierId: "sup-aluguel",
        customerId: null,
        description: "Aluguel sede BSB — maio/2026",
        documentRef: "NF 000558",
        amount: 12000.00,
        paymentMethod: PaymentMethod.TRANSFERENCIA,
        status: TransactionStatus.PAID,
        competencyDate: d(5, 1),
        dueDate: d(5, 5),
        paymentDate: d(5, 5),
        notes: null,
      },
      {
        companyId: "company-goiania",
        type: TransactionType.EXPENSE,
        categoryId: "cat-desp-marketing-vendas",
        subcategoryId: "sub-cat-desp-marketing-vendas-meta-ads",
        costCenterId: "cc-mkt",
        supplierId: null,
        customerId: null,
        description: "Meta Ads — campanha maio/2026",
        documentRef: null,
        amount: 4200.00,
        paymentMethod: PaymentMethod.CARTAO_CREDITO,
        status: TransactionStatus.PENDING,
        competencyDate: d(5, 9),
        dueDate: d(5, 20),
        paymentDate: null,
        notes: null,
      },
    ];

    for (const tx of transactions) {
      await prisma.transaction.create({ data: tx });
    }
    console.log(`✅ ${transactions.length} lançamentos fake criados`);
  } else {
    console.log(`ℹ️  Lançamentos ignorados — banco já possui ${existingTxCount} transações`);
  }

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("📧 Login: admin@planetacargas.com.br");
  console.log("🔑 Senha: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
