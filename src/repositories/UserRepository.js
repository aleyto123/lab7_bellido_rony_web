import User from '../models/User.js';

class UserRepository {
  create(userData) {
    return User.create(userData);
  }

  findByEmail(email) {
    return User.findOne({ email }).populate('roles').exec();
  }

  findById(id) {
    return User.findById(id).populate('roles').exec();
  }

  getAll() {
    return User.find()
      .select('-password')
      .populate('roles', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }
}

export default new UserRepository();
