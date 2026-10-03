import userRepository from '../repositories/UserRepository.js';

class UserService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((role) => role.name),
      createdAt: user.createdAt
    };
  }
}

export default new UserService();
