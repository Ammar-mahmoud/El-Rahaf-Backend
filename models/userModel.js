const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "name must"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "last name must"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "phone must"],
      unique: [true, "phone must be unique"],
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, "password must"],
      minlength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "worker"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setImageURL = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};
// findOne, findAll and update
userSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
userSchema.post('save', (doc) => {
  setImageURL(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
