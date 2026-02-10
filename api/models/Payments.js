import mongoose from "mongoose";
const {Schema} = mongoose;

const paymentSchema = new Schema({
  transactionId: String,
  email: String,
  price: Number,
  quantity: Number,
  status: {
    type: String,
    default: "pending"
  },
  itemName: Array,
  cartItems: Array,
  menuItems: Array,
  createdAt: {
      type: Date,
      default: Date.now
  }

}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;