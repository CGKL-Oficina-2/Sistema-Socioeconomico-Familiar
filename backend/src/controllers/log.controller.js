const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, resource } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.log.count({ where }),
    ]);

    res.json({
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

module.exports = { getAll };
