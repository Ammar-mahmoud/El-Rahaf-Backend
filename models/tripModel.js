const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    regiment:{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true},
    smallUnitID: { type: mongoose.Schema.Types.ObjectId, ref: 'SmallUnit', required: true},
    remaining: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
})

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;

/* 
{
    building :{
        regiment: [
    26-28 {
        single {
        re : 3
        price: 170 
        },
        double
    }
]
    }
 }*/