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
    secure: true,
    sameSite: 'none',
    maxAge: 1209600000,
  });
};
