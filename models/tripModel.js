const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    smallUnitID: { type: mongoose.Schema.Types.ObjectId, ref: 'SmallUnit' },
    startDate: { type: Date },
    endDate: { type: Date },
    remaining: { type: Number },
    quantity: { type: Number },
    price: { type: Number }
  });


  tripSchema.index({ startDate: 1, endDate: 1 }, { unique: true });
  const Trip = mongoose.model('Trip', tripSchema);
  
  module.exports = Trip;
  