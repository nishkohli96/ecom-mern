import sgMail from '@sendgrid/mail';
import { ENV_VARS } from '@/app-constants/env_vars';

sgMail.setApiKey(ENV_VARS.sendgrid.apikey);

export async function sendVerificationEmail(
  emailTo: string,
  customerName: string
) {
  const msg = {
    from: { email: ENV_VARS.sendgrid.senderEmail },
    personalizations: [
      /* Will be an array of this object for multiple customers */
      {
        to: [{ email: emailTo }],
        dynamic_template_data: {
          customer_name: customerName,
          btnLink: 'https://www.google.co.in'
        }
      }
    ],
    template_id: ENV_VARS.sendgrid.signup_template_id
  };

  try {
    // @ts-ignore
    await sgMail.send(msg);
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
