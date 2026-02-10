import express from "express";
import Menu from '../models/Menu.js';
import {getAllMenuItems, postMenuItem, deleteMenuItem, singleMenuItem, updateMenuItem} from '../controllers/menuControllers.js';
const router = express.Router();


// get all menu items 

router.get('/', getAllMenuItems )

// post a menu item
router.post('/', postMenuItem);

// delete a menu item
router.delete('/:id', deleteMenuItem);

// get single menu item
router.get('/:id', singleMenuItem);

// update single menu item
router.patch('/:id', updateMenuItem)

export default router;