import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'rejestrator'], default: 'rejestrator' },
  isActive: { type: Boolean, default: true },
  blocked: { type: Boolean, default: false },
  temporaryPassword: { type: String },
  temporaryPasswordExpires: { type: Date },
}, { timestamps: true });

userSchema.methods.matchPassword = function(enteredPassword, callback) {
  const isMatch = enteredPassword === this.password;
  callback(null, isMatch);
};

const User = mongoose.model('User', userSchema);

export default User;