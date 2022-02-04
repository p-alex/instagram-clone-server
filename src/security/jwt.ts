import { Response } from 'express';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (payload: object, expiresIn: string): string =>
  sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn });

export const createRefreshToken = (payload: object, expiresIn: string): string =>
  sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn });

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE!),
  });
};
