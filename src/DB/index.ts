import User from '../app/Modules/User/user.model';
import config from '../app/config';

const superAdmin = {
  id: '0001',
  email: config.super_email,
  needsPasswordChange: false,
  password: config.super_password,
  role: 'superAdmin',
  isDeleted: false,
  status: 'in-progress',
};

const seedSuperAdmin = async () => {
  // if super admin is not exist
  const isSuperAdminExist = await User.findOne({ role: 'superAdmin' });
  if (!isSuperAdminExist) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
