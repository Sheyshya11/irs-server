const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
 
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ssid: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: String,
      default: "Vairav Technology",
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    quantity: {
      type: Number,
      default: 0,
    },

    quality: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    adminIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Status: {
      //occupied status after approval
      type: Boolean,
      default: false,
    },
    ReturnStatus: {
      type: Boolean,
      default: false,
    },
    userIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
