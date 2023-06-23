import mongoose from "mongoose"

const TokenSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    refreshToken: {
        type:String,
        required:['재발급 토큰을 입력해주세요.']
    }
}, {timestamps: true});

export default mongoose.model('Token', TokenSchema);