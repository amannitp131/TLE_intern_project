import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import "./cron/cfSync.js"; 
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", studentRoutes);
app.use("/api", exportRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

connectDB();





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
