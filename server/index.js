// Import necessary modules
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';

// Import routes and database connection
import Router from './routes/route.js';
import Connection from './database/db.js';
import defaultData from './defaultData.js';

// Initialize dotenv to load environment variables
dotenv.config();

// Get current directory and filename (__dirname and __filename in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'frontend/build' directory for production
app.use(express.static(join(__dirname, 'frontend', 'build')));

// Define API routes
app.use('/', Router);

// Connect to MongoDB (assuming Connection function handles this)
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
Connection(USERNAME, PASSWORD);

// Endpoint to serve the React app's index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'frontend', 'build', 'index.html'));
});

// Multer configuration for file uploads (example)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Example endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Load default data (assuming this is a function to initialize some data)
defaultData();

// Export the app for testing or potential future use
export { app };
