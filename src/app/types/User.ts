import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    user_name: String,
    user_password: String,
    user_bio:String,
    user_email: String,
    user_location:String,
    user_webpage:String,
    user_avatar:String,
    user_banner:String,
    user_lists: {
        type: Number,
        default: 0
    },
    user_creationdate:String 
})

const User = mongoose.models.User || mongoose.model('user', userSchema);
export default User;