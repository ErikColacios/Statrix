"use server"
import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Statrix <noreply@statrix.app>',
      to: ['ecolaciosgarcia@gmail.com'],
      subject: 'Verify your account',
      react: EmailTemplate({ userName: 'Erikito' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}