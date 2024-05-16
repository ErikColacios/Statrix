"use client"
import React from "react";
import Swal from 'sweetalert2';
import { deleteList } from '@/app/actions/deleteList';

type Props  = {
    userId:string | undefined, 
    listId:string,
    listName:string
}

export default async function DeleteListButton({userId, listId, listName}:Props){

    async function handleDeleteList(){
        console.log(userId)
        console.log(listId)
        
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "bg-red-500 hover:bg-red-600 p-2 text-white rounded w-32 ml-2",
              cancelButton: "bg-green-500 hover:bg-green-600 p-2 text-white rounded w-32"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "The list: " + listName +  " will be deleted permanently",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete this list",
            cancelButtonText: "Cancel",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                deleteList(listId, userId)
            }
          });

    }
    return (
        <button onClick={handleDeleteList} className='mr-8 p-1 pl-2 pr-2 rounded bg-red-500 hover:bg-red-600'>Delete list</button>
    )
}
