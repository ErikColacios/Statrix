"use server"
import React from "react";
import satori from "satori";
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import getUserGameStats from "@/actions/getUserGameStats";
import { getUserTotalHoursPlayed } from "@/actions/getUserTotalHoursPlayed";
import { formatNumber, imageToDataUri, loadFonts, localImageToDataUri, toCoverUrl } from "@/util/shareImage";

const WIDTH = 1080;
const HEIGHT = 1920;
const PADDING = 60;
const INNER_WIDTH = WIDTH - PADDING * 2; // 960
const GAP = 24;
const BANNER_HEIGHT = 300;
const AVATAR_SIZE = 260;
const MOST_PLAYED_WIDTH = 616;
const MOST_PLAYED_HEIGHT = 620;
const COVER_WIDTH = 166;
const COVER_HEIGHT = 222;
const GREEN = "#22c55e";

/**
 * Generates the shareable stats card (1080x1920 JPEG, stories format) of the logged user.
 * Bento layout like the profile page: profile, most played, stats and favourite games.
 * @returns The image as a base64 data URI
 */
export default async function getUserShareCard(): Promise<{ success: boolean, message: string, image?: string }> {
    const session: any = await getSessionUser();
    const userName: string | undefined = session?.user?.name;
    if (!userName) {
        return { success: false, message: "You must be logged in." };
    }

    try {
        const userInfo = await getUserInfo(userName);
        if (userInfo.length == 0) {
            return { success: false, message: "User not found." };
        }
        const user = userInfo[0];

        const [stats, totalHours] = await Promise.all([
            getUserGameStats(userName),
            getUserTotalHoursPlayed(userName),
        ]);
        const mostPlayed = stats.topGames[0];
        // Favourite games, or the most played ones if the user has no favourites
        const coverGames = stats.favGames.length > 0 ? stats.favGames : stats.topGames;

        const avatarUrl = user.user_avatar
            ? `https://media.statrix.app/avatars/${user.user_id}/${user.user_avatar}`
            : null;
        const bannerUrl = user.user_banner
            ? `https://media.statrix.app/banners/${user.user_id}/${user.user_banner}`
            : null;

        const [avatar, banner, bannerBlurred, mostPlayedCover, covers, logo, avatarDefault, [interBold, inter]] = await Promise.all([
            avatarUrl ? imageToDataUri(avatarUrl, AVATAR_SIZE * 2, AVATAR_SIZE * 2) : null,
            bannerUrl ? imageToDataUri(bannerUrl, INNER_WIDTH, BANNER_HEIGHT) : null,
            bannerUrl ? imageToDataUri(bannerUrl, WIDTH, 900, true) : null,
            // Full size cover, the small one looks blurry at this size
            mostPlayed ? imageToDataUri(mostPlayed.game_base_image, MOST_PLAYED_WIDTH, MOST_PLAYED_HEIGHT) : null,
            Promise.all(coverGames.map((g) => imageToDataUri(toCoverUrl(g.game_base_image), COVER_WIDTH * 2, COVER_HEIGHT * 2))),
            readFile(path.join(process.cwd(), "public/logos/st2_white.png")),
            readFile(path.join(process.cwd(), "public/avatarImages/avatar_default.jpg")),
            loadFonts(),
        ]);

        const avatarSrc = avatar ?? `data:image/jpeg;base64,${avatarDefault.toString("base64")}`;
        const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
        // Same default banner as the profile page
        const bannerSrc = banner ?? await localImageToDataUri("public/bannerImages/banner_default.jpg", INNER_WIDTH, BANNER_HEIGHT);
        const bannerBlurredSrc = bannerBlurred ?? await localImageToDataUri("public/bannerImages/banner_default.jpg", WIDTH, 900, true);

        const svg = await satori(
            (
                <div style={{ width: WIDTH, height: HEIGHT, display: "flex", position: "relative", backgroundColor: "#000", color: "#fff", fontFamily: "Inter" }}>
                    {/* The banner, blurred, tints the top of the card (like the profile page) */}
                    <img alt="" src={bannerBlurredSrc} width={WIDTH} height={900} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover", opacity: 0.45 }} />
                    <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: 900, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 60%, #000 100%)" }} />

                    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: PADDING, gap: GAP }}>

                        {/* Profile tile: banner with the avatar over its bottom edge and the name */}
                        <div style={{ display: "flex", flexDirection: "column", position: "relative", borderRadius: 40, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(24,24,27,0.7)" }}>
                            <img alt="" src={bannerSrc} width={INNER_WIDTH} height={BANNER_HEIGHT} style={{ objectFit: "cover" }} />
                            <img alt="" src={avatarSrc} width={AVATAR_SIZE} height={AVATAR_SIZE} style={{ position: "absolute", top: BANNER_HEIGHT - AVATAR_SIZE / 2, left: 40, borderRadius: 9999, border: "8px solid #09090b", objectFit: "cover" }} />

                            {/* Left padding = avatar left + avatar size + gap. The min height leaves room for the part of the avatar below the banner */}
                            <div style={{ display: "flex", flexDirection: "column", padding: `28px 40px 32px ${40 + AVATAR_SIZE + 32}px`, minHeight: AVATAR_SIZE / 2 + 40 }}>
                                <div style={{ display: "flex", fontSize: user.user_name.length > 14 ? 48 : 64, fontWeight: 700, lineHeight: 1.1 }}>{user.user_name}</div>
                                {/* Long bios are cut to 3 lines */}
                                {user.user_bio && <div style={{ display: "block", marginTop: 12, fontSize: 28, lineHeight: 1.35, color: "#a1a1aa", lineClamp: 3 }}>{user.user_bio}</div>}
                            </div>
                        </div>

                        {/* Most played game (cover) + hours played */}
                        <div style={{ display: "flex", height: MOST_PLAYED_HEIGHT, gap: GAP }}>
                            <div style={{ width: MOST_PLAYED_WIDTH, display: "flex", position: "relative", borderRadius: 40, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(24,24,27,0.7)" }}>
                                {/* The tile has a 2px border, so the image and the gradient are 4px smaller */}
                                {mostPlayedCover && <img alt="" src={mostPlayedCover} width={MOST_PLAYED_WIDTH - 4} height={MOST_PLAYED_HEIGHT - 4} style={{ position: "absolute", top: 0, left: 0, borderRadius: 38, objectFit: "cover" }} />}
                                <div style={{ position: "absolute", top: 0, left: 0, width: MOST_PLAYED_WIDTH - 4, height: MOST_PLAYED_HEIGHT - 4, borderRadius: 38, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,1) 100%)" }} />
                                <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", padding: 36, width: MOST_PLAYED_WIDTH - 4 }}>
                                    <div style={{ fontSize: 28, color: "#d4d4d8" }}>Most played</div>
                                    {mostPlayed
                                        ? <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ marginTop: 8, fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>{mostPlayed.game_name}</div>
                                            <div style={{ marginTop: 10, fontSize: 30, color: GREEN }}>{`${formatNumber(Number(mostPlayed.hours_played) || 0)} h played`}</div>
                                        </div>
                                        : <div style={{ marginTop: 8, fontSize: 32, color: "#a1a1aa" }}>No played games yet</div>}
                                </div>
                            </div>

                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", padding: 36, borderRadius: 40, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(24,24,27,0.7)" }}>
                                <div style={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, display: "flex", backgroundImage: "radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0) 70%)" }} />
                                <div style={{ fontSize: 28, color: "#a1a1aa" }}>Hours played</div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ fontSize: formatNumber(Number(totalHours) || 0).length > 5 ? 80 : 104, fontWeight: 700, lineHeight: 1, color: GREEN }}>{formatNumber(Number(totalHours) || 0)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Game stats */}
                        <div style={{ display: "flex", gap: GAP }}>
                            {[
                                { label: "All games", value: stats.gamesAll, color: "#fff", glow: "rgba(255,255,255,0.12)" },
                                { label: "Playing", value: stats.gamesPlaying, color: "#60a5fa", glow: "rgba(59,130,246,0.3)" },
                                { label: "Completed", value: stats.gamesCompleted, color: "#4ade80", glow: "rgba(34,197,94,0.3)" },
                            ].map((box) => (
                                <div key={box.label} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", padding: "30px 32px", borderRadius: 40, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(24,24,27,0.7)" }}>
                                    <div style={{ position: "absolute", top: -90, right: -90, width: 240, height: 240, display: "flex", backgroundImage: `radial-gradient(circle, ${box.glow} 0%, rgba(0,0,0,0) 70%)` }} />
                                    <div style={{ fontSize: 28, color: "#a1a1aa" }}>{box.label}</div>
                                    <div style={{ marginTop: 12, fontSize: 80, fontWeight: 700, lineHeight: 1, color: box.color }}>{formatNumber(box.value)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Favourite games (or most played if there are no favourites) */}
                        <div style={{ display: "flex", flexDirection: "column", padding: 32, borderRadius: 40, border: "2px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(24,24,27,0.7)" }}>
                            <div style={{ fontSize: 28, color: "#a1a1aa", marginBottom: 20 }}>{stats.favGames.length > 0 ? "Favourite games" : "Most played games"}</div>
                            <div style={{ display: "flex", gap: 16 }}>
                                {Array.from({ length: 5 }, (_, i) => (
                                    covers[i]
                                        ? <img key={i} alt="" src={covers[i]!} width={COVER_WIDTH} height={COVER_HEIGHT} style={{ borderRadius: 20, objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }} />
                                        : <div key={i} style={{ width: COVER_WIDTH, height: COVER_HEIGHT, display: "flex", borderRadius: 20, border: "2px dashed rgba(255,255,255,0.15)", backgroundColor: "rgba(39,39,42,0.4)" }} />
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                            <img alt="" src={logoSrc} width={220} height={52} style={{ objectFit: "contain" }} />
                            <div style={{ display: "flex", fontSize: 32, color: "#d4d4d8" }}>
                                Track your games at&nbsp;<span style={{ color: GREEN, fontWeight: 700 }}>statrix.app</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: WIDTH,
                height: HEIGHT,
                fonts: [
                    { name: "Inter", data: interBold, weight: 700 },
                    { name: "Inter", data: inter, weight: 600 },
                ],
            }
        );

        const jpeg = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();

        return { success: true, message: "Card generated.", image: `data:image/jpeg;base64,${jpeg.toString("base64")}` };
    } catch (error) {
        console.error("Error generating share card:", error);
        return { success: false, message: "Error generating share card." };
    }
}
