import Role from '../models/Role.js';

class RoleRepository {
  findByName(name) {
    return Role.findOne({ name }).exec();
  }

  create(roleData) {
    return Role.create(roleData);
  }

  getAll() {
    return Role.find().sort({ name: 1 }).exec();
  }
}

export default new RoleRepository();
