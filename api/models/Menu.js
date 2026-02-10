import mongoose from "mongoose";
const {Schema} = mongoose;

// create schema object for Menu Items
const menuSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    product: String,
    image: String, 
    category: String,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true})

// create model
const Menu = mongoose.model("Menu", menuSchema);
export default Menu;