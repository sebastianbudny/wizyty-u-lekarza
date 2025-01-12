import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'registrar', 'superadmin'], default: 'registrar' },
  isActive: { type: Boolean, default: true },

  askForAdminAcess: { type: Boolean, default: false, requierd: false },
  reasonForAdmin: { type: String, requierd: false},
  approvedBySuperAdmin: { type: Boolean, requierd: false },
  
  password: { type: String, required: false },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;