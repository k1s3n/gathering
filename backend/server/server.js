const mongoose = require('mongoose');

// MongoDB connection URL - using environment variable
const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/gathering?authSource=admin';

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    // Optionally, you can throw an error here to handle it in the caller
    // throw err;
  }
}

module.exports = {
  connectToMongoDB
};