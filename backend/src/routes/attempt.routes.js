import express from "express";
import { createAttempt, getWeakPointsByStudent } from "../controllers/attempt.controller.js";

const router = express.Router();

router.post("/", createAttempt); // record an attempt
router.get("/weak-points/:studentId", getWeakPointsByStudent); // compute weak points for a student

export default router;
