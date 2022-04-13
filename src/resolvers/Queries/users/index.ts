import { Request } from 'express';
import { getUser } from './controllers/getUser';

export default {
  getUser: (
    _: unknown,
    {
      username,
      authenticatedUserId,
    }: { username: string; authenticatedUserId: string | null },
    { req }: { req: Request }
  ) => getUser(username, authenticatedUserId, req),
};
