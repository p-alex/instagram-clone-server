import { Request } from "express";
import { getComments } from "./controllers/getCommentsController";

export default {
  getComments: (
    _: unknown,
    {
      postId,
      maxCommentsPerPage,
      currentPage,
    }: { postId: string; maxCommentsPerPage: number; currentPage: number },
    { req }: { req: Request }
  ) => getComments(postId, maxCommentsPerPage, currentPage, req),
};
