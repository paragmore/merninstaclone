const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

const User = mongoose.model("User")

router.get('/protected',requireLogin, (req,res) => {
    res.send("Hello MAn!")
})

router.post('/signup', (req,res)=>{
    console.log(req.body.name)
    const {name, email, password} = req.body
    if( !name || !email || !password){
       return res.status(422).json({error : "Please enter all fields"})
    }
    User.findOne({email:email})
    .then(
        (savedUser)=>{
            if(savedUser){
                return res.status(422).json({error: "User already exists with that email"})
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    email : email,
                    password : hashedpassword,
                    userName : name
                })
    
                user.save()
                .then(user=>{
                    res.json({message: "saved successfully"})
                })
                .catch((err)=>{
                    console.log(err)
                })  
            })
            
        }
    )
    .catch((err)=>{
        console.log(err)
    })
    
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body
    if(!email || !password ){
        return res.status(422).json({error:"Please provide email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid credentials provided"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successfully signed in"})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                res.json({token})
            }
            else{
                return res.status(422).json({error:"Invalid credentials provided"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router