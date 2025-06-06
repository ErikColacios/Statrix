"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(user_id: string) {
    if (!user_id) {
        throw new Error("El parámetro user_id es obligatorio");
    }

    try {
        const query = `
            SELECT * FROM users usr
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE usr.user_id = $1
        `;

        const { rows } = await pool.query(query, [user_id]);

        return rows;
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        throw error;
    }
}