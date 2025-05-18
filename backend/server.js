require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const searchRoutes = require("./routes/searchRoutes");
const reviewsRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const userPublicRoutes = require("./routes/userPublicRoutes");
const followRoutes = require("./routes/followRoutes");
const app = express();
const cors = require("cors");
const path = require("path");
const compression = require("compression");

const allowedOrigins = [
    "http://localhost:5173", //local dev
    "https://bookbox-pi.vercel.app" //prod
];

app.use(cors({ 
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
 })); // autorise uniquement le front React
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(compression());

app.get("/", (req, res) => {
    res.send("API is running...");
  });
  

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/search", searchRoutes); 
app.use("/api/reviews", reviewsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/publicUsers", userPublicRoutes);
app.use("/api/follows", followRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});