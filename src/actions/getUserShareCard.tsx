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

const WIDTH = 1080;
const HEIGHT = 1920;
const BANNER_HEIGHT = 560;
const AVATAR_SIZE = 240;
const GREEN = "#22c55e";

// satori doesn't support woff2, so the fonts are stored as woff
const FONTS_DIR = path.join(process.cwd(), "src/assets/fonts");
let fontsPromise: Promise<Buffer[]> | null = null;

function loadFonts() {
    fontsPromise ??= Promise.all([
        readFile(path.join(FONTS_DIR, "Inter-Bold.woff")),
        readFile(path.join(FONTS_DIR, "Inter-SemiBold.woff")),
    ]);
    return fontsPromise;
}

/**
 * Downloads an image and returns it as a data URI, re-encoded with sharp
 * (satori doesn't support webp, which is the format of avatars).
 */
async function imageToDataUri(url: string, width: number, height: number, blurred = false): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        let image = sharp(Buffer.from(await res.arrayBuffer())).resize(width, height, { fit: "cover" });
        if (blurred) image = image.blur(40).modulate({ brightness: 0.75 });
        const buffer = await image.jpeg({ quality: 85 }).toBuffer();
        return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    } catch (error) {
        console.error("Error processing card image:", error);
        return null;
    }
}

// Same as imageToDataUri, but for an image of the public folder
async function localImageToDataUri(filePath: string, width: number, height: number): Promise<string> {
    const buffer = await sharp(path.join(process.cwd(), filePath)).resize(width, height, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

// Smaller IGDB size for the covers, the stored one is t_720p
function toCoverUrl(url: string) {
    return url.replace("t_720p", "t_cover_big").replace(/\.png$/, ".jpg");
}

function formatNumber(n: number) {
    return Math.round(n).toLocaleString("en-US");
}

/**
 * Generates the shareable stats card (1080x1920 JPEG, stories format) of the logged user.
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
        const topGames = stats.topGames;

        const avatarUrl = user.user_avatar
            ? `https://media.statrix.app/avatars/${user.user_id}/${user.user_avatar}`
            : null;
        const bannerUrl = user.user_banner
            ? `https://media.statrix.app/banners/${user.user_id}/${user.user_banner}`
            : null;

        const [avatar, banner, background, covers, logo, [interBold, inter]] = await Promise.all([
            avatarUrl ? imageToDataUri(avatarUrl, 300, 300) : null,
            bannerUrl ? imageToDataUri(bannerUrl, WIDTH, BANNER_HEIGHT) : null,
            topGames[0] ? imageToDataUri(toCoverUrl(topGames[0].game_base_image), 270, 480, true) : null,
            Promise.all(topGames.map((g) => imageToDataUri(toCoverUrl(g.game_base_image), 264, 352))),
            readFile(path.join(process.cwd(), "public/logos/st2_white.png")),
            loadFonts(),
        ]);

        const avatarDefault = await readFile(path.join(process.cwd(), "public/avatarImages/avatar_default.jpg"));
        const avatarSrc = avatar ?? `data:image/jpeg;base64,${avatarDefault.toString("base64")}`;
        const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
        // Same default banner as the profile page
        const bannerSrc = banner ?? await localImageToDataUri("public/bannerImages/fallout_workshop.jpg", WIDTH, BANNER_HEIGHT);

        const statBoxes = [
            { label: "Games", value: stats.gamesAll },
            { label: "Completed", value: stats.gamesCompleted },
            { label: "Playing", value: stats.gamesPlaying },
        ];

        const svg = await satori(
            (
                <div style={{ width: WIDTH, height: HEIGHT, display: "flex", position: "relative", backgroundColor: "#000", color: "#fff", fontFamily: "Inter" }}>
                    {/* Background: blurred cover of the most played game */}
                    {background && <img alt="" src={background} width={WIDTH} height={HEIGHT} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />}
                    <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 45%, #000 85%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, display: "flex", backgroundImage: "radial-gradient(circle at 50% 100%, rgba(34,197,94,0.25), transparent 50%)" }} />

                    {/* Banner: darker at the top for the logo, fading into the background at the bottom */}
                    <img alt="" src={bannerSrc} width={WIDTH} height={BANNER_HEIGHT} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover", maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: BANNER_HEIGHT, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 100%)" }} />
                    <img alt="" src={logoSrc} width={300} height={70} style={{ position: "absolute", top: 70, left: (WIDTH - 300) / 2, objectFit: "contain" }} />

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 80px 70px" }}>
                        {/* User: the avatar overlaps the bottom edge of the banner */}
                        <img alt="" src={avatarSrc} width={AVATAR_SIZE} height={AVATAR_SIZE} style={{ marginTop: BANNER_HEIGHT - AVATAR_SIZE / 2, borderRadius: 9999, border: `6px solid ${GREEN}`, boxShadow: "0 10px 40px rgba(0,0,0,0.6)", objectFit: "cover" }} />
                        <div style={{ marginTop: 28, fontSize: 84, fontWeight: 900, lineHeight: 1 }}>{user.user_name}</div>
                        <div style={{ marginTop: 14, fontSize: 34, color: "#a1a1aa" }}>My gaming stats</div>

                        {/* Hours played */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 }}>
                            <div style={{ fontSize: 120, fontWeight: 900, color: GREEN, lineHeight: 1 }}>{formatNumber(totalHours ? Number(totalHours) : 0)}</div>
                            <div style={{ fontSize: 40, marginTop: 24, letterSpacing: 6, textTransform: "uppercase" }}>hours played</div>
                        </div>

                        {/* Stat boxes */}
                        <div style={{ display: "flex", width: "100%", marginTop: 50, gap: 24 }}>
                            {statBoxes.map((box) => (
                                <div key={box.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 0", borderRadius: 28, border: "2px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(24,24,27,0.6)" }}>
                                    <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{formatNumber(box.value)}</div>
                                    <div style={{ fontSize: 30, marginTop: 12, color: GREEN }}>{box.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Most played games */}
                        {topGames.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", width: "100%", marginTop: 50 }}>
                                <div style={{ fontSize: 34, color: "#a1a1aa", marginBottom: 24 }}>Most played</div>
                                <div style={{ display: "flex", gap: 20 }}>
                                    {topGames.map((game, i) => (
                                        <div key={game.game_id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 168 }}>
                                            {covers[i]
                                                ? <img alt="" src={covers[i]!} width={168} height={224} style={{ borderRadius: 16, objectFit: "cover" }} />
                                                : <div style={{ width: 168, height: 224, borderRadius: 16, backgroundColor: "#27272a" }} />}
                                            {game.hours_played > 0 && <div style={{ fontSize: 28, marginTop: 12 }}>{`${formatNumber(game.hours_played)} h`}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ display: "flex", marginTop: "auto", fontSize: 36, color: "#d4d4d8" }}>
                            Track your games at&nbsp;<span style={{ color: GREEN, fontWeight: 700 }}>statrix.app</span>
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
