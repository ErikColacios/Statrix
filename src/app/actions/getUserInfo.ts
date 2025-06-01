import { pool } from "@/util/postgres";

export default async function getUserInfo(user_id:string) {

    try {
        const res = await pool.query(`SELECT * FROM users usr
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE user_id='${user_id}'`);

        return res.rows
    } catch (error) {
        console.log(error)
    }

    // const {data, error} = await supabase.from('user').select('*, avatar_images(avatar_image), banner_images(banner_image)').match({user_id:user_id})
    // if(error){
    //     console.log(error)
    // }else{
    //     console.log(data)
    //     return data;
    // }
}