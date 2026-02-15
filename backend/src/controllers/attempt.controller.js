import mongoose from "mongoose";
import { Attempt } from "../models/Attempt.js";
import { QuestionSet } from "../models/Question.js";

export const createAttempt = async (req, res) => {
  try {
    const { studentId, questionSetId, answers } = req.body;
    if (!studentId || !questionSetId || !Array.isArray(answers))
      return res.status(400).json({ error: "studentId, questionSetId and answers are required" });

    const score = answers.reduce((s, a) => s + (a.correct ? 1 : 0), 0);

    const attempt = await Attempt.create({ studentId, questionSetId, answers, score });
    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeakPointsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const by = req.query.by || "topic"; // 'topic' or 'question'
    const minAttempts = parseInt(req.query.minAttempts) || 3;
    const threshold = parseFloat(req.query.threshold) || 0.4;

    if (!mongoose.Types.ObjectId.isValid(studentId))
      return res.status(400).json({ error: "Invalid studentId" });

    if (by === "question") {
      const pipeline = [
        { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
        { $unwind: "$answers" },
        { $group: {
            _id: { questionSetId: "$questionSetId", questionIndex: "$answers.questionIndex" },
            total: { $sum: 1 },
            incorrect: { $sum: { $cond: [{ $eq: ["$answers.correct", false] }, 1, 0] } }
        }},
        { $project: {
            questionSetId: "$_id.questionSetId",
            questionIndex: "$_id.questionIndex",
            total: 1,
            incorrect: 1,
            incorrectRate: { $divide: ["$incorrect", "$total"] }
        }},
        { $match: { total: { $gte: minAttempts }, incorrectRate: { $gte: threshold } } },
        { $sort: { incorrectRate: -1 } }
      ];

      const results = await Attempt.aggregate(pipeline);

      const enriched = await Promise.all(results.map(async r => {
        const qs = await QuestionSet.findById(r.questionSetId).lean();
        const question = qs && qs.questions && qs.questions[r.questionIndex];
        return {
          questionSetId: r.questionSetId,
          questionIndex: r.questionIndex,
          questionText: question ? question.questionText : null,
          total: r.total,
          incorrect: r.incorrect,
          incorrectRate: r.incorrectRate
        };
      }));

      return res.json(enriched);
    }

    // default: group by topic (uses the QuestionSet.topic)
    const pipeline = [
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      { $lookup: {
          from: "questionsets",
          localField: "questionSetId",
          foreignField: "_id",
          as: "qset"
      }},
      { $unwind: "$qset" },
      { $unwind: "$answers" },
      { $addFields: { topic: "$qset.topic" } },
      { $group: {
          _id: "$topic",
          total: { $sum: 1 },
          incorrect: { $sum: { $cond: [{ $eq: ["$answers.correct", false] }, 1, 0] } }
      }},
      { $project: {
          topic: "$_id",
          total: 1,
          incorrect: 1,
          incorrectRate: { $divide: ["$incorrect", "$total"] }
      }},
      { $match: { total: { $gte: minAttempts }, incorrectRate: { $gte: threshold } } },
      { $sort: { incorrectRate: -1 } }
    ];

    const results = await Attempt.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
