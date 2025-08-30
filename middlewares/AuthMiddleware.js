const {verify} = require("jsonwebtoken")


const validateToken = (req,res ,next) => {
    const accessToken = req.header("accessToken")

    if(!accessToken) {
        return res.json({error: "User not logged in"})
    }
    try{
        const validateToken = verify(accessToken, "secret")
        req.user = validateToken
        if (validateToken){
            return next()
        }

    }catch(error){
        return res.json({error: error.message})
    }
}

module.exports = { validateToken }