import React from "react"
import satori from "satori"
import sharp from "sharp"
import { readFile } from "fs/promises"
import path from "path"

// Next turns this file into the og:image of the home page (and of every page that doesn't have its own).
// It's generated once at build time and served as a static PNG.
// Same approach as getUserShareCard (satori + sharp) instead of next/og, whose ImageResponse breaks on Windows.
export const alt = "Statrix — Every game. One profile."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const GREEN = "#22c55e"
const covers = ["cover_elden_ring", "cover_hollow_knight_silksong", "cover_baldurs_gate3", "cover_silent_hill2"]

async function publicImageToDataUri(filePath: string, mimeType: string): Promise<string> {
    const buffer = await readFile(path.join(process.cwd(), "public", filePath))
    return `data:${mimeType};base64,${buffer.toString("base64")}`
}

export default async function OpengraphImage() {
    // Same fonts as the share card of the profile (satori doesn't support woff2)
    const fontsDir = path.join(process.cwd(), "src/assets/fonts")
    const [interBold, interSemiBold] = await Promise.all([
        readFile(path.join(fontsDir, "Inter-Bold.woff")),
        readFile(path.join(fontsDir, "Inter-SemiBold.woff")),
    ])

    const logo = await publicImageToDataUri("logos/st2_white.png", "image/png")
    const coverImages = await Promise.all(covers.map((cover) => publicImageToDataUri(`staticImages/gameCovers/${cover}.jpg`, "image/jpeg")))

    const svg = await satori(
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#08090b", fontFamily: "Inter" }}>
            {/* Glows */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", backgroundImage: "radial-gradient(circle at 78% 55%, rgba(34,197,94,0.28), transparent 45%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", backgroundImage: "radial-gradient(circle at 10% 0%, rgba(163,230,53,0.14), transparent 40%)" }} />

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 80, width: 640 }}>
                <img src={logo} width={218} height={52} alt="" />
                <div style={{ display: "flex", flexDirection: "column", marginTop: 44, fontSize: 82, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 0.98 }}>
                    <span style={{ color: "#ffffff" }}>Every game.</span>
                    <span style={{ backgroundImage: "linear-gradient(90deg, #4ade80, #a3e635)", backgroundClip: "text", color: "transparent" }}>One profile.</span>
                </div>
                <div style={{ display: "flex", marginTop: 28, fontSize: 28, fontWeight: 600, color: "#95979e", lineHeight: 1.35 }}>
                    Track, rate and share your games.
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: 40, fontSize: 24, fontWeight: 600, color: GREEN }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: GREEN, marginRight: 12 }} />
                    statrix.app
                </div>
            </div>

            {/* Fanned covers */}
            <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, width: 520, display: "flex" }}>
                {coverImages.map((cover, index) => (
                    <img key={index} src={cover} width={210} height={280} alt=""
                        style={{
                            position: "absolute",
                            top: 175 + [24, -18, -6, 30][index],
                            left: index * 100,
                            borderRadius: 18,
                            border: "4px solid #111214",
                            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                            transform: `rotate(${[-9, -3, 3, 9][index]}deg)`,
                            objectFit: "cover",
                        }} />
                ))}
            </div>
        </div>,
        {
            ...size,
            fonts: [
                { name: "Inter", data: interBold, weight: 700, style: "normal" },
                { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
            ],
        }
    )

    const png = await sharp(Buffer.from(svg)).png().toBuffer()

    return new Response(new Uint8Array(png), {
        headers: { "Content-Type": contentType },
    })
}
