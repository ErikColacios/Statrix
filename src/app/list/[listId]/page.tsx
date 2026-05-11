import React from 'react';
import Link from "next/link";
import getSessionUser from '@/actions/getSessionUser';
import { getListInfo } from '@/actions/getListInfo';
import { getListContent } from '@/actions/getListContent';
import StarButton from '@/components/StarButton';
import SelectScore from '@/components/SelectScore';
import InputHoursPlayed from '@/components/InputHoursPlayed';
import getUserInfo from '@/actions/getUserInfo';
import { Dialog } from "radix-ui";
import DeleteListModal from '@/components/DeleteListModal';

type SearchParamProps = Record<string, string> | null | undefined;

export default async function List({ params, searchParams }: { params: { listId: string }, searchParams: SearchParamProps }) {
    let userInfo: any | undefined = []
    let listId = params.listId;
    let listInfo: any | undefined = []
    let listContent: any | undefined = []
    const showModal = searchParams?.show;

    const session: any = await getSessionUser()
    const userId: string = session.user.id
    const userName: string = session.user.name

    if (userId !== undefined) {
        userInfo = await getUserInfo(userName)
        listInfo = await getListInfo(listId, userId)
        listContent = await getListContent(listId, userId)
    }

    return (
        <>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed p-2 w-full sm:w-2/3 xl:w-1/3 2xl:w-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        <DeleteListModal list_id={listId}/>
                    </Dialog.Content>
                </Dialog.Portal>
                {/* MY LISTS */}
                <Link href="../mylists" className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-40 rounded">
                    <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                    MY LISTS
                </Link>

                {listInfo.map((item: any, index: number) => (
                    <div className='flex flex-col sm:flex-row' key={index}>
                        <div className='flex flex-col my-6'>
                            {/* List name */}
                            <p className="text-3xl md:text-4xl">{item.list_name}</p>
                            <div className='flex items-center text-base text-gray-400 mt-2'>
                                <div className={`w-8 h-8 overflow-hidden rounded rounded-full`}>
                                    <img src={`/avatarImages/${userInfo[0].avatar_image}`} className="h-full w-full object-cover" alt="Avatar image" />
                                </div>
                                <div className='flex space-x-5 text-sm sm:text-base'>
                                    <Link href={`/profile/${userName}`} className='text-white hover:text-green-500 ml-2'>{userName}</Link>
                                    {/* Creation date */}
                                    <p>Created {item.list_creationdate.toISOString().split('T')[0]}</p>
                                    <p>{listContent.length} games</p>
                                </div>
                            </div>
                            <p className='text-gray-400 mt-4'>{item.list_description}</p>
                        </div>

                        <div className="flex items-center sm:ml-auto">
                            {/* Edit list  */}
                            <Link href={`./${listId}/edit`} className='text-base text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300'>Edit list</Link>
                            {/* Delete list button*/}
                            <Dialog.Trigger asChild className=''>
                                <button className="border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3 text-base ml-2">Delete</button>
                            </Dialog.Trigger>
                            {/* {showModal &&  */}
                            {/* <CustomModal title='Warning' text="Are you sure that you want to delete this list?" type='question' action={{ actionName: "deleteList", parameters: { list_id } }} closeModal={() => setShowModal(false)}/>} */}
                        </div>
                    </div>
                ))}
                <div className="grid lg:grid-cols-2 gap-4 mt-2">
                    {/* List content */}
                    {listContent.map((item: any, index: number) => (
                        <div className="relative flex items-center border border-gray-500 rounded rounded-lg overflow-hidden text-sm md:text-lg bg-zinc-900" key={index}>
                            <img src={item.game_base_image} className="w-20 sm:w-28 border-r border-gray-500" alt={'Videogame cover'} />
                            <div className='flex flex-col ml-3 sm:ml-10'>
                                <div className='flex'>
                                    <Link href={`/gamePage/${item.game_id}`} className="text-lg sm:text-xl mr-4 hover:text-green-500 hover:underline">{item.game_name}</Link>
                                    {/* <StarButton favourite={item.favourite} gameId={item.game_id} /> */}
                                </div>
                                <div className='flex mt-4'>
                                    <SelectScore score={item.score} game_id={item.game_id} />
                                    <div className='flex items-center'>
                                        <div className='flex flex-col items-end sm:flex-row sm:items-center'>
                                            <label className="text-sm text-gray-400 mr-2">Playtime</label>
                                            <InputHoursPlayed hours_played={item.hours_played} game_id={item.game_id} source='listPage' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Dialog.Root>
        </>
    )
}