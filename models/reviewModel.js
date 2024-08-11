const mongoose = require('mongoose');
const Building = require('./buildingModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    building: {
      type: mongoose.Schema.ObjectId,
      ref: 'Building',
      required: [true, 'Review must belong to Building'],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: ['firstName', "profileImg"]});
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  buildingId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific Building
    {
      $match: { building:  buildingId},
    },
    // Stage 2: Grouping reviews based on buildingID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'building',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Building.findByIdAndUpdate(buildingId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Building.findByIdAndUpdate(buildingId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.building);
});

reviewSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.building);
  }
});

module.exports = mongoose.model('Review', reviewSchema);