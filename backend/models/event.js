const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true},
  postCreated: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: 'events' }); // Specify collection name

module.exports = mongoose.model('Event', eventSchema);