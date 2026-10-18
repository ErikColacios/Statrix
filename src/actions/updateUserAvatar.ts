'use server'
import { pool } from '@/util/postgres'
import getSessionUser from './getSessionUser'
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export default async function updateUserAvatar(formData: FormData) {
    const session: any = await getSessionUser()
    const userId: string = session.user.id as string
    const imageTypes:string[] = ["image/jpeg", "image/png", "image/webp"]

    const selectedAvatar: File = formData.get('avatarFile') as File
    if (!imageTypes.includes(selectedAvatar.type)) {
        return;
    }

    const arrayBuffer = await selectedAvatar.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!userId) {
        return { success: false, message: 'You must be logged in.' }
    }
    if (!selectedAvatar) {
        return { success: false, message: 'No avatar selected.' }
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
        const res = await pool.query(`SELECT user_avatar FROM users WHERE user_id = $1`, [userId])
        const oldAvatarImage = res.rows[0].user_avatar
        const oldAvatarKey = `avatars/${userId}/${oldAvatarImage}`
        console.log(oldAvatarKey)

        // We create the image key (the image name inside Cloudflare) and we upload it there
        const avatarId = randomUUID() + '.webp'
        const imageKey = `avatars/${userId}/${avatarId}`

        const putObject = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME!,
            Key: imageKey,
            Body: buffer,
            ContentType: selectedAvatar.type,
            ContentLength: buffer.length,
        })
        await s3.send(putObject)

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

        return 'User avatar updated successfully!'
    } catch (error) {
        console.error('Error updating user avatar:', error)
        return 'Failed to update user avatar.'
    }
}
