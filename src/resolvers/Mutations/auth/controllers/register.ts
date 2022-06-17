import { hash } from "bcryptjs";
import { registerUserType } from "..";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";
import { registerUserValidation } from "../validators";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../sendgrid/sendEmail";
import { emailConfirmationTemplate } from "../../../../sendgrid/emailTemplates";
import { clientBaseUrl } from "../../../../utils/clientBaseURL";

interface IRegisterUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  user: { id: string; username: string } | null;
}

export const registerUser = async ({
  fullname,
  email,
  username,
  password,
  confirmPassword,
  recaptchaToken,
}: registerUserType): Promise<IRegisterUserResponse> => {
  const { isValid, message } = await registerUserValidation({
    fullname,
    email,
    username,
    password,
    confirmPassword,
    recaptchaToken,
  });
  if (!isValid) return { statusCode: 400, success: false, message, user: null };
  try {
    const hashedPassword = await hash(
      password,
      parseInt(process.env.SALT_ROUNDS!)
    );

    const confirmationCode = jwt.sign(
      { email },
      process.env.CONFIRM_EMAIL_TOKEN_SECRET!
    );

    if (process.env.NODE_ENV === "development") {
      console.log(`${clientBaseUrl}/confirm-email/${confirmationCode}`);
    }

    if (process.env.NODE_ENV === "production") {
      const sendConfirmationEmail = await sendEmail(
        email,
        emailConfirmationTemplate(username, confirmationCode)
      );
      if (!sendConfirmationEmail.success) {
        throw new Error(
          "Couldn't send confirmation email. Please try again later."
        );
      }
    }

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
      confirmationCode,
    });

    const result: IUser = await newUser.save();

    return {
      statusCode: 201,
      success: isValid,
      message,
      user: { id: result.id, username: result.username },
    };
  } catch (error: any) {
    return { statusCode: 500, success: isValid, message, user: null };
  }
};
