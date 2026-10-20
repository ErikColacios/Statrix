import React from "react"

export default function Review({ review, index }: any) {

    // Date formatter
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

    return (
        <div key={index}
            className={`flex flex-col space-y-2 min-h-36 p-4 mb-8 rounded-lg bg-zinc-900/80 shadow-lg border border-white/10
                            ${review.game_score >= 8 ? ' cardReviewGreen shadow-green-500/30 border-green-600' : ''}
                            ${review.game_score >= 4 && review.game_score < 8 ? ' cardReviewYellow shadow-yellow-500/30 border-yellow-700/80' : ''}
                            ${review.game_score < 4 && review.game_score > 0 ? ' cardReviewRed shadow-rose-500/30 border-rose-700' : ''}
                            ${Number(review.game_score) === 0 ? 'bg-zinc-900/80 shadow-zinc-500/30 border-white/10' : ''}
                            `}>
            <div className="relative flex flex-col space-y-1">
                <div className="flex flex-col space-x-2 sm:flex-row sm:items-center text-white">
                    <div className="flex items-center hover:text-green-400 cursor-pointer">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img src={review.user_avatar} className="h-full w-full object-cover" alt="User avatar" />
                        </div>
                        <p className="font-bold">{review.user_name}</p>
                        <p className="ml-2 text-gray-400">reviewed </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <p className="font-bold">{review.gameName}</p>
                        <p className={`flex justify-center items-center rounded-full w-8 h-8 font-bold border
                                        ${review.game_score >= 8 ? 'text-green-400 border-green-600' : ''}
                                                ${review.game_score >= 4 && review.game_score < 8 ? 'text-yellow-400 border-yellow-700/80' : ''}
                                                ${review.game_score < 4 && review.game_score > 0 ? 'text-rose-400 border-rose-700' : ''}
                                                ${Number(review.game_score) === 0 ? 'text-gray-300 border-white/10' : ''}
                                        `}>
                            {Number(review.game_score) === 0 ? "NS" : review.game_score}
                        </p>
                    </div>

                    <div className="absolute right-0 mt-1 flex items-center space-x-2 text-sm">
                        <div className="flex space-x-2 items-center text-white">
                            {/* Like button */}
                            <div className="flex items-center ml-auto pr-2 text-xs">
                                <button id={'likeButton' + review.review_id}>
                                    <img id={'likeButtonImage' + review.review_id} src={`/staticImages/${review.liked_by_user == 1 ? 'icon_heart_red.png' : 'icon_heart_gray.png'}`} alt="Liked icon" className="w-4 h-4 mr-1" />
                                </button>
                                <span className="text-gray-400" id={'likeCount' + review.review_id}>
                                    {review.likes}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="text-sm text-gray-400" suppressHydrationWarning>
                    {formatter.format(review.review_date)}
                </span>
            </div>
            <div className="max-h-64 overflow-hidden no-scrollbar py-2">
                <p>{review.body}</p>
            </div>
        </div>
    )
}