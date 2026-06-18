import React from "react";
import PrimaryButton from "./PrimaryButton";
import { Dialog } from "radix-ui";
import AddToListModal from "./AddToListModal";
import { getListsUser } from "../actions/getListsUser";

type Props = {
    game_id: string,
    game_name: string,
    game_cover: string,
};

export default async function AddToListButton({ game_id, game_name, game_cover }: Props) {

    let lists:any[] = []
    //let lists:any[] = await getListsUser()


    return (
        <Dialog.Root>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed w-full p-2 md:w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                            data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                    <Dialog.Title className="DialogTitle"></Dialog.Title>
                    <Dialog.Description className="DialogDescription"></Dialog.Description>
                    <AddToListModal game_id={game_id} game_name={game_name} game_cover={game_cover} lists={lists}/>
                </Dialog.Content>
            </Dialog.Portal>
            <Dialog.Trigger asChild>
                <PrimaryButton text="Add to list"/>
            </Dialog.Trigger>
        </Dialog.Root>
    )
}