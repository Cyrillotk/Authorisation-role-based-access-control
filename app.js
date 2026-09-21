require('dotenv').config();

const express = require('express');
const session = require('express-session');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/', authRoutes);
app.use('/', userRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found.'
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render('error', {
    message: 'Something went wrong.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});