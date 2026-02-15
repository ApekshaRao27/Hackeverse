import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selected: { type: String },
  correct: { type: Boolean, required: true }
});

const attemptSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionSetId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionSet", required: true },
    answers: { type: [answerSchema], required: true },
    score: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Attempt = mongoose.model("Attempt", attemptSchema);
