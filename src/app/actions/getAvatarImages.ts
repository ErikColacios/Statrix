import { supabase } from "@/utils/supabase";

export default async function getAvatarImages (){

    const {data, error} = await supabase.from("avatar_images").select()

    if(error){
        console.log(error)
    }else{
        return data;
    }
}