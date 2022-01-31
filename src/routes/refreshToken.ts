import express from 'express';
import { sign, verify } from 'jsonwebtoken';
import { IUser } from '../interfaces';
import User from '../models/User';
const router = express.Router();

type tokenPayload = {
  id: string;
  username: string;
  iat: number;
  exp: number;
};

// 1. Check if token exists in req.cookies
// 2. Decode token
// 3. Check if user with the id from the decoded token exists
// 4. Check if the refresh token from the user is equal to the token from req.cookies
// 5. Create new access and refresh tokens
// 6. Update the user's refresh token in the database
// 7. Send a new httpOnly cookie to the client containing the new refresh token
// 8. Send the access token as a json response back to the client

router.post('/refresh_token', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ accessToken: '' });
  let tokenData: { id: string; username: string };
  try {
    const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as tokenPayload;
    tokenData = { id: payload.id, username: payload.username };
  } catch (err) {
    return res.status(401).json({ accessToken: '' });
  }
  const user: IUser = await User.findById({ _id: tokenData.id });
  if (!user) return res.status(401).json({ accessToken: '' });
  if (user.refreshToken !== token) return res.status(401).json({ accessToken: '' });
  const accessToken = sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '10m' }
  );
  const refreshToken = sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );
  await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken } });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/refresh_token',
  });
  res.status(200).json({ accessToken });
});

export default router;
