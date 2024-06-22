const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // New protected routes
const app = express();
const port = process.env.PORT || 4000;



app.use(cors());
app.use(bodyParser.json());

console.log('MONGO_URI:', process.env.MONGO_URI); // Debug log to check if MONGO_URI is loaded
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log to check if JWT_SECRET is loaded

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
