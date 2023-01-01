import User from '../../../../models/User';
import { clientBaseUrl } from '../../../../utils/clientBaseURL';
import { isValidEmail } from '../../../../utils/register-validation';
import jwt from 'jsonwebtoken';
import { forgetPasswordTemplate } from '../../../../sendgrid/emailTemplates';
import sendEmail from '../../../../sendgrid/sendEmail';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../../../interfaces';
import { validateHuman } from '../validators';

export const resetPasswordSendEmail = async (email: string, recaptchaToken: string) => {
  try {
    const isHuman = await validateHuman(recaptchaToken);

    if (!isHuman) return { statusCode: 402, success: false, message: 'You are a bot.' };
    if (!email)
      return {
        statusCode: 400,
        success: false,
        message: 'Please fill in the email field',
      };

    if (!isValidEmail(email))
      return { statusCode: 400, success: false, message: 'Invalid email' };

    const user: HydratedDocument<IUser> = await User.findOne({ email });

    if (!user || user.status !== 'Active')
      return {
        statusCode: 200,
        success: true,
        message: 'We sent you an email if an account with that email exists.',
      };

    const confirmationToken = jwt.sign(
      { email },
      process.env.RESET_PASSWORD_TOKEN_SECRET!
    );

    if (process.env.NODE_ENV === 'development')
      console.log(`${clientBaseUrl}/reset-password/${confirmationToken}`);

    if (process.env.NODE_ENV === 'production') {
      const sendConfirmationEmail = await sendEmail(
        email,
        forgetPasswordTemplate(confirmationToken)
      );
      if (!sendConfirmationEmail.success)
        throw new Error("Couldn't send confirmation email. Please try again later.");
    }

    user.confirmationCode = confirmationToken;

    await user.save();

    return {
      statusCode: 200,
      success: true,
      message: 'We sent you an email if an account with that email exists.',
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: error.message,
    };
  }
};
