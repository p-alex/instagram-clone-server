import User from "../../../../models/User";

export const searchUsers = async (query: string) => {
  try {
    const searchResults = await User.aggregate([
      {
        $match: {
          username: { $regex: new RegExp(query) },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          username: "$username",
          profilePicture: "$profilePicture.smallPicture",
        },
      },
      {
        $limit: 10,
      },
    ]);
    return {
      statusCode: 200,
      success: true,
      message: "Searched successfully",
      results: searchResults,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
      results: null,
    };
  }
};
