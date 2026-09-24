"use server"
import { NextResponse } from "next/server";

export async function GET() {
        const steamUrl = new URL("https://steamcommunity.com/openid/login");

        steamUrl.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
        steamUrl.searchParams.set("openid.mode", "checkid_setup");
        steamUrl.searchParams.set("openid.return_to", `${process.env.NEXTAUTH_URL}/api/steam/callback`);
        steamUrl.searchParams.set("openid.realm", `${process.env.NEXTAUTH_URL}/`);
        steamUrl.searchParams.set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
        steamUrl.searchParams.set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");

        return NextResponse.redirect(steamUrl);
}