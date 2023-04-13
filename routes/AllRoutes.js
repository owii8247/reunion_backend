const express = require("express")
const router = express.Router()
const AllController = require("../controllers/AllController")
const verifyToken = require("../middleware/Authentication")

router.post("/api/authenticate", AllController.userAuthenticate)
router.post("/api/postuser", AllController.postUser)
router.post("/api/follow/:id", verifyToken, AllController.followUser)
router.post("/api/unfollow/:id", verifyToken, AllController.unfollowUser)
router.get("/api/user", verifyToken, AllController.getUser)
router.post("/api/posts", verifyToken, AllController.postPosts)
router.delete("/api/posts/:id", verifyToken, AllController.deletePosts)
router.post("/api/like/:id", verifyToken, AllController.postLike)
router.post("/api/unlike/:id", verifyToken, AllController.postUnlike)
router.post("/api/comment/:id", verifyToken, AllController.postComment)
router.get("/api/all_posts", verifyToken, AllController.getAllPost)







module.exports = router