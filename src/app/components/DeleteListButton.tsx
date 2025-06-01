"use client"
import React from "react";
import Swal from 'sweetalert2';
import { deleteList } from '@/app/actions/deleteList';

type Props  = {
    userId:string | undefined, 
    listId:string,
    listName:string
}

export default function DeleteListButton({userId, listId, listName}:Props){

    async function handleDeleteList(){
      
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
        <button onClick={handleDeleteList} className='p-3 pl-2 pr-2 text-md md:text-lg xl:text-2xl  w-32 xl:w-48 border border-red-400 text-center transition hover:bg-red-400 hover:text-black'>DELETE LIST</button>
    )
}
