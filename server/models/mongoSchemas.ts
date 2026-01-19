import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserSession = mongoose.model('UserSession', userSessionSchema);

const interviewAnswerSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSession' },
  question: String,
  answer: String,
  timestamp: { type: Date, default: Date.now }
});

export const InterviewAnswer = mongoose.model('InterviewAnswer', interviewAnswerSchema);

const interviewReportSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSession' },
  overallScore: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

export const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);
