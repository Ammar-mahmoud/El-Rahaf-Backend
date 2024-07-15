const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["tower", "hotel"], required: true },
    smallUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: "SmallUnit" }],
    description: { type: String },
    avgReview: { type: Number },
    noReviewers: { type: Number },
    location: {
      type: String,
      enum: [
        "elsokhna",
        "marsa matrouh",
        "alexandria",
        "sharm el-sheikh",
        "hurghada",
        "dahab",
      ],
    },
    coverImage: { type: String },
    images: { type: String },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

buildingSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "building",
  localField: "_id",
});

buildingSchema.virtual("trips", {
  ref: "Review",
  foreignField: "building",
  localField: "_id",
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/buildings/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/buildings/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

// findOne, findAll and update
buildingSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
buildingSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;
