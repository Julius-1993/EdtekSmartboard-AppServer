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
  items: [
  {
    name: String,
    quantity: Number,
    price: Number,
    cartId: Schema.Types.ObjectId,
    menuItemId: Schema.Types.ObjectId
  }
],
  createdAt: {
      type: Date,
      default: Date.now
  }

}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;