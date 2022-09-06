const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');

module.exports.add = async (params) => {
    //check if user exists
    if(await this.userExists(params)) {
        return {success: false, message: "User Already Exists"};
    }

    let user = new User ({
        name: params.name,
    });

    return user.save().then((user, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: user};
    });
};

module.exports.userExists = (params) => User.find({ name: new RegExp('^' + params.name.trim() + '$', 'i') }).then(result => {
    return result.length > 0 ? true : false;
});

module.exports.get = async (params) => {
    const user = await User.findById(params.userId).populate('cart');
    return user;
};

module.exports.getAll = async () => {
    const result = await User.find({}).populate('cart');
    return result;
};

module.exports.edit = (id, data) => {
    //check if user exists

    if(this.userExists(data)) {
        return {success: false, message: "User Already Exists"};
    }

    return User.findByIdAndUpdate(
        {_id: id}, data, {useFindAndModify: false}).then((user, err) => {
            return(err) ? {success: false, message: err} : {success: true, message: user};
        });
};

module.exports.deleteUser = async (id, data) => {
    const user = await User.findByIdAndDelete({ _id: id }, data);
    return (err) ? { success: false, message: err } : { success: true, message: user };
};

module.exports.getCart = async (params) => {
    const userCart = await Cart.findOne({ userId: params.userId }).populate('items.product');
    
    return userCart;
};

module.exports.addCartItem = async (id, data) => {
    const userCart = await Cart.findOne({ userId: id }).populate('items.product');

    const product = await Product.findById(data.productId);
    
    if(userCart === null) {
        let cart = new Cart ({
            items: [{
                product: data.productId,
                quantity: data.quantity,
                total: product.price * data.quantity,
            }],
            userId: id,
        });
        return cart.save().then((cart, err) => {
            return (err) ? { success: false, message: err } : { success: true, message: cart };
        });
    } else {
        //check if product exists in cart
        let cartItem = userCart.items.find(item => item.product._id == data.productId);
        if(cartItem) {
            cartItem.quantity += 1;
            cartItem.total = product.price * cartItem.quantity;
        } else {
            userCart.items.push({
                product: data.productId,
                quantity: 1,
                total: product.price * data.quantity,
            });
        }
        return userCart.save().then(cart => {
            return cart;
        });
    }
};

module.exports.updateCartItemQuantity = async (id, data) => {
    const userCart = await Cart.findOne({ userId: id }).populate('items.product');
    let cartItem = userCart.items.find(item => item.product._id == data.productId);

    //decrease by one
    if(data.quantity == -1) {
        if(cartItem.quantity > 1) {
            cartItem.quantity += data.quantity;
            cartItem.total = cartItem.product.price * cartItem.quantity;
        } else {
            userCart.items = userCart.items.filter(item => item.product._id != data.productId);
        }
    }
    //increase by one
    if(data.quantity == 1) {
        cartItem.quantity += data.quantity;
        cartItem.total = cartItem.product.price * cartItem.quantity;
    }
    return userCart.save().then(cart => {
        return cart;
    });
};

module.exports.removeCartItem = async (id, data) => {
    const userCart = await Cart.findOne({ userId: id}).populate('items.product');
    let cartItem = userCart.items.find(item => item.product._id == data.productId);
    if(cartItem) {
        userCart.items.pull(cartItem);
    }
    return userCart.save().then(cart => {
        return cart;
    });
};

module.exports.clearCart = async (id) => {
    const userCart = await Cart.findOne({ userId: id }).populate('items.product');
    userCart.items = [];
    return userCart.save().then(cart => {
        return cart;
    });
};