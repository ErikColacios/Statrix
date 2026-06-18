import React from 'react'
import Link from 'next/link';
import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'
import { getListInfo } from '@/actions/getListInfo';
import { getListContent } from '@/actions/getListContent';
import getUsersFriendshipAccepted from '@/actions/getUsersFriendshipAccepted';

export default async function ListLayout({ children, params }: { children: React.ReactNode, params: { listId: string } }) {

  const session: any = await getSessionUser()
  let listId = params.listId;
  let listInfo: any | undefined = []
  let listContent: any | undefined = []
  let isOwner: boolean = false;

  if (!session) {
    return (
      redirect("/")
    )
  }

  const userId: string = session.user.id
  const userName: string = session.user.name

  if (userId !== undefined) {
    listInfo = await getListInfo(listId)
    listContent = await getListContent(listId)

    if (listInfo.length === 0) {
      return (
        redirect("/")
      )
    }

    if (listInfo[0].user_id === userId)
      isOwner = true

    if (listInfo[0].list_visibility === "private") {
      // If the session user is not the list owner, we redirect to the home page
      if (!isOwner) {
        return (
          redirect("/")
        )
      }
    } else if (listInfo[0].list_visibility === "friendsOnly") {
      // If the session user is not a friend of the list owner, we redirect to the home page
      const friendship = await getUsersFriendshipAccepted(userName)
      let isFriend: boolean = false
      friendship.map((friend: any) => {
        if (friend.requester_id === listInfo[0].user_id || friend.addressee_id === listInfo[0].user_id) {
          isFriend = true
        }
      })
      if (!isFriend) {
        return (
          redirect("/")
        )
      }
    }
  }

  return (
    <section className="flex justify-center text-white bg-gradient-to-b from-black via-gray-900 to-black">
      <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>

        {/* MY LISTS */}
        {isOwner && <Link href="../mylists" className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-40 rounded">
          <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
          MY LISTS
        </Link>}

        {listInfo.map((item: any, index: number) => (
          <div className='flex flex-col sm:flex-row' key={index}>
            <div className='flex flex-col mt-8'>
              {/* List name */}
              <div className="flex items-center space-x-4">
                <p className="text-3xl md:text-4xl">{item.list_name}</p>

                {item.list_visibility === "public" &&
                  <div className='tooltip mt-1'>
                    <svg fill="#b0b0b0" width="20px" height="20px" viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg" stroke="#b0b0b0"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.417 9.57a7.917 7.917 0 1 1-8.144-7.908 1.758 1.758 0 0 1 .451 0 7.913 7.913 0 0 1 7.693 7.907zM5.85 15.838q.254.107.515.193a11.772 11.772 0 0 1-1.572-5.92h-3.08a6.816 6.816 0 0 0 4.137 5.727zM2.226 6.922a6.727 6.727 0 0 0-.511 2.082h3.078a11.83 11.83 0 0 1 1.55-5.89q-.249.083-.493.186a6.834 6.834 0 0 0-3.624 3.622zm8.87 2.082a14.405 14.405 0 0 0-.261-2.31 9.847 9.847 0 0 0-.713-2.26c-.447-.952-1.009-1.573-1.497-1.667a8.468 8.468 0 0 0-.253 0c-.488.094-1.05.715-1.497 1.668a9.847 9.847 0 0 0-.712 2.26 14.404 14.404 0 0 0-.261 2.309zm-.974 5.676a9.844 9.844 0 0 0 .713-2.26 14.413 14.413 0 0 0 .26-2.309H5.903a14.412 14.412 0 0 0 .261 2.31 9.844 9.844 0 0 0 .712 2.259c.487 1.036 1.109 1.68 1.624 1.68s1.137-.644 1.623-1.68zm4.652-2.462a6.737 6.737 0 0 0 .513-2.107h-3.082a11.77 11.77 0 0 1-1.572 5.922q.261-.086.517-.194a6.834 6.834 0 0 0 3.624-3.621zM11.15 3.3a6.82 6.82 0 0 0-.496-.187 11.828 11.828 0 0 1 1.55 5.89h3.081A6.815 6.815 0 0 0 11.15 3.3z"></path></g></svg>
                    <span className="tooltiptext">This list is public</span>
                  </div>
                }
                {item.list_visibility === "friendsOnly" &&
                  <div className='tooltip mt-1'>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#bfbfbf"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="User / Users"> <path id="Vector" d="M21 19.9999C21 18.2583 19.3304 16.7767 17 16.2275M15 20C15 17.7909 12.3137 16 9 16C5.68629 16 3 17.7909 3 20M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5M9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13Z" stroke="#ababab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                    <span className="tooltiptext">This list is visible only for friends</span>
                  </div>
                }
                {item.list_visibility === "private" &&
                  <div className='tooltip mt-1'>
                    <svg fill="#b5b5b5" width="16px" height="16px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#b5b5b5"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M25 12h-1v-3.816c0-4.589-3.32-8.184-8.037-8.184-4.736 0-7.963 3.671-7.963 8.184v3.816h-1c-2.206 0-4 1.794-4 4v12c0 2.206 1.794 4 4 4h18c2.206 0 4-1.794 4-4v-12c0-2.206-1.794-4-4-4zM10 8.184c0-3.409 2.33-6.184 5.963-6.184 3.596 0 6.037 2.716 6.037 6.184v3.816h-12v-3.816zM27 28c0 1.102-0.898 2-2 2h-18c-1.103 0-2-0.898-2-2v-12c0-1.102 0.897-2 2-2h18c1.102 0 2 0.898 2 2v12zM16 18c-1.104 0-2 0.895-2 2 0 0.738 0.405 1.376 1 1.723v3.277c0 0.552 0.448 1 1 1s1-0.448 1-1v-3.277c0.595-0.346 1-0.985 1-1.723 0-1.105-0.895-2-2-2z"></path> </g></svg>
                    <span className="tooltiptext">This list is private</span>
                  </div>
                }
              </div>
              <div className='flex items-center text-base text-gray-400 mt-2'>
                <div className={`w-8 h-8 overflow-hidden rounded rounded-full`}>
                  <img src={`/avatarImages/${listInfo[0].avatar_image}`} className="h-full w-full object-cover" alt="Avatar image" />
                </div>
                <div className='flex items-center space-x-5 text-sm sm:text-base'>
                  <Link href={`/profile/${listInfo[0].user_name}`} className='text-white hover:text-green-500 ml-2'>{listInfo[0].user_name}</Link>
                  {/* Creation date */}
                  <p>Created {item.list_creationdate.toISOString().split('T')[0]}</p>
                  <p>{listContent.length} games</p>

                </div>
              </div>
              <p className='text-gray-400 mt-4'>{item.list_description}</p>
            </div>
          </div>
        ))}
        {children}
      </div>
    </section>
  )
}