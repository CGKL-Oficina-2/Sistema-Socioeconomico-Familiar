const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const [
      totalFamilies,
      totalSchools,
      forms,
      formsWithInternet,
      formsWithComputer,
      formsWithGovAssistance,
      formsBySchool,
      recentForms,
    ] = await Promise.all([
      prisma.socioeconomicForm.count(),
      prisma.school.count({ where: { active: true } }),
      prisma.socioeconomicForm.findMany({
        select: { familyIncome: true, residents: true, internetAccess: true, computerAccess: true, govAssistance: true },
      }),
      prisma.socioeconomicForm.count({ where: { internetAccess: true } }),
      prisma.socioeconomicForm.count({ where: { computerAccess: true } }),
      prisma.socioeconomicForm.count({ where: { govAssistance: true } }),
      prisma.socioeconomicForm.groupBy({
        by: ['schoolId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.socioeconomicForm.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          anonymous: true,
          responsibleName: true,
          familyIncome: true,
          createdAt: true,
          school: { select: { name: true } },
        },
      }),
    ]);

    const totalIncome = forms.reduce((sum, f) => sum + (f.familyIncome || 0), 0);
    const avgIncome = totalFamilies > 0 ? totalIncome / totalFamilies : 0;
    const avgResidents = totalFamilies > 0
      ? forms.reduce((sum, f) => sum + (f.residents || 0), 0) / totalFamilies
      : 0;

    // Income distribution
    const incomeRanges = [
      { label: 'Até R$ 500', min: 0, max: 500 },
      { label: 'R$ 500 - R$ 1.000', min: 500, max: 1000 },
      { label: 'R$ 1.000 - R$ 2.000', min: 1000, max: 2000 },
      { label: 'R$ 2.000 - R$ 3.000', min: 2000, max: 3000 },
      { label: 'Acima de R$ 3.000', min: 3000, max: Infinity },
    ];

    const incomeDistribution = incomeRanges.map((range) => ({
      label: range.label,
      count: forms.filter((f) => f.familyIncome >= range.min && f.familyIncome < range.max).length,
    }));

    // School distribution
    const schoolIds = formsBySchool.map((f) => f.schoolId).filter(Boolean);
    const schools = await prisma.school.findMany({
      where: { id: { in: schoolIds } },
      select: { id: true, name: true },
    });

    const schoolDistribution = formsBySchool.map((f) => ({
      schoolName: schools.find((s) => s.id === f.schoolId)?.name || 'Sem escola',
      count: f._count.id,
    }));

    res.json({
      summary: {
        totalFamilies,
        totalSchools,
        avgIncome: Math.round(avgIncome * 100) / 100,
        avgResidents: Math.round(avgResidents * 10) / 10,
        internetAccessRate: totalFamilies > 0 ? Math.round((formsWithInternet / totalFamilies) * 100) : 0,
        computerAccessRate: totalFamilies > 0 ? Math.round((formsWithComputer / totalFamilies) * 100) : 0,
        govAssistanceRate: totalFamilies > 0 ? Math.round((formsWithGovAssistance / totalFamilies) * 100) : 0,
      },
      charts: {
        incomeDistribution,
        schoolDistribution,
        accessComparison: [
          { name: 'Internet', hasAccess: formsWithInternet, noAccess: totalFamilies - formsWithInternet },
          { name: 'Computador', hasAccess: formsWithComputer, noAccess: totalFamilies - formsWithComputer },
          { name: 'Aux. Gov.', hasAccess: formsWithGovAssistance, noAccess: totalFamilies - formsWithGovAssistance },
        ],
      },
      recentForms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

module.exports = { getStats };
