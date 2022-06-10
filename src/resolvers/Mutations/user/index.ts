import { Request } from "express";
import { changeProfilePicture } from "./controllers/changeProfilePicture";
import { editProfile } from "./controllers/editProfile";
import followOrUnfollowUser from "./controllers/followOrUnfollowUser";
import { removeProfilePicture } from "./controllers/removeProfilePicture";

export default {
  followOrUnfollowUser: (
    _: unknown,
    { userId, type }: { userId: string; type: "Follow" | "Unfollow" },
    { req }: { req: Request }
  ) => followOrUnfollowUser(userId, type, req),

  changeProfilePicture: (
    _: unknown,
    { image }: { image: string },
    { req }: { req: Request }
  ) => changeProfilePicture(image, req),

  removeProfilePicture: (_: unknown, __: unknown, { req }: { req: Request }) =>
    removeProfilePicture(req),

  editProfile: (
    _: unknown,
    {
      fullname,
      username,
      bio,
    }: { fullname: string; username: string; bio: string },
    { req }: { req: Request }
  ) => editProfile(fullname, username, bio, req),
};
