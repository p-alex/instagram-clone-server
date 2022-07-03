import { Request } from "express";
import { Types } from "mongoose";
import User from "../../../../models/User";
import { isAuth } from "../../../../security/isAuth";

interface IAggregation {
  users: {
    id: string;
    username: string;
    profilePicture: string;
    isFollowed: boolean;
  }[];
}

export const getUserFollowers = async (
  userId: string,
  type: "followers" | "following",
  currentPage: number,
  maxUsersPerPage: number,
  req: Request
) => {
  const { isAuthorized, message, user } = await isAuth(req);

  if (!isAuthorized)
    return { statusCode: 401, success: false, message, followers: null };

  try {
    const pipeline = [
      {
        $match: {
          _id: new Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 0,
          users: `$${type}.${type}List`,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: "$_id",
                username: 1,
                profilePicture: "$profilePicture.smallPicture",
                isFollowed: {
                  $in: [new Types.ObjectId(user!.id), `$${type}.${type}List`],
                },
              },
            },
            {
              $skip: maxUsersPerPage * currentPage,
            },
            {
              $limit: maxUsersPerPage,
            },
          ],
        },
      },
    ];

    const response: IAggregation[] = await User.aggregate(pipeline);

    const users = response[0].users;

    return {
      statusCode: 200,
      success: true,
      message: "Users found",
      users,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      followers: null,
    };
  }
};
