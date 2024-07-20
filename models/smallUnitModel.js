const mongoose = require('mongoose');

const smallUnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    noPersons: { type: Number },
    type: { type: String, enum: ["apartment", "room"], },
    images: { type: String },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' }
  });
  
  const SmallUnit = mongoose.model('SmallUnit', smallUnitSchema);
  
  module.exports = SmallUnit;
  