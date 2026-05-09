import { PrismaClient, TransactionType, PaymentMethod, TransactionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Usuário admin para testes
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
  const brasilia = await prisma.company.upsert({
    where: { id: "company-brasilia" },
    update: {},
    create: { id: "company-brasilia", name: "Brasília" },
  });
  const goiania = await prisma.company.upsert({
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
  const expenseCategoriesData = [
    {
      id: "cat-pessoal",
      name: "Pessoal",
      subcategories: ["Salários", "Benefícios", "Encargos", "Rescisões", "Pró-labore"],
    },
    {
      id: "cat-operacional",
      name: "Operacional",
      subcategories: ["Combustível", "Manutenção", "Pedágios", "Pneus", "Seguros"],
    },
    {
      id: "cat-administrativo",
      name: "Administrativo",
      subcategories: ["Aluguel", "Água", "Energia", "Internet", "Material de Escritório"],
    },
    {
      id: "cat-financeiro",
      name: "Financeiro",
      subcategories: ["Juros", "Tarifas Bancárias", "Empréstimos", "Multas"],
    },
    {
      id: "cat-impostos",
      name: "Impostos e Tributos",
      subcategories: ["ICMS", "ISS", "INSS", "FGTS", "Simples Nacional"],
    },
    {
      id: "cat-marketing",
      name: "Marketing",
      subcategories: ["Publicidade", "Eventos", "Brindes", "Redes Sociais"],
    },
  ];

  // Categorias de INCOME
  const incomeCategoriesData = [
    {
      id: "cat-fretes",
      name: "Fretes",
      subcategories: ["Frete Nacional", "Frete Estadual", "Frete Internacional"],
    },
    {
      id: "cat-servicos",
      name: "Serviços Prestados",
      subcategories: ["Consultoria", "Armazenagem", "Logística", "Outros Serviços"],
    },
    {
      id: "cat-outras-receitas",
      name: "Outras Receitas",
      subcategories: ["Comissões", "Bonificações", "Receitas Financeiras"],
    },
  ];

  for (const catData of expenseCategoriesData) {
    const category = await prisma.category.upsert({
      where: { id: catData.id },
      update: { type: "EXPENSE" },
      create: { id: catData.id, name: catData.name, type: "EXPENSE" },
    });
    for (const subName of catData.subcategories) {
      const subId = `sub-${catData.id}-${subName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
      await prisma.subcategory.upsert({
        where: { id: subId },
        update: {},
        create: { id: subId, name: subName, categoryId: category.id },
      });
    }
  }

  for (const catData of incomeCategoriesData) {
    const category = await prisma.category.upsert({
      where: { id: catData.id },
      update: { type: "INCOME" },
      create: { id: catData.id, name: catData.name, type: "INCOME" },
    });
    for (const subName of catData.subcategories) {
      const subId = `sub-${catData.id}-${subName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
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
    { id: "cust-silva", name: "João da Silva ME", email: "joao@silvaме.com.br", phone: "(11) 99999-0000" },
  ];
  for (const cust of customers) {
    await prisma.customer.upsert({
      where: { id: cust.id },
      update: {},
      create: cust,
    });
  }
  console.log("✅ Clientes criados");

  // Lançamentos de exemplo
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const sampleTransactions = [
    {
      companyId: brasilia.id,
      type: TransactionType.INCOME,
      categoryId: "cat-fretes",
      subcategoryId: "sub-cat-fretes-frete-nacional",
      costCenterId: "cc-comercial",
      customerId: "cust-abc",
      supplierId: null,
      description: "Frete BSB → GYN — Empresa ABC",
      documentRef: "CT-e 001234",
      amount: 12500.00,
      paymentMethod: PaymentMethod.PIX,
      status: TransactionStatus.PAID,
      competencyDate: new Date(today.getFullYear(), today.getMonth(), 5),
      dueDate: new Date(today.getFullYear(), today.getMonth(), 5),
      paymentDate: new Date(today.getFullYear(), today.getMonth(), 5),
      notes: null,
    },
    {
      companyId: goiania.id,
      type: TransactionType.INCOME,
      categoryId: "cat-fretes",
      subcategoryId: "sub-cat-fretes-frete-nacional",
      costCenterId: "cc-comercial",
      customerId: "cust-xyz",
      supplierId: null,
      description: "Frete GYN → SP — Transportes XYZ",
      documentRef: "CT-e 001235",
      amount: 18000.00,
      paymentMethod: PaymentMethod.TRANSFERENCIA,
      status: TransactionStatus.PENDING,
      competencyDate: new Date(today.getFullYear(), today.getMonth(), 8),
      dueDate: new Date(today.getFullYear(), today.getMonth(), 15),
      paymentDate: null,
      notes: "Aguardando confirmação do cliente",
    },
    {
      companyId: brasilia.id,
      type: TransactionType.EXPENSE,
      categoryId: "cat-operacional",
      subcategoryId: "sub-cat-operacional-combustvel",
      costCenterId: "cc-operacional",
      supplierId: "sup-posto",
      customerId: null,
      description: "Abastecimento frota — semana 1",
      documentRef: null,
      amount: 3200.00,
      paymentMethod: PaymentMethod.CARTAO_CREDITO,
      status: TransactionStatus.PAID,
      competencyDate: new Date(today.getFullYear(), today.getMonth(), 3),
      dueDate: new Date(today.getFullYear(), today.getMonth(), 10),
      paymentDate: new Date(today.getFullYear(), today.getMonth(), 3),
      notes: null,
    },
    {
      companyId: brasilia.id,
      type: TransactionType.EXPENSE,
      categoryId: "cat-pessoal",
      subcategoryId: "sub-cat-pessoal-salrios",
      costCenterId: "cc-rh",
      supplierId: null,
      customerId: null,
      description: "Folha de pagamento — maio/2026",
      documentRef: null,
      amount: 45000.00,
      paymentMethod: PaymentMethod.TRANSFERENCIA,
      status: TransactionStatus.PENDING,
      competencyDate: firstDay,
      dueDate: new Date(today.getFullYear(), today.getMonth(), 5),
      paymentDate: null,
      notes: null,
    },
    {
      companyId: goiania.id,
      type: TransactionType.EXPENSE,
      categoryId: "cat-operacional",
      subcategoryId: "sub-cat-operacional-manuteno",
      costCenterId: "cc-operacional",
      supplierId: "sup-mecanica",
      customerId: null,
      description: "Revisão truck Volvo FH — placa ABC-1234",
      documentRef: "NF 009876",
      amount: 8500.00,
      paymentMethod: PaymentMethod.BOLETO,
      status: TransactionStatus.OVERDUE,
      competencyDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
      dueDate: new Date(today.getFullYear(), today.getMonth() - 1, 28),
      paymentDate: null,
      notes: "Boleto vencido — renegociar com fornecedor",
    },
    {
      companyId: brasilia.id,
      type: TransactionType.EXPENSE,
      categoryId: "cat-administrativo",
      subcategoryId: "sub-cat-administrativo-aluguel",
      costCenterId: "cc-administrativo",
      supplierId: "sup-aluguel",
      customerId: null,
      description: "Aluguel sede — maio/2026",
      documentRef: "NF 000456",
      amount: 6800.00,
      paymentMethod: PaymentMethod.TRANSFERENCIA,
      status: TransactionStatus.PAID,
      competencyDate: firstDay,
      dueDate: new Date(today.getFullYear(), today.getMonth(), 5),
      paymentDate: new Date(today.getFullYear(), today.getMonth(), 5),
      notes: null,
    },
  ];

  for (const tx of sampleTransactions) {
    await prisma.transaction.create({ data: tx });
  }
  console.log("✅ Lançamentos de exemplo criados");

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
