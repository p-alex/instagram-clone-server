import { Request } from "express";
import { getUser } from "./controllers/getUser";
import { getUserFollowers } from "./controllers/getUserFollowers";

export default {
  getUser: (
    _: unknown,
    {
      username,
      authenticatedUserId,
    }: { username: string; authenticatedUserId: string | null },
    { req }: { req: Request }
  ) => getUser(username, authenticatedUserId, req),
  getUserFollowers: (
    _: unknown,
    {
      userId,
      type,
      currentPage,
      maxUsersPerPage,
    }: {
      userId: string;
      type: "followers" | "following";
      currentPage: number;
      maxUsersPerPage: number;
    },
    { req }: { req: Request }
  ) => getUserFollowers(userId, type, currentPage, maxUsersPerPage, req),
};
