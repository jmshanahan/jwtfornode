const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./app/models/user');


const port = process.env.PORT || 8080;
mongoose.connect(config.database, (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
});

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send(`Hello The api is at http://localhost:${port}/api`);
});
app.get('/setup', (req, res) => {
  const iolearn = new User({
    name: 'joe7',
    password: '12342',
    admin: true,
  });
  iolearn.save((err) => {
    if (err) throw err;
    // console.log('User saved successfully');
    res.json({ success: true });
  });
});

const apiRoutes = express.Router();
app.use('/api', apiRoutes);

// Router to authenticate a user  (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {
  User.findOne({ name: 'iolearn' }, (err, user) => {
    if (err) { throw err; }
    if (!user) {
      res.json({ success: false, message: 'Authentication failed err. Wrong password' });
    } else if (user) {
      if (user.password !== req.body.password) {
        console.log(`user password ${user.password} body password ${req.body.password}`);
        res.json({ success: false, message: 'Authentication failed. Wrong password' });
      } else {
        const token = jwt.sign(user.toJSON(), app.get('superSecret'), { expiresIn: 604800 });
        res.json({
          success: true,
          message: 'Enjoy the token',
          token,
        });
      }
    }
  });
});

// route middleware to verify token

apiRoutes.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'failed to authenticate token' });
      }
      // everything is good, save to request for use in other routes.
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided',
    });
  }
});


apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth' });
});


apiRoutes.get('/users', (req, res) => {
  User.findOne({ }, (err, users) => {
    res.json(users);
  });
});

app.listen(port);

