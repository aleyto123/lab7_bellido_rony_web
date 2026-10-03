import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import roleRepository from '../repositories/RoleRepository.js';
import userRepository from '../repositories/UserRepository.js';

class AuthService {
  async signUp({ email, password, name, roles = ['user'] }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error('El email ya se encuentra en uso');
      error.status = 400;
      throw error;
    }

    const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const roleIds = [];

    for (const roleName of roles) {
      let role = await roleRepository.findByName(roleName);
      if (!role) role = await roleRepository.create({ name: roleName });
      roleIds.push(role._id);
    }

    const user = await userRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      roles: roleIds
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name
    };
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    const validPassword = user && await bcrypt.compare(password, user.password);

    if (!user || !validPassword) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        roles: user.roles.map((role) => role.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token };
  }
}

export default new AuthService();
