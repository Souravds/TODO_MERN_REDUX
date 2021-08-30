const express = require('express')
const mongoose = require('mongoose')

//mongodb - mongodb+srv://srv:pVxzFihO1OJ72MOl@cluster0.n8eb8.mongodb.net/tododb?retryWrites=true&w=majority
const app = express()
const PORT = 5000

//MONGODB CONNECT
mongoose.connect('mongodb+srv://srv:pVxzFihO1OJ72MOl@cluster0.n8eb8.mongodb.net/tododb?retryWrites=true&w=majority')

//IF MONGOOSE CONNECTED
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo');
})

//IF MONGOOSE NOT CONNECTED DUE TO ERROR
mongoose.connection.on('error', (err) => {
    console.log('Error', err);
})

//WHEN REQUEST IN ROOT ROUTE
app.get('/', ( req,res ) => {
    res.json({message: 'Helloooo'})
})

//INITIALIZE IN WHICH PORT APP CAN LISTEN
app.listen(PORT, () => {
    console.log('Server running on', PORT);
})