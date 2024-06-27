import express from 'express';
import Connection from './database/db.js';
import dotenv from 'dotenv';
import defaultData from './defaultData.js';
import Router from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path'; // Import path module for file path operations



const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const PORT = process.env.PORT || 8000; // Use the provided PORT or default to 8000
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Router);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

Connection(USERNAME, PASSWORD);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Load default data (assuming this is a function to initialize some data)
defaultData();

export { app }; // Export the app for testing or potential future use
