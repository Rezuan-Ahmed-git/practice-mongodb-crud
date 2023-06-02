const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(express.json());

//create user schema
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//create user Model
const User = mongoose.model('Users', usersSchema);

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

//create users
app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      age: req.body.age,
      languages: req.body.languages,
    });

    //save to database
    const userData = await newUser.save();

    res.status(201).send(userData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
//get all users
app.get('/users', async (_req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).send({
        success: true,
        message: 'return all users',
        data: users,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'users not found',
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//get a single user by id
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).send({
        success: true,
        message: 'returned a single user',
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'not found',
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/', (_req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
