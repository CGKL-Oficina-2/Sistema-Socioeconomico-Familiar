const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ellp.utfpr.edu.br' },
    update: {},
    create: {
      name: 'Administrador ELLP',
      email: 'admin@ellp.utfpr.edu.br',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin criado:', admin.email);

  const volunteerPassword = await bcrypt.hash('voluntario123', 10);
  const volunteer = await prisma.user.upsert({
    where: { email: 'voluntario@ellp.utfpr.edu.br' },
    update: {},
    create: {
      name: 'Voluntário ELLP',
      email: 'voluntario@ellp.utfpr.edu.br',
      password: volunteerPassword,
      role: 'VOLUNTARIO',
    },
  });
  console.log('Voluntário criado:', volunteer.email);

  const schools = [
    {
      name: 'E.E. Prof. João Silva',
      city: 'Cornélio Procópio',
      state: 'PR',
      address: 'Rua das Flores, 100',
      phone: '(43) 3524-1234',
      responsible: 'Maria Souza',
    },
    {
      name: 'C.E. Zacarias de Góes',
      city: 'Cornélio Procópio',
      state: 'PR',
      address: 'Av. Paraná, 500',
      phone: '(43) 3524-5678',
      responsible: 'José Santos',
    },
    {
      name: 'E.M. Carlos Gomes',
      city: 'Bandeirantes',
      state: 'PR',
      address: 'Rua XV de Novembro, 200',
      phone: '(43) 3542-9012',
      responsible: 'Ana Oliveira',
    },
  ];

  for (const school of schools) {
    const created = await prisma.school.upsert({
      where: { id: schools.indexOf(school) + 1 },
      update: {},
      create: school,
    });
    console.log('Escola criada:', created.name);
  }

  const createdSchools = await prisma.school.findMany();
  const sampleForms = [
    { anonymous: false, responsibleName: 'Carlos Ferreira', cpf: '123.456.789-00', phone: '(43) 99999-1111', email: 'carlos@email.com', schoolId: createdSchools[0]?.id, familyIncome: 1500, residents: 4, internetAccess: true, computerAccess: false, govAssistance: true, govAssistanceType: 'Bolsa Família' },
    { anonymous: false, responsibleName: 'Fernanda Lima', cpf: '987.654.321-00', phone: '(43) 99999-2222', email: 'fernanda@email.com', schoolId: createdSchools[0]?.id, familyIncome: 2200, residents: 3, internetAccess: true, computerAccess: true, govAssistance: false },
    { anonymous: true, schoolId: createdSchools[1]?.id, familyIncome: 800, residents: 5, internetAccess: false, computerAccess: false, govAssistance: true, govAssistanceType: 'BPC' },
    { anonymous: false, responsibleName: 'Roberto Alves', cpf: '111.222.333-44', phone: '(43) 99999-3333', schoolId: createdSchools[1]?.id, familyIncome: 3000, residents: 2, internetAccess: true, computerAccess: true, govAssistance: false },
    { anonymous: true, schoolId: createdSchools[2]?.id, familyIncome: 1200, residents: 6, internetAccess: false, computerAccess: false, govAssistance: true, govAssistanceType: 'Bolsa Família' },
    { anonymous: false, responsibleName: 'Lucia Martins', cpf: '555.666.777-88', phone: '(43) 99999-4444', schoolId: createdSchools[2]?.id, familyIncome: 1800, residents: 3, internetAccess: true, computerAccess: false, govAssistance: false },
  ];

  for (const form of sampleForms) {
    await prisma.socioeconomicForm.create({ data: form });
  }
  console.log('Formulários de exemplo criados');

  console.log('\nSeed concluído com sucesso!');
  console.log('Admin: admin@ellp.utfpr.edu.br / senha: admin123');
  console.log('Voluntário: voluntario@ellp.utfpr.edu.br / senha: voluntario123');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });