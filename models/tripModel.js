const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    regiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Regiment', required: true },
    smallUnitID: { type: mongoose.Schema.Types.ObjectId, ref: 'SmallUnit', required: true },
    remaining: { type: Number, required: true },
    quantity: { type: Number, required: true },
    active: { type: Boolean, default: false },
    price: { type: Number, required: true }
});

tripSchema.path('price').validate((value) => value > 0, 'Price must be positive');
tripSchema.path('quantity').validate((value) => value > 0, 'Quantity must be positive');

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
