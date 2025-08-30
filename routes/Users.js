const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const { User, Likes } = require("../models")
const { sign } = require("jsonwebtoken")
const { validateToken } = require("../middlewares/AuthMiddleware")

router.post("/", (req, res) => {
    const { username, password } = req.body
    bcrypt.hash(password, 10).then((hash) => {
        User.create({
            username: username,
            password: hash
        })
        res.json("USER CREATED")
    })
})

router.post("/login", async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } })
    if (!user) {
        res.json({ error: "USER NOT FOUND" })
    }

    bcrypt.compare(req.body.password, user.password).then((match) => {
        if (!match) {
            res.json({ error: "WRONG USERNAME AND PASSWORD COMBINATION" })
        }

        const accessToken = sign({ username: user.username, id: user.id }, "secret")
        console.log(accessToken)
        res.json({ token: accessToken, username: user.username, id: user.id })
    })
})

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user)

})


router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id
    const basicInfo = await User.findByPk(id, { attributes: { exclude: ["password"] }, })

    res.json(basicInfo)


})

router.put("/change-password", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findOne({ where: { username: req.user.username } })
    bcrypt.compare(oldPassword, user.password).then((match) => {
        if (!match) {
            res.json({ error: "WRONG PASSWORD ENTERED!" })
            return
        }
        bcrypt.hash(newPassword, 10).then((hash) => {
            User.update({password : hash}, {where : {username: req.user.username}})
            res.json("USER UPDATED")
        })
    })
})


module.exports = router