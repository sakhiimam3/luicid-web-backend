const mongoose =require("mongoose")


const userDetailSchema=mongoose.Schema({
        userName:String,
        password:String,
        email:String
}
,{
    collection:"userInfo",
}
 
)

mongoose.model("userInfo",userDetailSchema)


