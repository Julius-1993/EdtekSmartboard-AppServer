import Menu from "../models/Menu.js";

export const getAllMenuItems = async(req, res) => {
    try {
        const menus = await Menu.find({}).sort({createdAt: -1});
        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// post a new menu item
export const postMenuItem = async(req, res) => {
    const newItem = req.body;
    try {
        const result = await Menu.create(newItem);
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete a menu item
export const deleteMenuItem = async(req, res) => {
    const menuId = req.params.id;
    try {
        const deletedItem = await Menu.findByIdAndDelete(menuId);
        if(!deletedItem){
            return res.status(404).json({ message:"Menu not found"})
        }
        res.status(200).json({message: "Menu Item deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single menu item
export const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const menu = await Menu.findById(menuId);
        res.status(200).json(menu)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update single menu item
export const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const { name, product, image, category, price} = req.body;
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(menuId, 
            { name, product, image, category, price}, 
            {new: true, runValidator: true}
            );

        if(!updatedMenu) {
            return res.status(404).json({ message:"Menu not found"})
        }

        res.status(200).json(updatedMenu)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
