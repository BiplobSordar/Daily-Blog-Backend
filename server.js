import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";


dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ["https://daily-blog-liard.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
     
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, 
  })
);
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Server Error" });
});



app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
