import express from 'express';
import mongoose from 'mongoose';
import Payment from '../models/Payments.js';
import Cart from '../models/Carts.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// POST /payments — save payment & clear cart
router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;

  try {
    const paymentRequest = await Payment.create(payment);
    const cartIds = payment.items.map(item => new ObjectId(item.cartId));
    const deleteCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } });
    res.status(200).json({ paymentRequest, deleteCartRequest });

  } catch (error) {
    console.error("Payment POST error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /payments?email=user@example.com — get user payments
router.get("/", verifyToken, async (req, res) => {
  const email = req.query.email;
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      return res.status(403).json({ message: "Forbidden Access" });
    }

    const result = await Payment.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /payments/orders — admin: get all payments
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /payments/approve/:id — admin: approve order
router.put("/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Order not found" });

    payment.status = "Approved";
    await payment.save();

    res.status(200).json(payment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;