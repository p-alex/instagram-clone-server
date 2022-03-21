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
  userId: string | null;
  username: string | null;
  profileImg: string | null;
  accessToken: string | null;
}

export const loginUser = async ({
  username,
  password,
  res,
}: loginUserType): Promise<ILoginUserResponse> => {
  const { isValid, message, user } = await loginUserValidation({
    username,
    password,
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
      userId: user.id!,
      username: user.username,
      profileImg: user.profilePicture,
      accessToken,
    };
  }
  return {
    statusCode: 401,
    success: isValid,
    message,
    userId: null,
    username: null,
    profileImg: null,
    accessToken: null,
  };
};
