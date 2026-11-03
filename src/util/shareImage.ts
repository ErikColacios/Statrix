import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Helpers for the images generated with satori (share card and Open Graph images).
// Not a "use server" file on purpose: these functions must not be callable from the client.

// satori doesn't support woff2, so the fonts are stored as woff
const FONTS_DIR = path.join(process.cwd(), "src/assets/fonts");
let fontsPromise: Promise<Buffer[]> | null = null;

export function loadFonts() {
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
export async function imageToDataUri(url: string, width: number, height: number, blurred = false): Promise<string | null> {
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
export async function localImageToDataUri(filePath: string, width: number, height: number, blurred = false): Promise<string> {
    let image = sharp(path.join(process.cwd(), filePath)).resize(width, height, { fit: "cover" });
    if (blurred) image = image.blur(40).modulate({ brightness: 0.75 });
    const buffer = await image.jpeg({ quality: 85 }).toBuffer();
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

// Smaller IGDB size for the covers, the stored one is t_720p
export function toCoverUrl(url: string) {
    return url.replace("t_720p", "t_cover_big").replace(/\.png$/, ".jpg");
}

export function formatNumber(n: number) {
    return Math.round(n).toLocaleString("en-US");
}
