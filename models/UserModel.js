const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, default: 0, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, default: 0, ref: "User" }]
});

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel
