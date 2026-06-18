const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { createLog, getClientIp } = require('../services/log.service');

const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', schoolId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (schoolId) where.schoolId = parseInt(schoolId);
    if (search) {
      where.OR = [
        { responsibleName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [forms, total] = await Promise.all([
      prisma.socioeconomicForm.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { school: { select: { id: true, name: true, city: true } } },
      }),
      prisma.socioeconomicForm.count({ where }),
    ]);

    res.json({
      data: forms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formulários' });
  }
};

const getById = async (req, res) => {
  try {
    const form = await prisma.socioeconomicForm.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { school: true },
    });
    if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formulário' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = { ...req.body };
    if (data.schoolId) data.schoolId = parseInt(data.schoolId);
    if (data.residents) data.residents = parseInt(data.residents);
    if (data.familyIncome) data.familyIncome = parseFloat(data.familyIncome);

    if (data.anonymous) {
      data.responsibleName = null;
      data.cpf = null;
      data.phone = null;
      data.email = null;
    }

    const form = await prisma.socioeconomicForm.create({ data });

    if (req.user) {
      await createLog({
        userId: req.user.id,
        userName: req.user.name,
        action: 'CREATE',
        resource: 'form',
        resourceId: form.id,
        ip: getClientIp(req),
        details: `Formulário #${form.id} criado`,
      });
    }

    res.status(201).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar formulário' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.socioeconomicForm.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Formulário não encontrado' });

    const data = { ...req.body };
    if (data.schoolId) data.schoolId = parseInt(data.schoolId);
    if (data.residents) data.residents = parseInt(data.residents);
    if (data.familyIncome) data.familyIncome = parseFloat(data.familyIncome);

    const form = await prisma.socioeconomicForm.update({ where: { id }, data });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'UPDATE',
      resource: 'form',
      resourceId: form.id,
      ip: getClientIp(req),
      details: `Formulário #${form.id} atualizado`,
    });

    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar formulário' });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.socioeconomicForm.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Formulário não encontrado' });

    await prisma.socioeconomicForm.delete({ where: { id } });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'DELETE',
      resource: 'form',
      resourceId: id,
      ip: getClientIp(req),
      details: `Formulário #${id} removido`,
    });

    res.json({ message: 'Formulário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover formulário' });
  }
};

module.exports = { getAll, getById, create, update, remove };
