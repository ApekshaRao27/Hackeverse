import express from "express";
import userRoutes from "./userRoutes.js";
import questionRoutes from "./question.routes.js";
import loginRoutes from "./login.Routes.js";


const router = express.Router();

router.use("/users", userRoutes);        
router.use("/questions", questionRoutes); 
router.use("/auth", loginRoutes);        

export default router;
