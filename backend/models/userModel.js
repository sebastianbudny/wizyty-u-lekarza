import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'rejestrator'], default: 'rejestrator' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.methods.matchPassword = function(enteredPassword) {
  return enteredPassword === this.password;
};

const User = mongoose.model('User', userSchema);

export default User;