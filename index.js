const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  rating: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not Valid`,
    },
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

//update a user by id
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          rating: req.body.rating,
          phone: req.body.phone,
          languages: req.body.languages,
        },
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      res.status(200).send({
        success: true,
        message: 'User is updated by id',
        data: updatedUser,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'User is not updated with the given id',
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//delete data by id
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedData = await User.findByIdAndDelete({ _id: id });
    if (deletedData) {
      res.status(200).send({
        success: true,
        message: 'deleted a single product',
        data: deletedData,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'user was not deleted with this id',
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//create users
app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      age: req.body.age,
      rating: req.body.rating,
      phone: req.body.phone,
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
app.get('/users', async (req, res) => {
  try {
    let users;
    const age = req.query.age;
    const rating = req.query.rating;

    if (age && rating) {
      users = await User.find({
        $and: [{ age: { $gt: age } }, { rating: { $gt: rating } }],
      });
    } else {
      users = await User.find().sort({ age: 1 });
    }

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

//Home page
app.get('/', (_req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await connectDB();
});
