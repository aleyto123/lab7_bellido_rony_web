import authService from '../services/AuthService.js';

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password, name, roles } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'El email y password son requeridos' });
      }

      const user = await authService.signUp({ email, password, name, roles });
      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'El email y password son requeridos' });
      }

      const token = await authService.signIn({ email, password });
      return res.status(200).json(token);
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
