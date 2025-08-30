const express = require("express")
const app = express()
const db = require("./models")
const cors = require("cors");
require("dotenv").config()
const postsRouter = require("./routes/Posts")
const commentsRouter = require("./routes/Comments")
const UserRouter = require("./routes/Users")
const LikesRouter = require("./routes/Likes")


//Middlewares
app.use(express.json())
app.use(cors());

//Routers
app.use("/posts", postsRouter)
app.use("/comments", commentsRouter)
app.use("/auth", UserRouter)
app.use("/likes", LikesRouter )


db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server running on port " + (process.env.PORT || 3001));
  });
}).catch((err) => {
  console.log(err);
});