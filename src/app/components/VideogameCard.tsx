
export default function VideogameCard(imageId:string) {
    console.log(imageId)
    return(
        <div className='rounded-2xl overflow-hidden'>
            <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${imageId}.png`} className='w-96 h-96' />
        </div>
    )
}