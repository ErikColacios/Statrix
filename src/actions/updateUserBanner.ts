'use server'
import { pool } from '@/util/postgres'
import getSessionUser from './getSessionUser'
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export default async function updateUserBanner(formData: FormData) {
    const session: any = await getSessionUser()
    const userId: string = session.user.id as string
    const imageTypes:string[] = ["image/jpeg", "image/png", "image/webp"]

    const selectedBanner: File = formData.get('bannerFile') as File
    if (!imageTypes.includes(selectedBanner.type)) {
        return;
    }

    const arrayBuffer = await selectedBanner.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!userId) {
        return { success: false, message: 'You must be logged in.' }
    }
    if (!selectedBanner) {
        return { success: false, message: 'No banner selected.' }
    }

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
        console.log(oldBannerKey)

        // We create the image key (the image name inside Cloudflare) and we upload it there
        const bannerId = randomUUID() + '.webp'
        const imageKey = `banners/${userId}/${bannerId}`

        const putObject = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME!,
            Key: imageKey,
            Body: buffer,
            ContentType: selectedBanner.type,
            ContentLength: buffer.length,
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