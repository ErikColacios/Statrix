"use server"
import { EmailTemplateResetPassword } from '@/components/EmailTemplateResetPassword';
import { Resend } from 'resend';
import crypto from "crypto"
import insertResetPasswordToken from './insertResetPasswordToken';

/**
 * Sends an email to the mail for reseting a user's password.
 * @param email
 * @returns 
 */
export async function sendEmailResetPassword(email:string) {
  try {

    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const token = crypto.randomBytes(32).toString("hex");

    // We insert the reset password token to the table 'reset_password_tokens'
    const response = await insertResetPasswordToken(email, token)
    
    if(!response?.success){
      return response?.message
    }
    
    const { error } = await resend.emails.send({
      from: 'Statrix <noreply@statrix.app>',
      to: [email],
      subject: 'Reset your password',
      react: EmailTemplateResetPassword({ token: token }),
    });

    if (error) {
      return "Error sending password reset link"
    }
  } catch (error) {
    return error;
  }
}