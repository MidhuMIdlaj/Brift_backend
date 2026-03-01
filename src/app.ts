import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"; 
import authRoutes from "./interface/routers/auth-router.js";
import registrationRoutes from "./interface/routers/registration-company-router.js";
import morgan  from "morgan";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));
app.use(express.json());

connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/registration', registrationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});