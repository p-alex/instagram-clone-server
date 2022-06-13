import sgMail from "@sendgrid/mail";
import { ITemplate } from "./emailTemplates";

const sendEmail = async (
  to: string,
  template: ITemplate
): Promise<{ success: boolean; message: string }> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const msg = {
    to,
    from: "bubble.pistolalex@gmail.com",
    subject: template.subject,
    text: template.text,
    html: template.html,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Email Sent" };
  } catch (error: any) {
    return { success: false, message: error };
  }
};

export default sendEmail;
