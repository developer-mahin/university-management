import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  payload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
