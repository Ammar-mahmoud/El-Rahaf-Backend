const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["tower", "hotel"], required: true },
    description: { type: String },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      enum: [
        "elsokhna-السخنة",
        "marsa matrouh-مرسي مطروح",
        "alexandria-اسكندرية",
        "sharm el-sheikh-شرم الشيخ",
        "hurghada-الغردقة",
        "dahab-دهب",
        "Elfayoum-الفيوم"
      ],
    },
    imageCover: { type: String, required: true},
    images: [{ type: String }],
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

buildingSchema.virtual("regiments", {
  ref: "Regiment",
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
