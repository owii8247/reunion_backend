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
router.delete("/api/posts/:id", AllController.deletePosts)
router.post("/api/like/:id",  AllController.postLike)
router.post("/api/unlike/:id",  AllController.postUnlike)
router.post("/api/comment/:id",  AllController.postComment)
router.get("/api/all_posts",  AllController.getAllPost)







module.exports = router