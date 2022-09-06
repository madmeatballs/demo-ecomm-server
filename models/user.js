const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at", } }
);

module.exports = mongoose.model("user", UserSchema);