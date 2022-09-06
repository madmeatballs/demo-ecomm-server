const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1."],
        default: 1,
    },
    total: {
        type: Number,
        required: true,
    }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at", } }
);

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    items: [
        CartItemSchema,
    ],
}, 
   { timestamps: {  createdAt: "created_at", updatedAt: "updated_at", } }
);

module.exports = mongoose.model("cart", CartSchema);