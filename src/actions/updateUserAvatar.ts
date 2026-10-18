'use server'
import { pool } from '@/util/postgres'
import getSessionUser from './getSessionUser'
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from "sharp"
import { randomUUID } from 'crypto'

//const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DIMENSION = 4096;

export default async function updateUserAvatar(formData: FormData) {
    const session: any = await getSessionUser()
    const userId: string = session.user.id as string
    const allowedFormatsLong:string[] = ["image/jpeg", "image/png", "image/webp"];

    const selectedAvatar: File = formData.get('avatarFile') as File

      console.log("[avatar] Archivo recibido:", selectedAvatar instanceof File
        ? { name: selectedAvatar.name, size: selectedAvatar.size, type: selectedAvatar.type }
        : selectedAvatar
    );

    console.log("TIPO ARCHIVO: ",selectedAvatar.type)
    if (!allowedFormatsLong.includes(selectedAvatar.type)) {
        return;
    }
    console.log("[avatar] 1. Archivo recibido");

    const imageBuffer = Buffer.from(await selectedAvatar.arrayBuffer())
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

    if (!selectedAvatar) {
        return { success: false, message: 'No avatar selected.' }
    }

    // We resize the validated image
    const processedImage = await image
        .rotate()
        .resize(512, 512, {
            fit: "cover",
            position: "centre",
        })
        .webp({ quality: 80 })
        .toBuffer();

    console.log("[avatar] 2. Imagen procesada");

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
        const res = await pool.query(`SELECT user_avatar FROM users WHERE user_id = $1`, [userId])
        const oldAvatarImage = res.rows[0].user_avatar
        const oldAvatarKey = `avatars/${userId}/${oldAvatarImage}`

        // We create the image key (the image name inside Cloudflare) and we upload it there
        const avatarId = randomUUID() + '.webp'
        const imageKey = `avatars/${userId}/${avatarId}`

        const putObject = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME!,
            Key: imageKey,
            Body: processedImage,
            ContentType: "image/webp",
            ContentLength: processedImage.length,
        })
        await s3.send(putObject)

    console.log("[avatar] 3. Imagen subida a R2");


        // Then we update the user_avatar field in the 'users' table
        await pool.query(
            `UPDATE users
             SET user_avatar = $1
             WHERE user_id = $2`,
            [avatarId, userId]
        )

        // And finally we delete the old avatar image in R2
        if (oldAvatarKey && oldAvatarKey !== imageKey) {
            await s3.send(new DeleteObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: oldAvatarKey,
            }));
        }

        console.log("[avatar] 4. Base de datos actualizada");

        return 'User avatar updated successfully!'
    } catch (error) {
        console.error('Error updating user avatar:', error)
        return 'Failed to update user avatar.'
    }
}
