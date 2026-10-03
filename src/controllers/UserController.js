import userService from '../services/UserService.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userService.getById(req.userId);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
