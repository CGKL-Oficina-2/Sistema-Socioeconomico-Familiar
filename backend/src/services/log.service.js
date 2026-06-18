const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createLog = async ({ userId, userName, action, resource, resourceId, details, ip }) => {
  try {
    await prisma.log.create({
      data: {
        userId: userId || null,
        userName: userName || null,
        action,
        resource,
        resourceId: resourceId || null,
        details: details || null,
        ip: ip || null,
      },
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
};

const getClientIp = (req) => {
  return req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
};

module.exports = { createLog, getClientIp };
