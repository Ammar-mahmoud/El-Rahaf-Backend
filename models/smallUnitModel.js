const mongoose = require("mongoose");

const smallUnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  noPersons: { type: Number, required: true },
  type: { type: String, enum: ["apartment", "room"], required: true },
  images: [{ type: String, required: true }],
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
});

const setImageURL = (doc) => {
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/smallUnits/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

// findOne, findAll and update
smallUnitSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
smallUnitSchema.post("save", (doc) => {
  setImageURL(doc);
});

const SmallUnit = mongoose.model("SmallUnit", smallUnitSchema);

module.exports = SmallUnit;
