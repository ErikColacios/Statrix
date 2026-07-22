"use server"
import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';
import crypto from "crypto"
import insertEmailVerificationToken from './insertEmailVerificationToken';


/**
 * Sends an email to the mail of the user signing up. 
 * @param userId
 * @param userName
 * @param email
 * @returns 
 */
export async function sendEmail(userId:string, userName:string, email:string) {
  try {

    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const token = crypto.randomBytes(32).toString("hex");

    // We insert the verification token to the table 'email_verification_tokens'
    insertEmailVerificationToken(userId, token)

    const { data, error } = await resend.emails.send({
      from: 'Statrix <noreply@statrix.app>',
      to: [email],
      subject: 'Verify your account',
      react: EmailTemplate({ userName: userName, token: token }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}