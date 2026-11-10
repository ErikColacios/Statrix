"use server"
import { EmailTemplateResetPassword } from '@/components/EmailTemplateResetPassword';
import { Resend } from 'resend';
import crypto from "crypto"
import insertResetPasswordToken from './insertResetPasswordToken';
import getUserByEmail from './getUserByEmail';
import normalizeEmail from '@/util/normalizeEmail';

/**
 * Sends an email to the mail for reseting a user's password.
 * If there's no account with this email, nothing is sent but the response is the same,
 * so the page doesn't reveal which emails are registered.
 * @param email
 * @returns An error message, or undefined if everything went right
 */
export async function sendEmailResetPassword(emailInput:string) {
  const email: string = normalizeEmail(emailInput)
  try {

    // No account with this email: we finish as if the email had been sent
    const usersWithEmail = await getUserByEmail(email)
    if (usersWithEmail == 0) {
      return;
    }

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
    // The error is logged, but not returned: it could show internal details in the page
    console.error("Error sending password reset email:", error);
    return "Error sending password reset link. Try again later."
  }
}