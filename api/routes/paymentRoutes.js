import express from 'express'
import mongoose from 'mongoose';
import Payment from '../models/Payments.js';
import Cart from '../models/Carts.js';
import verifyToken from '../middleware/verifyToken.js'
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

const ObjectId = mongoose.Types.ObjectId;

//Token


//post payment information to db
router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;
  try {
    const paymentRequest = await Payment.create(payment);

    //delete cart after payment
    const cartIds = payment.cartItems.map((id) => new ObjectId(id));
    const deleteCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } });

    res.status(200).json({ paymentRequest, deleteCartRequest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      res.status(403).json({ message: "Forbiden Access" });
    }
    const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get all payments (Admin protected route)
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Approve an Order
router.put("/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await Payment.findById(
      req.params.id
    );
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }
    result.status = 'Approved';
    await result.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
