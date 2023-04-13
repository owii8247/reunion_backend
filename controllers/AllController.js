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
    } catch (error) {
        console.error(error);
        res.status(500).json({ "Message": "Internal server error" });
    }
}

// Unfollow a user 
const unfollowUser = async(req,res) =>{
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

const postPosts = async(req,res) =>{
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
          title: post.title,
          description: post.description,
          created_at: post.created_at
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
}
module.exports = {
    userAuthenticate,
    postUser,
    getUser,
    followUser,
    unfollowUser,
    postPosts
}