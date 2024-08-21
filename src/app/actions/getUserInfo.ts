import { supabase } from "@/utils/supabase";

export default async function getUserInfo(user_id:string) {

    const {data, error} = await supabase.from('user').select('*').match({user_id:user_id})
    if(error){
        console.log(error)
    }else{
        return data;
    }
}