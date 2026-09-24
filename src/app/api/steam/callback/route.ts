import updateUserSteamId from "@/actions/updateUserSteamId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const steamParams = new URLSearchParams(searchParams);

  steamParams.set("openid.mode", "check_authentication");

  const response = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: steamParams.toString(),
  });

  if (!response.ok) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?steam=error`,
    );
  }
  const validationResponse = await response.text();

  if (!validationResponse.includes("is_valid:true")) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?steam=invalid`,
    );
  }

  const claimedId = searchParams.get("openid.claimed_id");

  const steamIdMatch = claimedId?.match(
    /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/,
  );

  if (!steamIdMatch) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?steam=invalid`,
    );
  }

  const steamId = steamIdMatch[1];

  updateUserSteamId(steamId);

  return NextResponse.redirect(
    `${process.env.NEXTAUTH_URL}/settings?steam=connected`,
  );
}
