const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { createLog, getClientIp } = require('../services/log.service');

const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { state: { contains: search, mode: 'insensitive' } },
          ],
          active: true,
        }
      : { active: true };

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: { _count: { select: { forms: true } } },
      }),
      prisma.school.count({ where }),
    ]);

    res.json({
      data: schools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

const getById = async (req, res) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { _count: { select: { forms: true } } },
    });
    if (!school) return res.status(404).json({ error: 'Escola não encontrada' });
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const school = await prisma.school.create({ data: req.body });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'CREATE',
      resource: 'school',
      resourceId: school.id,
      ip: getClientIp(req),
      details: `Escola "${school.name}" criada`,
    });

    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar escola' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.school.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Escola não encontrada' });

    const school = await prisma.school.update({ where: { id }, data: req.body });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'UPDATE',
      resource: 'school',
      resourceId: school.id,
      ip: getClientIp(req),
      details: `Escola "${school.name}" atualizada`,
    });

    res.json(school);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.school.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Escola não encontrada' });

    await prisma.school.update({ where: { id }, data: { active: false } });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'DELETE',
      resource: 'school',
      resourceId: id,
      ip: getClientIp(req),
      details: `Escola "${existing.name}" removida`,
    });

    res.json({ message: 'Escola removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover escola' });
  }
};

const getAllSimple = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      where: { active: true },
      select: { id: true, name: true, city: true, state: true },
      orderBy: { name: 'asc' },
    });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

module.exports = { getAll, getById, create, update, remove, getAllSimple };
