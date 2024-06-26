const hashPassword = require('../utils/hashPassword');
const User = require('../models/user');
const Event = require('../models/event');
const Comment = require('../models/comment');

// Function to create a new event
const createEvent = async (req, res) => {
  const { title, description, location,latitude, longitude, date, time } = req.body;

  try {
    // Create a new event instance with the provided data and user ID
    const newEvent = new Event({ 
      title,
      description,
      location,
      latitude,
      longitude,
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
    const now = new Date(); // Current date and time
    now.setHours(0, 0, 0, 0); // Set time to start of today (midnight)

    const events = await Event.find({ date: { $gte: now } }).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
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
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      // Andra användarattribut som du vill returnera
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Event.find({ createdBy: user._id });
    const count = posts.length;
    const sortedPosts = posts.sort((a, b) => new Date(b.postCreated) - new Date(a.postCreated));

    res.json({
      posts,
      count,
      latestPost: sortedPosts[0],
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateUserInfo = async (req, res) => {
  const { username, email, phone, firstname, lastname } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    await user.save();

    const updatedUser = await User.findById(req.user.userId);

    res.json({
      message: 'User updated successfully',
      user: {
        userId: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname
      }
    });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.eventId })
      .populate({
        path: 'user',
        select: 'username email firstname lastname', // Select fields you want to populate
      })
      .exec();

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
};


const createComment = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId is extracted from JWT payload
    const { eventId, text } = req.body;

    // Validate input fields
    if (!eventId || !text) {
      return res.status(400).json({ error: 'Event ID and text are required fields' }); // Return error if eventId or text is missing
    }

    // Create the comment
    const newComment = new Comment({
      user: userId, // Assigning userId extracted from JWT payload
      eventId,
      text,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
};

const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, time, location, latitude, longitude } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.latitude = latitude || event.latitude;
    event.longitude = longitude || event.longitude;
    await event.save();
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
    createUser,
    createEvent,
    getEvents,
    getUserInfo,
    updateUserInfo,
    getUserPosts,
    getComments,
    createComment,


  };