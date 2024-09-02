import { supabase } from "@/utils/supabase";

export default async function getUserInfo(user_id:string) {

    const {data, error} = await supabase.from('user').select('*, avatar_images(avatar_image)').match({user_id:user_id})
    if(error){
        console.log(error)
    }else{
        console.log(data)
        return data;
    }
}