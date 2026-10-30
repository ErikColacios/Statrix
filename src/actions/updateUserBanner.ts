'use server'
import { pool } from '@/util/postgres'
import getSessionUser from './getSessionUser'
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from "sharp"
import { randomUUID } from 'crypto'

const MAX_DIMENSION = 4096;

export default async function updateUserBanner(formData: FormData) {
    const session: any = await getSessionUser()
    const userId: string = session.user.id as string
    const allowedFormatsLong:string[] = ["image/jpeg", "image/png", "image/webp"];

    const selectedBanner: File = formData.get('bannerFile') as File

    if (!selectedBanner) {
        return { success: false, message: 'No banner selected.' }
    }

    if (!allowedFormatsLong.includes(selectedBanner.type)) {
        return;
    }

    const imageBuffer = Buffer.from(await selectedBanner.arrayBuffer())
    const image = sharp(imageBuffer, {
        limitInputPixels: 40_000_000
    })

    // We validate the image
    const metadata = await image.metadata();
    const allowedFormats:string[] = ["jpeg", "png", "webp"];
    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
        return { success: false, message: "Only JPEG, PNG and WebP images are supported." }
    }

    if (!metadata.width || !metadata.height || metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        return { success: false, message: "The image dimensions are too large." }
    }

    if (!userId) {
        return { success: false, message: 'You must be logged in.' }
    }
    if (!selectedBanner) {
        return { success: false, message: 'No banner selected.' }
    }

    // We resize the validated image
    const processedImage = await image
        .rotate()
        .resize(1920, 640, {
            fit: "cover",
            position: "centre",
        })
        .webp({ quality: 80 })
        .toBuffer();

    // Check bucket name
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!

    if (!R2_BUCKET_NAME) {
        throw new Error('No R2 bucket name configured')
    }

    // Initialize S3 Client
    const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY!,
            secretAccessKey: process.env.R2_SECRET_KEY!,
        },
        requestChecksumCalculation: 'WHEN_REQUIRED',
        maxAttempts: 2,
    })

    try {
        const res = await pool.query(`SELECT user_banner FROM users WHERE user_id = $1`, [userId])
        const oldBannerImage = res.rows[0].user_banner
        const oldBannerKey = `banners/${userId}/${oldBannerImage}`

        // We create the image key (the image name inside Cloudflare) and we upload it there
        const bannerId = randomUUID() + '.webp'
        const imageKey = `banners/${userId}/${bannerId}`

        const putObject = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME!,
            Key: imageKey,
            Body: processedImage,
            ContentType: "image/webp",
            ContentLength: processedImage.length,
        })
        await s3.send(putObject)

        // Then we update the user_banner field in the 'users' table
        await pool.query(
            `UPDATE users
             SET user_banner = $1
             WHERE user_id = $2`,
            [bannerId, userId]
        )

        // And finally we delete the old banner image in R2
        if (oldBannerKey && oldBannerKey !== imageKey) {
            await s3.send(new DeleteObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: oldBannerKey,
            }));
        }

        return 'User banner updated successfully!'
    } catch (error) {
        console.error('Error updating user banner:', error)
        return 'Failed to update user banner.'
    }
}