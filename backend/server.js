import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import path from 'path';
import express from 'express';

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Set up static folder for uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
