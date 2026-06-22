import React from 'react'
import Link from "next/link"
import { pool } from '@/util/postgres'
import getSessionUser from '@/actions/getSessionUser'
import NotLoggedVideogamelist from '@/components/NotLoggedVideogamelist'
import PrimaryButton from '@/components/PrimaryButton'
import NoListCreated from '@/components/NoListCreated'

export default async function MyListsLayout({children}: {children: React.ReactNode}) {
  /**
   * Gets the number of lists that this User has
   * @param session 
   * @returns numberOfLists
   */
  async function getUserListsNumber(session:any) {
    let numberOfLists: number = 0;
    try {
      const res = await pool.query(`SELECT user_id, user_name, user_lists
            FROM users 
            WHERE user_id='${session.user.id}'`);
      numberOfLists = res.rows[0].user_lists
    } catch (error) {
      console.log(error)
    }

    return numberOfLists;
  }

  const session:any = await getSessionUser()
  let numberOfLists = await getUserListsNumber(session)
  let userHasNoLists: boolean = false;

  if (!session) {
    return (
      <div className='flex h-screen items-center'>
        <NotLoggedVideogamelist />
      </div>
    )
  }
  else if (numberOfLists <= 0) {
    userHasNoLists = true;
  }

  return (
    <section className="flex justify-center text-white min-h-screen bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
        <div className="flex items-center text-lg md:text-3xl border-b-2 border-gray-500 pb-3 mb-8">
          <h2 className='text-2xl'>My lists</h2>
          <p className='text-gray-400 text-base ml-8 mt-1'>{numberOfLists} list/s</p>
          <Link href={"newList"} className="ml-auto"><PrimaryButton text='Add list' /></Link>
        </div>
        {/* If the user has no lists, shows the component NoListCreated, if not it shows the children (mylists) */}
        {userHasNoLists ? <NoListCreated /> : children}
      </div>
    </section>
  )
}