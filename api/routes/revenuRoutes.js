import express from 'express'
import Payment from '../models/Payments.js';
import verifyToken from '../middleware/verifyToken.js'
import verifyAdmin from '../middleware/verifyAdmin.js';
import User from '../models/User.js';


const router = express.Router();


router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Orders
    const totalOrders = await Payment.countDocuments();

    // Total Revenue
    const totalRevenueResult = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ]);
    const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].totalRevenue : 0;

    // Pending Orders
    const pendingOrders = await Payment.countDocuments({ status: 'pending' });

    // Revenue per Month
    const revenuePerMonth = await Payment.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$price' }
        }
      },
      {
        $project: {
          month: '$_id',
          revenue: 1,
          _id: 0
        }
      }
    ]);

    // Revenue per Year
    const revenuePerYear = await Payment.aggregate([
      {
        $group: {
          _id: { $year: '$createdAt' },
          revenue: { $sum: '$price' }
        }
      },
      {
        $project: {
          year: '$_id',
          revenue: 1,
          _id: 0
        }
      }
    ]);

    // Orders per Week
    const ordersPerWeek = await Payment.aggregate([
      {
        $group: {
          _id: { $week: '$createdAt' },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          week: '$_id',
          orders: 1,
          _id: 0
        }
      }
    ]);

    // Orders per Month
    const ordersPerMonth = await Payment.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          orders: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalUsers,
      totalRevenue,
      totalOrders,
      pendingOrders,
      revenuePerMonth,
      revenuePerYear,
      ordersPerWeek,
      ordersPerMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;