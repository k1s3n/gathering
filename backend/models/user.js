const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String},
  password: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true, sparse: true },
  firstname: { type: String },
  lastname: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  userCreated: { type: Date, default: Date.now },
  userUpdated: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    const currentDate = new Date();
    this.userUpdated = currentDate;
    if (!this.userCreated) {
        this.userCreated = currentDate;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);