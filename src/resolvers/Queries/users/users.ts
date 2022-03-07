import { Request } from 'express';
import { getUser } from './controllers/getUser';

export default {
  getUser: (_: unknown, { username }: { username: string }, { req }: { req: Request }) =>
    getUser(username, req),
};
