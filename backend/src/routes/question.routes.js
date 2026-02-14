import express from "express";
import {
  createQuestion,
  getQuestionsByTopicAndDifficulty,
  deleteQuestionById,
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/", createQuestion);
router.get("/", getQuestionsByTopicAndDifficulty);
router.delete("/:id", deleteQuestionById);

export default router;
