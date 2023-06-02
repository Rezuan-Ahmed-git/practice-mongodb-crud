const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

//connect with database
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDb');
    console.log('Database is connected');
  } catch (error) {
    console.log('Not connected');
    console.log(error);
    process.exit(1);
  }
};

app.get('/', (_req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
