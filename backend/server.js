import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from "express";
import cors from 'cors';
import studentRoutes from "./routes/studentRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import { sendInactivityEmails } from './utils/inactivityEmail.js'; 
import "./cron/cfSync.js"; 
dotenv.config();


const app = express();
app.use(cors()); 
app.use(express.json());

app.use("/api", studentRoutes);
app.use("/api", exportRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

connectDB();

setInterval(() => {
    sendInactivityEmails().catch(err => {
        console.error("Interval email error:", err.message);
    });
}, 24 * 60 * 60 * 1000);

sendInactivityEmails().catch(err => {
    console.error("Startup email error:", err.message);
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));