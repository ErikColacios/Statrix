import React from 'react'
import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'
import { getListInfo } from '@/actions/getListInfo';
import getUserInfo from '@/actions/getUserInfo';
import { Dialog } from 'radix-ui';
import Link from 'next/link';
import DeleteListModal from '@/components/DeleteListModal';
import { getListContent } from '@/actions/getListContent';

export default async function ListLayout({ children, params }: { children: React.ReactNode, params: { listId: string } }) {

  const session: any = await getSessionUser()
  let userInfo: any | undefined = []
  let listId = params.listId;
  let listInfo: any | undefined = []
  let listContent: any | undefined = []

  const userId: string = session.user.id
  const userName: string = session.user.name

  if (userId !== undefined) {
    userInfo = await getUserInfo(userName)
    listInfo = await getListInfo(listId, userId)
    listContent = await getListContent(listId)
  }

  if (!session) {
    return (
      redirect("/")
    )
  }
  return (
    <section className="flex justify-center text-white bg-gradient-to-b from-black via-gray-900 to-black">
      <Dialog.Root>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className={`fixed p-2 w-full sm:w-2/3 xl:w-1/3 2xl:w-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <Dialog.Description className="DialogDescription"></Dialog.Description>
            <DeleteListModal list_id={listId} />
          </Dialog.Content>
        </Dialog.Portal>
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>

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
                {/* Delete list button*/}
                <Dialog.Trigger asChild className=''>
                  <button className="border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3 text-base ml-2">Delete</button>
                </Dialog.Trigger>
              </div>
            </div>
          ))}
          {children}
        </div>
      </Dialog.Root>
    </section>
  )
}