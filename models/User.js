import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unqiue:true
    },
    password: {
        type:String,
        required:['비밀번호를 입력해주세요.']
    }
});

export default mongoose.model('User', UserSchema);