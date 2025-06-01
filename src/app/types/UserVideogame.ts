import mongoose, { Schema } from 'mongoose';
   
const userVideogameSchema = new mongoose.Schema({
    _user_id: Schema.Types.ObjectId,
    videogame_id: String,
    favourite: 
        {type: Boolean, default: 0},
    score: Number,
    hours_played: {type: Number, default: 0},
    videogame_name: String,
    videogame_base_image: String
})

const UserVideogame = mongoose.models.UserVideogame || mongoose.model('user_videogame', userVideogameSchema)
export default UserVideogame;