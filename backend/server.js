require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const searchRoutes = require("./routes/searchRoutes");
const reviewsRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const cors = require("cors");
const path = require("path");
const compression = require("compression");

app.use(cors({ origin: "http://localhost:5173" })); // autorise uniquement le front React
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});