"use client"
import React, { useState } from "react";
import { Dialog } from "radix-ui";
import LikeDislikeButtons from "./LikeDislikeButtons";
import { insertReview } from "../actions/insertReview";
import CustomModal from "./CustomModal";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
    gameId: number,
    gameName: string,
    gameCover: number,
};

export default function ReviewModal({ gameId, gameName, gameCover }: Props) {

    // Custom alert
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [modalTrigger, setModalTrigger] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [alert, setAlert] = useState(<></>)

    const handleInsertReview = async () => {
        const reviewBody: string = (document.getElementById("reviewBody") as HTMLTextAreaElement).value;
        const recommended: string = (document.getElementById("likeDislike") as HTMLInputElement).value;
        if (reviewBody === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='Alert' text="Type a review first" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)} />)
        }
        else if (recommended === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='Alert' text="Set your recommendation first" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)} />)
        }
        else {
            await insertReview(gameId, gameName, reviewBody, recommended);

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

    if (!userId) {
        return (
            <div className="relative flex flex-col justify-center items-center text-center w-80 sm:w-full h-96 p-2 border border-gray-500 space-y-6 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
                <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded transition hover:bg-gray-800" >
                    <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                </Dialog.Close>
                <h2 className="text-3xl">Create an account</h2>
                <p>Enter or create an account to post game reviews and much more.</p>
                <Link href="/login" className="w-full text-xl px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Start now!</Link>
            </div>
        )
    } else {
        return (
            <div className="flex relative w-96 md:w-[50rem] h-[75vh] md:h-[65vh] flex-col border border-gray-500 space-y-8 px-4 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
                {alert}
                <Dialog.Close className="mt-8 absolute right-10 p-2 rounded transition hover:bg-gray-800" >
                    <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                </Dialog.Close>
                <h2 className="text-3xl">{gameName}</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start md:pt-12">
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameCover}.png`} alt="Game cover" className="w-36 lg:w-48 rounded" />
                    <div className="flex flex-col w-full md:ml-8">
                        <textarea id="reviewBody" className="w-full h-32 md:h-64 mt-4 sm:mt-0 bg-gray-800 border border-gray-500 rounded focus:outline-none resize-none focus:border-green-500 p-2" placeholder="Your review"></textarea>
                        <LikeDislikeButtons />
                    </div>
                </div>
                <button onClick={() => handleInsertReview()} 
                    className="sm:ml-auto sm:w-72 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white py-2 px-4 rounded">
                    Post review
                </button>
            </div>
        )
    }
}