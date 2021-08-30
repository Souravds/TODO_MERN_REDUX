//INIT APP BY EXPRESSJS
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/user')

const app = express()
const PORT = 5000

//MONGODB CONNECT by mongoose
mongoose.connect('mongodb+srv://srv:pVxzFihO1OJ72MOl@cluster0.n8eb8.mongodb.net/tododb?retryWrites=true&w=majority')

//IF MONGOOSE CONNECTED LOG TO CONNECTED
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo');
})

//IF MONGOOSE NOT CONNECTED DUE TO ERROR, LOG THE ERROR
mongoose.connection.on('error', (err) => {
    console.log('Error', err);
})

//BEFORE GOING THROUGH THE SIGNUP AND SIGNIN PROCESS THIS MIDDLEWARE PARSED ALL THINGS IN JSON
app.use(express.json())

//GET SIGNUP REQ FROM FRONT_END
app.post('/signup', async ( req, res ) => {
    //RECIEVE FRONT_END USER REQ IN JSON FORMAT AND DESTRUCTURING
    const {email,password} = req.body
    try {
        //USER EXISTS
        if(!email || !password){
            return res.status(422).json({error: 'Please fill up all the required fields.'})
        }

        //CHECK EXISTING USER
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(422).json({error: 'User already exists with this email'})
        }

        //HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password,12)

        //SAVE THE USER ( -.- )
        await new User({
            email,
            password: hashedPassword
        }).save()
        res.status(200).json({message: 'SignUp successfully.'})
    } catch (error) {
        console.log(error);
    } 
    
})

//INITIALIZE IN WHICH PORT APP CAN LISTEN
app.listen(PORT, () => {
    console.log('Server running on', PORT);
})