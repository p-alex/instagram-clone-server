import { loginUserType } from '..';
import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenCookie,
} from '../../../../security/jwt';
import { loginUserValidation } from '../validators';

interface ILoginUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  user: {
    id: string | null;
    username: string | null;
    email: string | null;
    bio: string | null;
    fullname: string | null;
    profilePicture: {
      fullPicture: string;
      smallPicture: string;
    } | null;
    hasFollowings: boolean | null;
    accessToken: string | null;
  } | null;
}

export const loginUser = async ({
  username,
  password,
  recaptchaToken,
  res,
}: loginUserType): Promise<ILoginUserResponse> => {
  const { isValid, message, user } = await loginUserValidation({
    username,
    password,
    recaptchaToken,
  });
  if (isValid && user?.refreshToken) {
    const accessToken = createAccessToken({ id: user.id });
    const refreshToken = createRefreshToken({ id: user.id });
    user.refreshToken = [...user.refreshToken, refreshToken];
    await user.save();
    setRefreshTokenCookie(res!, refreshToken);
    return {
      statusCode: 200,
      success: isValid,
      message,
      user: {
        id: user.id!,
        username: user.username,
        profilePicture: {
          fullPicture: user.profilePicture.fullPicture,
          smallPicture: user.profilePicture.smallPicture,
        },
        fullname: user.fullname,
        bio: user.bio,
        email: user.email,
        hasFollowings: user.following.count > 0,
        accessToken,
      },
    };
  }
  return {
    statusCode: 401,
    success: isValid,
    message,
    user: null,
  };
};
