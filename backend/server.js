require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173" })); // autorise uniquement le front React
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/search", searchRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});