const express = require("express");
const app = express()

const moongoose = require("mongoose")
const core = require("cors")
app.use(express.json())
app.use(core())
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const {v4: uuidv4} = require("uuid");

const mongooseUrl = "mongodb+srv://sakhidad:masjid1234@cluster0.x0sowvf.mongodb.net/?retryWrites=true&w=majority"
moongoose.connect(mongooseUrl, {useNewUrlParser: true}).then(() => console.log("connected to database")).catch((err) => console.log(err))

const jwt_Secret = "KASKDK@OASJDKPSAKLAKSKDKAAKSMDLAMS/OIKASDLMALMD/AMKPKASAOSKDPO"


require("./model/userDetail")
require("./model/createEventSchema")
const Users = moongoose.model('userInfo')
const Events = moongoose.model('createEvent')


// register api
app.post("/register", async (req, res) => {
    const {userName, password, email} = req.body
    const oldUser = await Users.findOne({email})
    if (oldUser) {
        return res.json({error: "User Already exist"})
    }
    const cryptedPassword = await bcrypt.hash(password, 10)
    try {
        await Users.create({userName, password: cryptedPassword, email})
        res.send({message: "User registered successfully "})
    } catch (error) {
        res.send({status: "false"})
    }
})


// login api

app.post("/Login", async (req, res) => {

    const {email, password} = req.body
    const user = await Users.findOne({email})
    if (!user) {

        return res.json({message: "User Not found !"})
    }
    const isvalidUser = await bcrypt.compare(password, user.password).then(result => result)

    if (isvalidUser) {

        const token = jwt.sign({  email: user.email}, jwt_Secret)

        if (res.status(200)) {
            res.send({message: 'user succesfully login', data: {token, email: user.email}, success: user.userName})

        } else {
            res.send({message: 'try again '})
        }
    } else {
        res.json({message: "invalid password"})
    }
})


app.post("/UserData", async (req, res) => {
    const {token} = req.body
    try {
        const users = jwt.verify(token, jwt_Secret)
        console.log(users, ",,,,")
        const userEmail = users.email;

        Users.findOne({email: userEmail}).then((data) => {
            res.send({status: true, data})
            console.log(data)
        }).catch((err) => res.send({status: "error", data: err}))

    } catch (error) {
        console.log(error)
    }
})


// evebts api
app.post("/createEvent", async (req, res) => {
    const {
        email,
        event,
        description,
        date,
        time,
        select,
        city
    } = req.body


    try {
        await Events.create({
      
            email,
            event,
            description,
            date,
            time,
            select,
            city

        })
        res.send({message: "data send succesfuuly "})
    } catch (error) {
        res.send({status: "false"})
    }
})


app.post("/getEventData", async (req, res) => {
      const {email}=req.body
      console.log(email,"???")
      Events.find({email}).then((data) => {
        res.send({status: true, data})
        console.log(data)
    }).catch((err) => res.send({status: "error", data: err}))

})


app.listen(5000, () => {
    console.log("server succesfully started ")
})
