const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  date: { type: Date, required: true },
  time: { type: String, required: true},
  postCreated: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: 'events' }); // Specify collection name

module.exports = mongoose.model('Event', eventSchema);