"use server"
import { supabase } from "@/utils/supabase";
import { redirect } from 'next/navigation'

export async function deleteList(listId:string, userId:string | undefined){

    // First we delete the list
    const { error } = await supabase.from('list').delete().match({list_id: listId, user_id: userId})
    if(error){
        console.log(error)
        return;
    }
    else {
        console.log("List:" + listId + " deleted successfuly.")
        // Then, we get the NUMBER of LISTS of this user
        const { data:result, error } = await supabase.from('user').select('user_lists').eq('user_id', userId)
        if (error) {
            console.log(error)
        } else {
            // Finally, we update the new quantity of lists of this user (data is the number of lists)
            // In this case, we SUBSTRACT 1, because we are deleting a list
            let newNumberOfLists = result[0].user_lists;
            newNumberOfLists = newNumberOfLists -1;
            console.log(newNumberOfLists)

            const { error } = await supabase.from('user')
            .update({user_lists: newNumberOfLists})
            .eq('user_id',userId)
            if(error){
                console.log(error)
            }
        }

        redirect("/mylists")
    }
}
