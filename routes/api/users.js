// The collection name will be 'users'
// because we create it in that file users.js???
// answer: apparently no, it's because in 'User' (models/User.js) we have
// a model called 'user', so MongoDB makes the collection name 'users'

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs'); // To incript user password
const jwt = require('jsonwebtoken'); // Access to private/protected routes
const config = require('config'); // To get contents from 'config' directory
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// // @route     GET api/users
// // @desc      Test route
// // @access    Public
//router.get('/', (req, res) => res.send('User route'));

// @route     POST api/users
// @desc      Register user
// @access    Public
router.post(
  '/',
  [
    // Second param of 'check' method is custom error message
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // req.body is obj/JSON with data that send to that route
    //console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Not to write 'req.body' each time
    const { name, email, password } = req.body;

    try {
      // Find if there is some (unique) email in 'User' ('users' collection in MongoDB)
      // 'findOne' is Mongoose method
      let user = await User.findOne({ email }); // email: email

      // See if user exists in 'users' collection in MongoDB
      if (user) {
        return res.status(400).json({
          errors: [{ msg: `User already exists` }],
          //errors: [{ msg: `User with ${email} email already exists` }],
        });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // default string size
        r: 'pg', // rating
        d: 'mm', // default
      });

      // User created by let user = await User.findOne({ email });
      user = new User({
        name,
        email,
        avatar,
        password, // Not encrypted password
      });

      // Encrypt password
      // 10 rounds recommended - secure enough and not slow
      const salt = await bcrypt.genSalt(10);

      // 'hash' method takes original password and make hash to it
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //res.send('User registered succesfully!');

      const payload = {
        user: {
          id: user.id, // Not must be user._id because monggoose has abstraction
        },
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

/*
  Why the collection created in MongoDB is called 'users'?

  We import the User model and use it in the route and because in the User schema file in models/User.js we export
  module.exports = User = mongoose.model('user', UserSchema);
  which actually could be just
  module.exports = mongoose.model('user', UserSchema);
  Mongoose gets the 'user' word we define here and pluralizes as it creates the collection in the MongoDB database.`
*/
