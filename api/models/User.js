import mongoose from "mongoose";

// schema model
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true})

// create a model instance
const User = mongoose.model('User', userSchema);

export default User;