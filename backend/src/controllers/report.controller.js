const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const { createLog, getClientIp } = require('../services/log.service');

const prisma = new PrismaClient();

const formatBool = (val) => (val ? 'Sim' : 'Não');
const formatCurrency = (val) => `R$ ${Number(val || 0).toFixed(2).replace('.', ',')}`;

const getForms = async (req, res) => {
  try {
    const { format = 'csv', schoolId, startDate, endDate } = req.query;

    const where = {};
    if (schoolId) where.schoolId = parseInt(schoolId);
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const forms = await prisma.socioeconomicForm.findMany({
      where,
      include: { school: { select: { name: true, city: true, state: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const data = forms.map((f) => ({
      ID: f.id,
      Anônimo: formatBool(f.anonymous),
      Responsável: f.responsibleName || 'Anônimo',
      CPF: f.cpf || '-',
      Telefone: f.phone || '-',
      Email: f.email || '-',
      Escola: f.school?.name || '-',
      Cidade: f.school?.city || '-',
      Estado: f.school?.state || '-',
      'Renda Familiar': formatCurrency(f.familyIncome),
      'Nº Moradores': f.residents,
      'Acesso à Internet': formatBool(f.internetAccess),
      'Acesso a Computador': formatBool(f.computerAccess),
      'Auxílio Governamental': formatBool(f.govAssistance),
      'Tipo de Auxílio': f.govAssistanceType || '-',
      Observações: f.observations || '-',
      'Data de Cadastro': new Date(f.createdAt).toLocaleDateString('pt-BR'),
    }));

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EXPORT',
      resource: 'forms',
      ip: getClientIp(req),
      details: `Exportação de ${forms.length} formulários em formato ${format.toUpperCase()}`,
    });

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Column widths
      ws['!cols'] = Object.keys(data[0] || {}).map((key) => ({ wch: Math.max(key.length, 15) }));

      XLSX.utils.book_append_sheet(wb, ws, 'Formulários');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', 'attachment; filename="formularios_ellp.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);
    }

    // CSV
    if (data.length === 0) {
      return res.status(404).json({ error: 'Nenhum dado encontrado' });
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(';'),
      ...data.map((row) =>
        headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(';')
      ),
    ];

    res.setHeader('Content-Disposition', 'attachment; filename="formularios_ellp.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send('\uFEFF' + csvRows.join('\n')); // BOM for Excel
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

const getSchools = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;

    const schools = await prisma.school.findMany({
      where: { active: true },
      include: { _count: { select: { forms: true } } },
      orderBy: { name: 'asc' },
    });

    const data = schools.map((s) => ({
      ID: s.id,
      Nome: s.name,
      Cidade: s.city,
      Estado: s.state,
      Endereço: s.address,
      Telefone: s.phone || '-',
      Responsável: s.responsible || '-',
      'Formulários Cadastrados': s._count.forms,
      'Data de Cadastro': new Date(s.createdAt).toLocaleDateString('pt-BR'),
    }));

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EXPORT',
      resource: 'schools',
      ip: getClientIp(req),
      details: `Exportação de ${schools.length} escolas em formato ${format.toUpperCase()}`,
    });

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
      XLSX.utils.book_append_sheet(wb, ws, 'Escolas');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', 'attachment; filename="escolas_ellp.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);
    }

    const headers = Object.keys(data[0] || {});
    const csvRows = [
      headers.join(';'),
      ...data.map((row) =>
        headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(';')
      ),
    ];

    res.setHeader('Content-Disposition', 'attachment; filename="escolas_ellp.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send('\uFEFF' + csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório de escolas' });
  }
};

module.exports = { getForms, getSchools };
