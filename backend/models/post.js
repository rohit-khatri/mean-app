const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  description: String,
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
