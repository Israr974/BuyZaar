import UserCartProduct from "../models/UserCartProduct.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, priceAtAddTime } = req.body;
    const userId = req.user.id;

    console.log(" Add to cart request:", { 
      productId, 
      quantity, 
      priceAtAddTime,
      userId 
    });

   
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "ProductId is required" 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    
    let finalPrice = priceAtAddTime;
    
    if (!finalPrice || finalPrice <= 0) {
      finalPrice = product.price || product.sellingPrice || product.currentPrice || 0;
    }

    console.log(" Final price to save:", finalPrice);

    
    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price"
      });
    }

    
    const qty = quantity && quantity > 0 ? parseInt(quantity) : 1;


    let cartItem = await UserCartProduct.findOne({ userId, productId });
    
    if (cartItem) {
   
      cartItem.quantity += qty;
      cartItem.priceAtAddTime = finalPrice; 
      cartItem.updatedAt = new Date();
      await cartItem.save();
      
      console.log(" Updated existing cart item");
    } else {
      
      cartItem = await UserCartProduct.create({
        userId,
        productId,
        quantity: qty,
        priceAtAddTime: finalPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(" Created new cart item");
    }


    try {
      const user = await User.findById(userId);
      if (user) {
        const userCartIndex = user.shopping_cart.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (userCartIndex !== -1) {
          
          user.shopping_cart[userCartIndex].quantity += qty;
        } else {
         
          user.shopping_cart.push({ 
            productId, 
            quantity: qty 
          });
        }
        
        await user.save();
        console.log(" Updated user shopping cart");
      }
    } catch (userUpdateError) {
      console.warn(" Could not update user shopping cart:", userUpdateError.message);
      
    }

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cartItem
    });

  } catch (error) {
    console.error(" Add to Cart Error:", error);
    
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};


export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(" Fetching cart for user:", userId);

    const cartItems = await UserCartProduct.find({ userId })
      .populate("productId", "name price image stock discount originalPrice")
      .lean();

 
    const formattedCart = cartItems.map(item => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtAddTime: item.priceAtAddTime,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    console.log(` Found ${formattedCart.length} cart items`);

    return res.status(200).json({
      success: true,
      message: "Cart products fetched successfully",
      data: formattedCart
    });

  } catch (error) {
    console.error(" Get Cart Products Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart"
    });
  }
};


export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "ProductId and quantity are required"
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative"
      });
    }

    if (quantity === 0) {
      
      await UserCartProduct.findOneAndDelete({ userId, productId });
      
      
      await User.findByIdAndUpdate(userId, {
        $pull: { shopping_cart: { productId } }
      });

      return res.json({
        success: true,
        message: "Item removed from cart"
      });
    }

    
    const cartItem = await UserCartProduct.findOneAndUpdate(
      { userId, productId },
      { 
        quantity,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

  
    await User.findOneAndUpdate(
      { _id: userId, "shopping_cart.productId": productId },
      { $set: { "shopping_cart.$.quantity": quantity } }
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
      data: cartItem
    });

  } catch (error) {
    console.error(" Update Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart"
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required"
      });
    }

    console.log(` Removing product ${productId} from cart for user ${userId}`);

    
    const result = await UserCartProduct.findOneAndDelete({ userId, productId });

    if (!result) {
      console.log(" Item not found in UserCartProduct");
    }

   
    await User.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: { productId } }
    });

    console.log(" Product removed from both collections");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully"
    });

  } catch (error) {
    console.error(" Remove from Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove from cart"
    });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(` Clearing cart for user ${userId}`);

   
    await UserCartProduct.deleteMany({ userId });

    
    await User.findByIdAndUpdate(userId, {
      $set: { shopping_cart: [] }
    });

    console.log(" Cart cleared successfully");

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error(" Clear Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart"
    });
  }
};


export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await UserCartProduct.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: { count }
    });

  } catch (error) {
    console.error(" Get Cart Count Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get cart count"
    });
  }
};