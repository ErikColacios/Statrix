import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Logged users don't see the landing page, they go straight to their feed
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    //return NextResponse.redirect(new URL("/community", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
