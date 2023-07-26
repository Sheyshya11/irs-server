const mongoose = require("mongoose");

const requestItemSchema = new mongoose.Schema(
  {
    Status: { type: Boolean , default: false},
    itemName: { type: String },
    itemIdlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Item",
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    RequiredUnit: {
      type: Number,
      default: 1,
    },
    GrantedUnit:{
      type: Number,
      default: 0,
    },
    DeliveryDate: { type: Date, required: true },
    Purpose: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestItem", requestItemSchema);
