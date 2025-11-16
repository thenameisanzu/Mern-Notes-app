const express = require ("express");
const mongoose = require ("mongoose");
const cors = require ("cors")
require ("dotenv").config()

const app = express();
const PORT = process.env.PORT||5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch( err => console.log("MongoDB connection error:", err ));


const notesRoute = require ("./routes/notes");
app.use("/api/notes", notesRouter);

app.get("/",(req,res) => {
    res.send("Server is running!");
});