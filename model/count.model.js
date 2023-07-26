const mongoose = require("mongoose");

const countSchema = new mongoose.Schema({
  itemName: {
    type: String,
  },
  visitCount: {
    type: Number,
    default: 0
  },
});
module.exports = mongoose.model("Count", countSchema);
