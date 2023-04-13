const express = require("express")
const router = express.Router()
const AllController = require("../controllers/AllController")
const verifyToken = require("../middleware/Authentication")

router.post("/api/authenticate", AllController.userAuthenticate)
router.post("/api/postuser", AllController.postUser)
router.post("/api/follow/:id", AllController.followUser)
router.post("/api/unfollow/:id", AllController.unfollowUser)
router.get("/api/user", AllController.getUser)
router.post("/api/posts", AllController.postPosts)





module.exports = router