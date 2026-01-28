const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  googleid: { type: String, unique: true },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  myBounties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bounty' }]
});


module.exports = mongoose.model("user", UserSchema)
