import { Question } from "../models/Question.js";

export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getQuestionsByTopicAndDifficulty = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const filter = {};

    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid question id" });
    }
    res.status(500).json({ error: err.message });
  }
};
