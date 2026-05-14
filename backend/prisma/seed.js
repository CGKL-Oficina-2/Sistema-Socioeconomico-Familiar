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





   for (const school of schools) {
    const created = await prisma.school.upsert({
      where: { id: schools.indexOf(school) + 1 },
      update: {},
      create: school,
    });
    console.log('Escola criada:', created.name);
  }



  
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
