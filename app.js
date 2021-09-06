//INIT APP BY EXPRESSJS
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const User = require('./models/user')
const Todo = require('./models/todo')
const {JWT_SECRET, MONGOURI }  = require('./config/keys')

const app = express()
const PORT = 5000

//MONGODB CONNECT by mongoose
mongoose.connect(MONGOURI)

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
app.use(cors())

//MIDDLEWARE TO DETECT IF THE USER IS LOGIN OR NOT
const requiredLogin = (req, res, next) => {
    //DESTRUCTURE TOKEN FROM HEADERS 
    const { authorization } = req.headers
     if(!authorization){
        return res.status(401).json({error: 'You must be logged in.'})
     }

     //IF THE TOKEN IS INVALID OR NOT
     try{
         //DECODE THE USERID
         const {userId} = jwt.verify(authorization, JWT_SECRET)
         
         //SET THE REQ USER IF FOUND
         req.userId = userId
         next()
     }catch(error){
        return res.status(401).json({error: 'You must be logged in.'})
     }
}

//JUST A TEST IF THE HEADERS HAVE VALIDATED TOKEN OR NOT
app.get('/test',requiredLogin,(req,res) => {
    res.json({userId: req.userId})
})


//CREATE TODO ROUTES
app.post('/createtodo', requiredLogin,async (req, res) => {
    //CREATE AND SAVE THE TODO
    const createdTodo = await new Todo({
        todo: req.body.todo,
        todoBy: req.userId
    }).save()
    
    res.status(201).json({message : createdTodo})
})

//GET ALL TODOS
app.get('/gettodos', requiredLogin, async (req, res) => {
    //MATCH THE USERID AND GET ALL TODOS
    const todos = await Todo.find({
        todoBy: req.userId
    })
    res.status(200).json({message: todos})
})

//DELETE TODO ROUTE
app.delete('/deletetodo/:id',requiredLogin, async (req,res) => {
    const removeTodo = await Todo.findOneAndDelete({_id: req.params.id})
    res.status(200).json({message: removeTodo})
})

//SIGNUP ROUTE
app.post('/signup', async ( req, res ) => {
    //RECIEVE FRONT_END USER REQ IN JSON FORMAT AND DESTRUCTURING
    const {email,password} = req.body
    try {
        //FIELD VALIDATION
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

//SIGNIN ROUTE
app.post('/signin', async ( req, res ) => {
    //RECIEVE FRONT_END USER REQ IN JSON FORMAT AND DESTRUCTURING
    const {email,password} = req.body
    try {
        //FIELD VALIDATION
        if(!email || !password){
            return res.status(422).json({error: 'Please fill up all the required fields.'})
        }

        //CHECK EXISTING USER
        const existUser = await User.findOne({email})
        if(!existUser){
            return res.status(404).json({error: 'User does not exist with this email!!'})
        }

        //MATCH THE USER PASSWORD
        const matchPassword = await bcrypt.compare(password, existUser.password)

        if (matchPassword) { 
            //TOKEN GENERATE FOR SIGNED USER
            const token = jwt.sign({userId: existUser._id}, JWT_SECRET)

            //RESPONSE WITH TOKEN
            res.status(201).json({token})
        } else {

            //UNAUTHORIZED ERROR
            return res.status(401).json({error: 'Email or Password does not match.'})
        }
    } catch (error) {
        console.log(error);
    } 
    
})

//RUN REACT CLIENT APPLICATION BY USER REQ
if(process.env.NODE_ENV == 'production'){
    const path = require('path')

    //WHEN USER REQ SERVE THE BUILD REACT FILE => index.html
    app,get('/', (req, res) => {
        //SPECIFY the css files and others
        app.use(express.static(path.resolve(__dirname, 'client', 'build')))

        //SPECIFY THE index.html
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


//INITIALIZE IN WHICH PORT APP CAN LISTEN
app.listen(PORT, () => {
    console.log('Server running on', PORT);
})
