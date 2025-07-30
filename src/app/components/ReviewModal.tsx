"use client"
import React, { useState } from "react";
import AcceptButton from "./AcceptButton";
import { Dialog } from "radix-ui";
import LikeDislikeButtons from "./LikeDislikeButtons";
import { insertReview } from "../actions/insertReview";
import CustomModal from "./CustomModal";

type Props = {
    game_id: string,
    game_name: string,
    game_cover: string,
};

export default function ReviewModal({ game_id, game_name, game_cover }: Props) {

    // Custom alert
    const [modalTrigger, setModalTrigger] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [alert, setAlert] = useState(<></>)

    const handleInsertReview = async () => {
        const reviewBody: string = (document.getElementById("reviewBody") as HTMLTextAreaElement).value;
        const recommended: string = (document.getElementById("likeDislike") as HTMLInputElement).value;
        if (reviewBody === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='Alert' text="Type a review first" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} />)
        }
        else if (recommended === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='Alert' text="Set your recommendation first" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} />)
        }
        else {
            await insertReview(game_id, game_name, reviewBody, recommended);

            // We simulate that the user presses ESC to close the modal
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true
            });

            document.dispatchEvent(escEvent);
        }
    }

    return (
        <div className="flex relative w-full h-[75vh] md:h-[65vh] flex-col border border-gray-500 space-y-8 pl-4 pr-4 md:pl-10 md:pr-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            {alert}
            <Dialog.Close className="mt-8 absolute right-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <h2 className="text-3xl">{game_name}</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start md:pt-12">
                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game_cover}.png`} alt="Videogame cover" className="w-36 lg:w-48 rounded" />
                <div className="flex flex-col w-full md:ml-8">
                    <textarea id="reviewBody" className="w-full h-32 md:h-64 mt-4 bg-black border border-gray-500 focus:outline-none resize-none focus:border-green-500 p-2" maxLength={1000} placeholder="Your review"></textarea>
                    <LikeDislikeButtons />
                </div>
            </div>
            <div className="absolute right-5 md:right-10 bottom-10" onClick={()=> handleInsertReview()}>
                <AcceptButton text="Post review" size="small" />
            </div>
        </div>
    )
}