import { Request } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/User";
import { ForbiddenError } from "apollo-server-core";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { IUser } from "../interfaces";

export const isAuth = async (
  req: Request
): Promise<{
  isAuthorized: boolean;
  userId: string | null;
  convertedUserId: Types.ObjectId | null;
  user: HydratedDocument<IUser> | null;
  message: string;
}> => {
  try {
    const isAuthorized = req.headers.authorization;
    if (!isAuthorized) throw new ForbiddenError("No Authorization header");
    const token = isAuthorized.split(" ")[1];
    if (!token)
      throw new ForbiddenError("No token in the authorization header");
    const tokenPayload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    if (!tokenPayload) throw new ForbiddenError("Invalid token");
    const user: HydratedDocument<IUser> = await User.findById({
      _id: tokenPayload.id,
    });
    if (!user)
      throw new ForbiddenError("User with the id from the token doesn't exist");
    return {
      isAuthorized: true,
      userId: tokenPayload.id,
      convertedUserId: new Types.ObjectId(tokenPayload.id),
      message: "Authenticated",
      user,
    };
  } catch (err: any) {
    return {
      isAuthorized: false,
      userId: null,
      convertedUserId: null,
      user: null,
      message: err.message,
    };
  }
};
