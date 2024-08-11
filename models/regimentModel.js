const mongoose = require('mongoose');

const regimentSchema = new mongoose.Schema({
    building:{ type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    activities: [{type: String, required: true}]
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

regimentSchema.virtual("trips", {
  ref: "Trip",
  foreignField: "regiment",
  localField: "_id",
});

  regimentSchema.index({ startDate: 1, endDate: 1 }, { unique: true });
  const Trip = mongoose.model('Regiment', regimentSchema);
  
  module.exports = Trip;
  