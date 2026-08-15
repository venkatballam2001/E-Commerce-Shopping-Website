import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_e_commerce_2026_change_in_production', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
