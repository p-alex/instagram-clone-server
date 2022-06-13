import { clientBaseUrl } from "../utils/clientBaseURL";

export interface ITemplate {
  subject: string;
  text: string;
  html: string;
}

export const emailConfirmationTemplate = (
  username: string,
  token: string
): ITemplate => {
  return {
    subject: "Bubble | Email confirmation.",
    text: "Confirm your email",
    html: `<div style="text-align:center;position:relative; width:400px;padding:40px;margin:0 auto;background-color:white;font-family:Helvetica, sans-serif; border:solid silver 1px; border-radius: 10px">
    <h1 style="color: #4f518c;font-size: 1.9rem">Bubble</h1>

    <h2>Email Confirmation</h2>

    <br/><br/>

    <p style="font-size:1.1rem">
      Hi <span style="text-transform: capitalize;color: #4f518c; font-weight: bold">${username}</span>,
      <br/>
      Tap the button below to confirm your email.
    </p>

    <br/><br/>

    <a style="display:inline-block;text-decoration:none;background-color:#4f518c;padding:10px 20px;color:white;border-radius:5px;font-weight:bold;font-size:1.4rem;font-family:Helvetica, sans-serif;" href="${clientBaseUrl}/confirm-email/${token}" rel="noreferrer">Confirm</a>

    <br/><br/>

    <p>If that doesn't work, copy and paste the following link in your browser:<br/><br/>${clientBaseUrl}/confirm-email/${token}</p>
  </div>`,
  };
};

export const forgetPasswordTemplate = (
  username: string,
  token: string
): ITemplate => {
  return {
    subject: "Bubble | Reset password request.",
    text: "Request to reset your account's password.",
    html: `<div style="text-align:center;position:relative; width:400px;padding:40px;margin:0 auto;background-color:white;color:white;font-family:Helvetica, sans-serif; border:solid silver 1px; border-radius: 10px">
    <h1 style="color: #4f518c">Bubble</h1>

    <h2>Reset your password</h2>

    <br/><br/>

    <p style="color:white;font-size:1.1rem">
      Hi <span style="text-transform: capitalize">${username}</span>,
      <br/>
      Tap the button below to reset your account password.
      <br/>
      If you didn't request a new password, you can safely delete this email.
    </p>

    <br/><br/>

    <a style="display:inline-block;text-decoration:none;background-color:#4f518c;padding:10px 20px;color:white;border-radius:5px;font-weight:bold;font-size:1.4rem;font-family:Helvetica, sans-serif;" href="${clientBaseUrl}/user/reset-password/${token}" rel="noreferrer">Reset Password</a>

    <br/><br/>

    <p>If that doesn't work, copy and paste the following link in your browser:<br/><br/>${clientBaseUrl}/user/reset-password/${token}</p>
  </div>`,
  };
};
