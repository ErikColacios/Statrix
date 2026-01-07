import { getSession } from "@/actions/getSession";
import getUserGameReviews from "@/actions/getUserGameReviews";
import getUserGameStats from "@/actions/getUserGameStats";
import getUserInfo from "@/actions/getUserInfo";
import getUsersFriendship from "@/actions/getUsersFriendship";
import getUsersFriendshipAccepted from "@/actions/getUsersFriendshipAccepted";
import { getUserTotalHoursPlayed } from "@/actions/getUserTotalHoursPlayed";
import { getUserTotalReviews } from "@/actions/getUserTotalReviews";
import PrimaryButton from "@/components/PrimaryButton";
import SliderGameStats from "@/components/SliderGameStats";
import { FriendshipStatus } from "@/enums/FriendshipStatus";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Profile({ params }: { params: { userName: string } }) {

    const session = await getSession()
    const user_id: string | undefined = session.user_id
    let userInfo: any | undefined = []
    let userGameStats: any | undefined = []
    let userTotalHoursPlayed: number | undefined
    let userTotalReviews: number | undefined
    let userReviews: any | undefined = []
    let canEdit: Boolean = false

    // Protect route in case someone types the route wihtout logging in
    if (!session.isLoggedIn) {
        redirect("/")
    }

    if (user_id !== undefined) {
        if (params.userName == session.user_name) {
            canEdit = true;
        }
        userInfo = await getUserInfo(params.userName)
        userGameStats = await getUserGameStats(params.userName)
        userTotalHoursPlayed = await getUserTotalHoursPlayed(params.userName)
        userTotalReviews = await getUserTotalReviews(params.userName)
        userReviews = await getUserGameReviews(params.userName)
    }


    return (
        <section className="flex flex-col lg:flex-row space-y-12 lg:space-x-12 w-full h-screen pt-24 p-4 md:p-12 text-white bg-gradient-to-b from-black via-gray-900 to-black">
            {userInfo.map((item: any, index: number) => (

                <div className="flex flex-col lg:w-1/3 xl:w-1/3 shadow-lg bg-zinc-900/80 md:mt-12 greenShadow" key={index}>
                    {/* DIV PROFILE IMAGE */}
                    <div className="relative h-70 z-10">
                        <img src={"/bannerImages/" + item.banner_image} />
                        <div className="w-28 h-28 md:w-36 md:h-36 2xl:w-48 2xl:h-48 rounded-full overflow-hidden ml-6 absolute top-12 sm:top-32 md:top-32 lg:top-10">
                            <img src={"/avatarImages/" + item.avatar_image} className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div className="p-6 pt-16">
                        <div className="flex items-center relative">
                            <p className="text-4xl font-bold">{item.user_name}</p>
                            {/* Edit profile */}
                            {/* {canEdit ? <Link href={"/settings"} className="absolute right-0 text-sm p-5 sm:px-8 rounded border border-green-500 hover:bg-green-500 hover:text-black">EDIT PROFILE</Link> : ''} */}

                            {canEdit ? <Link href={"/settings"} className="ml-auto"><PrimaryButton text="EDIT PROFILE" /></Link> : ''}

                        </div>
                        <div className="mt-4" >
                            {/* User biography */}
                            <p>{item.user_bio}</p>

                            <div className="flex mt-8 ">
                                <div className="text-md sm:text-lg mr-8 text-green-400">
                                    <p>Joined</p>
                                    <p>Email</p>
                                    <p>Location</p>
                                    <p>Friends</p>
                                    {/* <p>Webpage</p> */}
                                    {/* <p>Steam Account</p> */}
                                    {/* <p>Twitch Account</p> */}
                                    {/* <p>X Account</p> */}
                                </div>
                                <div className="text-md sm:text-lg">
                                    <p className="">{item.user_creationdate.toISOString().split('T')[0]}</p>
                                    <p className="">{item.user_email}</p>
                                    <p className="">{item.user_location}</p>
                                    <p className="">{item.friends}</p>
                                    {/* <p><a className="underline" href={"https://"+item.user_webpage} target="_blank" rel="noopener noreferrer">{item.user_webpage}</a></p> */}
                                    {/* <p><a className="underline" href={"https://"+item.user_steam} target="_blank" rel="noopener noreferrer">{item.user_steam}</a></p> */}
                                    {/* <p><a className="underline" href={"https://"+item.user_twitch} target="_blank" rel="noopener noreferrer">{item.user_twitch}</a></p> */}
                                    {/* <p><a className="underline" href={"https://"+item.user_x} target="_blank" rel="noopener noreferrer">{item.user_x}</a></p> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col lg:w-2/3 xl:w-2/3 p-4 md:p-10 shadow-lg bg-zinc-900/80 greenShadow">
                <div className="flex space-x-8">
                    <div className="flex flex-col items-center text-center w-32">
                        <p className="text-6xl font-bold">{userGameStats.gamesPlayed}</p>
                        <p className="text-green-400">Games played</p>
                    </div>
                    <div className="flex flex-col items-center text-center w-32">
                        <p className="text-6xl font-bold">{userTotalHoursPlayed}</p>
                        <p className="text-green-400">Hours played</p>
                    </div>
                    <div className="flex flex-col items-center text-center w-32">
                        <p className="text-6xl font-bold">{userTotalReviews}</p>
                        <p className="text-green-400">Games reviewed</p>
                    </div>
                </div>

                <SliderGameStats userGameStats={userGameStats} />

                <div className='flex flex-col rounded-2xl bg-gradient-to-b from-black via-gray-900 to-black px-10 py-4 mt-8'>
                    <p className='text-green-400 mb-2'>Latest review</p>

                    {userReviews.map((r: any, index: number) => (
                        <div key={index} className='flex'>
                            <img src={r.game_base_image} className="w-20 h-24" alt="Game reviewed" />
                            <div className="flex flex-col pl-4 h-36">
                                <div className="flex items-center text-gray-400">
                                    {r.recommended ?
                                        <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#15cc67ff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                        :
                                        <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>dislike [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -760.000000)" fill="#e02020ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M139.800374,612 L144.00037,612 L144.00037,600 L139.800374,600 L139.800374,612 Z M127.698085,600 L137.700376,600 L137.700376,611.979 L135.894378,618.174 C135.725328,619.224 134.776129,620 133.66103,620 C132.412581,620 131.400381,619.036 131.400381,617.847 L131.400381,612 L125.873186,612 C124.026238,612 122.659139,610.358 123.074939,608.644 L124.899837,602.109 C125.200137,600.868 126.360386,600 127.698085,600 L127.698085,600 Z" id="dislike-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                    }
                                    <p>{r.videogame_name}</p>
                                    <p className="ml-8">Likes: <b>{r.likes}</b></p>
                                    <p className="ml-8">Review date: {r.review_date.toLocaleDateString()}</p>
                                </div>
                                <div className="overflow-scroll no-scrollbar">
                                    <p className="mt-2">{r.body}</p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}