import { Response } from 'express';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (payload: object): string =>
  sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE!,
  });

export const createRefreshToken = (payload: object): string =>
  sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE!,
  });

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE!),
  });
};
