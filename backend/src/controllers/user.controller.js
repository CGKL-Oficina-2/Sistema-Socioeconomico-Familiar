const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createLog, getClientIp } = require('../services/log.service');

const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || 'VOLUNTARIO' },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'CREATE',
      resource: 'user',
      resourceId: user.id,
      ip: getClientIp(req),
      details: `Usuário "${user.name}" criado`,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id);
    const { name, email, role, active } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, active },
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'UPDATE',
      resource: 'user',
      resourceId: id,
      ip: getClientIp(req),
      details: `Usuário "${user.name}" atualizado`,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ error: 'Não é possível remover seu próprio usuário' });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await prisma.user.update({ where: { id }, data: { active: false } });

    await createLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'DELETE',
      resource: 'user',
      resourceId: id,
      ip: getClientIp(req),
      details: `Usuário "${user.name}" desativado`,
    });

    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
};

module.exports = { getAll, create, update, remove };
