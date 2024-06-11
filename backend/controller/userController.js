const hashPassword = require('../utils/hashPassword');
const User = require('../models/user');
const Event = require('../models/event');

// Function to create a new event
const createEvent = async (req, res) => {
  const { userId, title, description, location, date, time } = req.body;

  try {
    // Create a new event instance with the provided data and user ID
    const newEvent = new Event({ title, description, location, date, time, createdBy: userId });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
};




// Function to create a new user
const createUser = async (req, res) => {
  const { username, password, email, phone, firstname, lastname, role, userCreated, userUpdated } = req.body;

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user instance
    const user = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      firstname,
      lastname,
      role,
      userCreated,
      userUpdated
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // If an error occurs, log it and send an error response
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};





module.exports = {
    createUser,
    createEvent,

  };