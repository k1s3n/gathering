const hashPassword = require('../utils/hashPassword');
const User = require('../models/user');
const Event = require('../models/event');

// Function to create a new event
const createEvent = async (req, res) => {
  const { title, description, location, date, time } = req.body;

  try {
    // Create a new event instance with the provided data and user ID
    const newEvent = new Event({ 
      title,
      description,
      location,
      date,
      time,
      createdBy: req.user.userId  // Sätt createdBy till userId från autentiserad användare
    });

    await newEvent.save();  // Spara det nya evenemanget i databasen
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error.message); // Logga felmeddelande
    console.error('Error details:', error); // Logga alla detaljer om felet
    res.status(500).json({ error: 'Error creating event' });
  }
};

async function getEvents(req, res) {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
}


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

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Antag att du har en User modell och userId är tillgängligt i autentiseringsmiddlewaren
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Returnera användarinformation
    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      // Andra användarattribut som du vill returnera
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = {
    createUser,
    createEvent,
    getEvents,
    getUserInfo

  };