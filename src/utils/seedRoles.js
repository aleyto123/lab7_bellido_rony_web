import roleRepository from '../repositories/RoleRepository.js';

export default async function seedRoles() {
  const existingRoles = await roleRepository.getAll();
  const existingNames = new Set(existingRoles.map((role) => role.name));

  for (const name of ['user', 'admin']) {
    if (!existingNames.has(name)) {
      await roleRepository.create({ name });
    }
  }

  console.log('Roles verificados: user, admin');
}
