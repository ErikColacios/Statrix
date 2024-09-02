import { supabase } from "@/utils/supabase";

export default async function getBannerImages (){

    const {data, error} = await supabase.from("banner_images").select()

    if(error){
        console.log(error)
    }else{
        return data;
    }
}