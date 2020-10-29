const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5000
//xnXPlBEza4VnY8Zl
const {MONGOURI} = require('./keys')



mongoose.connect(MONGOURI, {useNewUrlParser: true,useUnifiedTopology: true})
mongoose.connection.on('connected', ()=>{
    console.log("Connected to mongos")
})
mongoose.connection.on('error', (err)=>{
    console.log("Error connection " ,err)
})

require('./models/user')

app.use(express.json())
app.use(require('./routes/auth'))

app.get('/', (req, res)=>{
    res.send("Hello Worlds")
})

app.listen(PORT,()=>{
    console.log("Server is running on", PORT)
})