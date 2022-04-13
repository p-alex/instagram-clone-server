import { Request } from 'express';
import getSuggestions from './controllers/getSuggestions';

export default {
  getSuggestions: (_: unknown, __: unknown, { req }: { req: Request }) =>
    getSuggestions(req),
};
