// filepath: backend/models/emailModel.js
import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Email = mongoose.model('Email', emailSchema);

export default Email;