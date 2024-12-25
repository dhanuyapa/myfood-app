const CartItem = require('../models/CartItem');
const food = require('../models/food');

// Controller for adding an item to the cart
// Controller for adding an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const { nic, foodId, quantity } = req.body;

        if (!nic || !foodId || !quantity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let cartItem = await CartItem.findOne({ nic });

        if (!cartItem) {
            cartItem = new CartItem({
                nic,
                foodItems: [{ foodId, quantity }]
            });
        } else {
            const existingFoodItem = cartItem.foodItems.find(item => item.foodId.equals(foodId));
            if (existingFoodItem) {
                existingFoodItem.quantity += quantity;
            } else {
                cartItem.foodItems.push({ foodId, quantity });
            }
        }

        const savedCartItem = await cartItem.save();

        res.status(201).json({
            message: "Item added to cart successfully",
            cartItemId: savedCartItem._id,
            data: savedCartItem
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "An error occurred while adding item to cart" });
    }
};


exports.calculateTotalPrice = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        // Find the cart item by ID and populate the foodItems with details
        const cartItem = await CartItem.findById(cartItemId).populate('foodItems.foodId');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        let totalPrice = 0;

        // Iterate through each item in the foodItems array and calculate the total price
        cartItem.foodItems.forEach(item => {
            const price = item.foodId.price;
            const quantity = item.quantity;
            const itemTotalPrice = price * quantity;
            totalPrice += itemTotalPrice;
        });

        // Respond with the total price
        res.status(200).json({ total_price: totalPrice });
    } catch (error) {
        console.error("Error calculating total price:", error);
        res.status(500).json({ error: "An error occurred while calculating total price" });
    }
};


// Controller for removing an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { nic, foodId } = req.params;

        // Check if the required fields are provided
        if (!nic || !foodId) {
            return res.status(400).json({ error: "NIC and Food ID are required" });
        }

        // Find the cart item by NIC
        let cartItem = await CartItem.findOne({ nic });

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Find the food item in the cart
        const foodItemIndex = cartItem.foodItems.findIndex(item => item.foodId.equals(foodId));

        if (foodItemIndex === -1) {
            return res.status(404).json({ error: "Food item not found in cart" });
        }

        // Remove the food item from the cart
        cartItem.foodItems.splice(foodItemIndex, 1);

        // Save the updated cart item to the database
        const updatedCartItem = await cartItem.save();

        res.status(200).json({ 
            message: "Item removed from cart successfully", 
            data: updatedCartItem 
        });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: "An error occurred while removing item from cart" });
    }
};
exports.calculateTotalPrice = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        // Find the cart item by ID and populate the foodItems with details
        const cartItem = await CartItem.findById(cartItemId).populate('foodItems.foodId');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        let totalPrice = 0;

        // Iterate through each item in the foodItems array and calculate the total price
        cartItem.foodItems.forEach(item => {
            const price = item.foodId.price;
            const quantity = item.quantity;
            const itemTotalPrice = price * quantity;
            totalPrice += itemTotalPrice;
        });

        // Respond with the total price
        res.status(200).json({ total_price: totalPrice });
    } catch (error) {
        console.error("Error calculating total price:", error);
        res.status(500).json({ error: "An error occurred while calculating total price" });
    }
};
// Controller for fetching cart items by NIC and cartItemId
exports.getCartItemsByNIC = async (req, res) => {
    try {
        const { nic, cartItemId } = req.params;

        // Find the cart item by NIC and cartItemId and populate food details
        const cartItem = await CartItem.findOne({ nic, _id: cartItemId }).populate('foodItems.foodId', 'foodname price imageUrl');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({ data: cartItem.foodItems });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "An error occurred while fetching cart items" });
    }
};

// Controller for deleting a cart by NIC and cartItemId
exports.deleteCartByNICAndCartItemId = async (req, res) => {
    try {
        const { nic, cartItemId } = req.params;

        // Find the cart item by NIC and cartItemId
        const cartItem = await CartItem.findOneAndDelete({ nic, _id: cartItemId });

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ error: "An error occurred while deleting cart" });
    }
};