const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Access to private/protected routes
const config = require('config'); // To get contents from 'config' directory
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// // @route     GET api/auth
// // @desc      Test route
// // @access    Public
//router.get('/', (req, res) => res.send('Auth route'));

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
// auth - executes middleware in middleware/auth.js file
router.get('/', auth, async (req, res) => {
  //res.send('Auth route');
  //console.log(req.user);

  try {
    // req.user we get from middleware/auth.js file
    // select('-password') - to not include password although it incripted
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Authanticate (Login) user & get token
// @access    Public
router.post(
  '/',
  [
    // Second param of 'check' method is custom error message
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // req.body is obj/JSON with data that send to that route
    //console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Not to write 'req.body' each time
    const { email, password } = req.body;

    try {
      // Find if there is some (unique) email in 'User' ('users' collection in MongoDB)
      let user = await User.findOne({ email }); // email: email

      // See if user exists in 'users' collection in MongoDB
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: `Invalid credentials` }],
          //errors: [{ msg: `User with ${email} email already exists` }],
        });
      }

      //res.send('User authenticated successfully!');

      // Check if password matches
      // 'password' - plain password user types to log in
      // 'user.password' - incripted password of registered user
      const isMatch = await bcrypt.compare(password, user.password);
      // console.log('Encrypted Password: ', user.password);
      // console.log('Plain Password: ', password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: `Invalid credentials` }],
          //errors: [{ msg: `${password} is not correct password` }],
        });
      }

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
