const mongoose =require("mongoose")


const createEvent=mongoose.Schema({
        email:String,
        event:String,
        description:String,
        date:String,
        time:String,
        select:String,
        city:String
}       
,{
    collection:"createEvent",
}
 
)

mongoose.model("createEvent",createEvent)


