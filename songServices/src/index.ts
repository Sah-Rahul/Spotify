import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import songRouter from "./routes"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', songRouter)
app.listen(PORT, () => { 
  console.log(`server is running on port ${PORT}`);
});
