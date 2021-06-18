require('dotenv').config()

const express= require('express')
const app= express()
const jwt =require('jsonwebtoken')
app.use(express.json())
console.log('Hello')
let refreshTokens=[]
app.post('/login',(req,res)=>{
  //Authenticate User
  const username= req.body.username
  const user={name:username}
 const accessToken= generateAccessToken(user)
 const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN)
 refreshTokens.push(refreshToken)
 res.json({accessToken:accessToken , refreshToken:refreshToken})
})

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token=> token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token',(req,res)=>{
    const refreshtoken = req.body.token
    if(refreshtoken == null) return res.sendStatus(401)
    if(!(refreshTokens.includes(refreshtoken))) return res.sendStatus(403)
    jwt.verify(refreshtoken,process.env.REFRESH_TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken=generateAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
})
function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '50s'})
}
app.listen(4000)