const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false }
});

const EngagementSchema = new Schema({
  story: { type: Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],         // store user ids who liked
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }],
  comments: [CommentSchema],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Virtuals / helpers
EngagementSchema.methods.avgRating = function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((s, r) => s + r.value, 0);
  return sum / this.ratings.length;
};

module.exports = mongoose.model('Engagement', EngagementSchema);
