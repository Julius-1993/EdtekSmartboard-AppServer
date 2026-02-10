import express from 'express'
import Carts from '../models/Carts.js'
import {getCartByEmail, addToCart, deleteCart, updateCart,  getSingleCart } from '../controllers/cartControllers.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router();


router.get('/', verifyToken, getCartByEmail);
router.post('/', addToCart);
router.delete('/:id', deleteCart)
router.put('/:id', updateCart)
router.get('/:id', getSingleCart)

export default router;