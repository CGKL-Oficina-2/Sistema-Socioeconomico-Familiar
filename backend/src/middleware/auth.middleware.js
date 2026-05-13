const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        error: 'Token não fornecido',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Token não fornecido',
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    switch (error.name) {
      case 'JsonWebTokenError':
        return res.status(401).json({
          error: 'Token inválido',
        });

      case 'TokenExpiredError':
        return res.status(401).json({
          error: 'Token expirado',
        });

      default:
        return next(error);
    }
  }
}

module.exports = {
  authenticate,
};