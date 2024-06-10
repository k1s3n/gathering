const hashPassword = require('../utils/hashPassword');
const User = require('../models/user');
const Event = require('../models/event');

async function createEvent(userId, eventData) {
  try {
    // Create a new event instance with the provided data and user ID
    const newEvent = new Event({ ...eventData, createdBy: userId });
    await newEvent.save();
    console.log('Event created successfully');
  } catch (error) {
    console.error('Error creating event:', error);
    // Optionally, throw the error to handle it in the caller
    // throw error;
  }
}

async function createUser(username, password, email,phone,firstname,lastname) {
  try {
  const hashedPassword = await hashPassword(password);
  const user = new User({ username, password: hashedPassword, email,phone,firstname,lastname });
  await user.save();
  console.log('User created successfully');
  } catch(error){
    console.error('Error creating user:', error);
   
  }
}




module.exports = {
    createUser,
    createEvent
  };