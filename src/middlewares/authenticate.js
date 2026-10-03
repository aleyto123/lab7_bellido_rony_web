import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const token = authorization.slice('Bearer '.length);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = payload.sub;
    req.userRoles = payload.roles ?? [];
    return next();
  } catch {
    return res.status(401).json({ message: 'Token no válido o caducado' });
  }
}
