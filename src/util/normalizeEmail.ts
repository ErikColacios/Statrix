/**
 * Emails are stored trimmed and in lowercase, so "Erik@Gmail.com " and "erik@gmail.com" are the same account.
 */
export default function normalizeEmail(email: string | null | undefined): string {
    return (email ?? "").trim().toLowerCase();
}
