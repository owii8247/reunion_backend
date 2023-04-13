const PostModel = require("../models/PostModel")
const UserModel = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

const dummyUser = {
    email: "reunion@mail.com",
    password: "reunion123"
}


// Perform user authentication and return a JWT token
const userAuthenticate = async (req, res) => {
    const { email, password } = req.body;
    if (email === dummyUser.email && password === dummyUser.password) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).json({ "Message": "Invalid email or password" });
    }
}

// Post a User
const postUser = async (req, res) => {
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}

// Get a user 
const getUser = async (req, res) => {
    try {
        const user = await UserModel.find();
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Follow a user
const followUser = async (req, res) => {
    try {
        const followedUser = await UserModel.findById(req.params.id);
        if (!followedUser) {
            return res.status(404).json({ "Message": "User not found" });
        }

        const followingUser = await UserModel.findById(req.params.id);
        if (!followingUser) {
            return res.status(401).json({ "Message": "Unauthorized" });
        }

        if (followingUser.following.includes(followedUser._id)) {
            return res.status(400).json({ "Message": "Already following the user" });
        }

        followingUser.following.push(followedUser._id);
        followedUser.followers.push(followingUser._id);

        await followingUser.save();
        await followedUser.save();

        res.json({ "Message": "Successfully followed the user" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Internal server error", err });
    }
}

// Unfollow a user 
const unfollowUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        const unfollowUser = await UserModel.findById(req.params.id);

        if (!user || !unfollowUser) {
            return res.status(404).json({ "Message": "User not found" });
        }

        if (user.following.indexOf(req.params.id) === -1) {
            return res.status(400).json({ "Message": "You are not following this user" });
        }

        user.following.pull(req.params.id);
        await user.save();

        unfollowUser.followers.pull(req.user.id);
        await unfollowUser.save();

        res.status(200).json({ "Message": "User unfollowed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server Error" });
    }
}

// Post 

const postPosts = async (req, res) => {
    try {
        // create new post object with data from request body
        const newPost = new PostModel({
            title: req.body.title,
            description: req.body.description
        });

        // save new post to database
        const post = await newPost.save();

        // return post information
        res.json({
            _id: post._id,
            title: post.title,
            description: post.description,
            created_at: post.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Internal Server Error", err });
    }
}

// Delete Post
const deletePosts = async (req, res) => {
    try {
        const posts = await PostModel.findByIdAndDelete(req.params.id);
        if (!posts) {
            return res.status(404).send({ "Message": "Post not found" });
        }

        res.send({ "Message": "Post Deleted Successfully", posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Internal Server Error", err });
    }
}

// Post Like 
const postLike = async (req, res) => {
    try {
        const posts = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!posts) {
            return res.status(404).send();
        }

        res.send(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "Message": "Internal server error" });
    }
}

// Post Unlike

const postUnlike = async (req, res) => {
    try {
        const posts = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: -1 } },
            { new: true }
        );

        if (!posts) {
            return res.status(404).send();
        }

        res.send(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "Message": "Internal server error" });
    }
}

// Comment on Post
const postComment = async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).send({ "Message": "Post not found" });

    const comment = new Comment({
        comment: req.body.comment,
        author: req.user._id,
        post: post._id
    });

    try {
        const savedComment = await comment.save();
        res.send({ comment: savedComment._id });
    } catch (err) {
        res.status(400).send(err);
    }
}


// Get All Post
const getAllPost = async (req, res) => {
    try {
        //const userId = req.user._id;

        const posts = await PostModel.find()
            .populate('comments')
            .sort({ createdAt: 'desc' })
            .exec();

        const postList = posts.map((post) => {
            return {
                id: post._id,
                title: post.title,
                description: post.description,
                created_at: post.created_at,
                comments: post.comments,
                likes: post.likes.length,
            };
        });

        res.status(200).json(postList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "Message": "Internal server error" });
    }
}


module.exports = {
    userAuthenticate,
    postUser,
    getUser,
    followUser,
    unfollowUser,
    postPosts,
    deletePosts,
    postLike,
    postUnlike,
    postComment,
    getAllPost,
}