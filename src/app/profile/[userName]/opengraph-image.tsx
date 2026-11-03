import React from "react"
import satori from "satori"
import sharp from "sharp"
import { readFile } from "fs/promises"
import path from "path"
import getUserInfo from "@/actions/getUserInfo"
import getUserGameStats from "@/actions/getUserGameStats"
import { getUserFavouriteGames } from "@/actions/getUserFavouriteGames"
import { getUserTotalHoursPlayed } from "@/actions/getUserTotalHoursPlayed"
import { formatNumber, imageToDataUri, loadFonts, localImageToDataUri, toCoverUrl } from "@/util/shareImage"

// og:image of /profile/[userName]: banner, avatar, stats and favourite games of the user.
// It depends on the user, so it's generated on each request (social networks cache it on their side).
export const alt = "Statrix gaming profile"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const WIDTH = size.width
const HEIGHT = size.height
const GREEN = "#22c55e"
const AVATAR_SIZE = 150

function toPng(svg: string) {
    return sharp(Buffer.from(svg)).png().toBuffer()
}

export default async function ProfileOpengraphImage({ params }: { params: { userName: string } }) {
    const [[interBold, interSemiBold], logoFile] = await Promise.all([
        loadFonts(),
        readFile(path.join(process.cwd(), "public/logos/st2_white.png")),
    ])
    const logo = `data:image/png;base64,${logoFile.toString("base64")}`
    const fonts = [
        { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
        { name: "Inter", data: interSemiBold, weight: 600 as const, style: "normal" as const },
    ]

    const userInfo = await getUserInfo(params.userName).catch(() => [])

    // Unknown user: generic card, so the link preview is never broken
    if (userInfo.length === 0) {
        const svg = await satori(
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#08090b", backgroundImage: "radial-gradient(circle at 50% 100%, rgba(34,197,94,0.25), transparent 55%)", color: "#fff", fontFamily: "Inter" }}>
                <img src={logo} width={300} height={71} alt="" />
                <div style={{ display: "flex", marginTop: 32, fontSize: 36, fontWeight: 600, color: "#95979e" }}>Every game. One profile.</div>
            </div>,
            { width: WIDTH, height: HEIGHT, fonts }
        )
        return new Response(new Uint8Array(await toPng(svg)), { headers: { "Content-Type": contentType } })
    }

    const user = userInfo[0]
    const [stats, totalHours, favouriteGames] = await Promise.all([
        getUserGameStats(params.userName),
        getUserTotalHoursPlayed(params.userName),
        getUserFavouriteGames(params.userName),
    ])

    // Favourite games, or the most played ones if the user has no favourites
    const showcaseTitle: string = Array.isArray(favouriteGames) && favouriteGames.length > 0 ? "Favourite games" : "Most played"
    const showcaseGames: any[] = (Array.isArray(favouriteGames) && favouriteGames.length > 0 ? favouriteGames : stats.topGames).slice(0, 4)

    const avatarUrl = user.user_avatar ? `https://media.statrix.app/avatars/${user.user_id}/${user.user_avatar}` : null
    const bannerUrl = user.user_banner ? `https://media.statrix.app/banners/${user.user_id}/${user.user_banner}` : null

    const [avatar, banner, covers] = await Promise.all([
        avatarUrl ? imageToDataUri(avatarUrl, AVATAR_SIZE * 2, AVATAR_SIZE * 2) : null,
        bannerUrl ? imageToDataUri(bannerUrl, WIDTH, HEIGHT) : null,
        Promise.all(showcaseGames.map((game) => imageToDataUri(toCoverUrl(game.game_base_image), 300, 400))),
    ])
    const avatarSrc = avatar ?? await localImageToDataUri("public/avatarImages/avatar_default.jpg", AVATAR_SIZE * 2, AVATAR_SIZE * 2)
    // Same default banner as the profile page
    const bannerSrc = banner ?? await localImageToDataUri("public/bannerImages/banner_default.jpg", WIDTH, HEIGHT)
    const validCovers = covers.filter((cover): cover is string => cover !== null)

    const bio: string = user.user_bio ? (user.user_bio.length > 110 ? `${user.user_bio.slice(0, 107).trim()}...` : user.user_bio) : ""
    const statBoxes = [
        { label: "Games", value: stats.gamesAll },
        { label: "Completed", value: stats.gamesCompleted },
        { label: "Hours played", value: totalHours ? Number(totalHours) : 0 },
    ]
    const coverTilt = [-8, -3, 3, 8]
    const coverOffsetY = [26, -8, 4, 34]

    const svg = await satori(
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#08090b", color: "#fff", fontFamily: "Inter" }}>
            {/* Banner of the user, darkened so the text is readable */}
            <img src={bannerSrc} width={WIDTH} height={HEIGHT} alt="" style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(8,9,11,0.96) 0%, rgba(8,9,11,0.86) 55%, rgba(8,9,11,0.55) 100%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, display: "flex", backgroundImage: "radial-gradient(circle at 80% 60%, rgba(34,197,94,0.22), transparent 45%)" }} />

            {/* User info */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 680 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={avatarSrc} width={AVATAR_SIZE} height={AVATAR_SIZE} alt="" style={{ borderRadius: 9999, border: `5px solid ${GREEN}`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)", objectFit: "cover" }} />
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: 32 }}>
                        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{user.user_name}</div>
                        <div style={{ display: "flex", marginTop: 12, fontSize: 24, fontWeight: 600, color: GREEN }}>Gaming profile on Statrix</div>
                    </div>
                </div>

                {bio && <div style={{ display: "flex", marginTop: 32, fontSize: 26, fontWeight: 600, color: "#c4c5ca", lineHeight: 1.4 }}>{bio}</div>}

                {/* Stats */}
                <div style={{ display: "flex", marginTop: bio ? 32 : 44, gap: 16 }}>
                    {statBoxes.map((box) => (
                        <div key={box.label} style={{ display: "flex", flexDirection: "column", padding: "18px 24px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(17,18,20,0.75)", minWidth: 150 }}>
                            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{formatNumber(box.value)}</div>
                            <div style={{ display: "flex", marginTop: 8, fontSize: 20, fontWeight: 600, color: "#95979e" }}>{box.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
                    <img src={logo} width={130} height={31} alt="" />
                    <div style={{ display: "flex", marginLeft: 16, fontSize: 20, fontWeight: 600, color: "#95979e" }}>{`statrix.app/profile/${user.user_name}`}</div>
                </div>
            </div>

            {/* Favourite / most played games */}
            {validCovers.length > 0 && (
                <div style={{ position: "absolute", right: 48, top: 0, bottom: 0, width: 440, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", position: "absolute", top: 110, left: 20, fontSize: 22, fontWeight: 600, color: "#c4c5ca" }}>{showcaseTitle}</div>
                    {validCovers.map((cover, index) => (
                        <img key={index} src={cover} width={180} height={240} alt=""
                            style={{
                                position: "absolute",
                                top: 180 + coverOffsetY[index],
                                left: 10 + index * (validCovers.length > 3 ? 84 : 110),
                                borderRadius: 16,
                                border: "4px solid #111214",
                                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                                transform: `rotate(${coverTilt[index]}deg)`,
                                objectFit: "cover",
                            }} />
                    ))}
                </div>
            )}
        </div>,
        { width: WIDTH, height: HEIGHT, fonts }
    )

    return new Response(new Uint8Array(await toPng(svg)), {
        headers: { "Content-Type": contentType },
    })
}
