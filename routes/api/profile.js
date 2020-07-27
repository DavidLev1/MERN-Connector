const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
// const Post = require('../../models/Post');

// const axios = require('axios');
// const config = require('config');

const { check, validationResult } = require('express-validator');
// // bring in normalize to give us a proper url, regardless of what user entered
// const normalize = require('normalize-url');
// const checkObjectId = require('../../middleware/checkObjectId');

// @route     GET api/profile
// @desc      Test route
// @access    Public
//router.get('/', (req, res) => res.send('Profile route'));

// @route    GET api/profile/me (api/profile gives all profiles)
// @desc     Get current users profile
// @access   Private
// auth - executes middleware in middleware/auth.js file
// (we add that param when we have private route, which we must protect)
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // user = Profile(ProfileSchema).user(has ref to the user of that profile)
      user: req.user.id,

      // 'populate' adds stuff to query
      // here we add from user (a model name) next stuff:
      // name and avatar from UserSchema
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Params we can/must get in req.body
    const {
      company,
      website,
      location,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    // if req.body.company, we put its value to profileFields.company...
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Turn skills to an array
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // console.log(skills); // skills as passed in req.body.skills
    // console.log(profileFields.skills); // array of skills
    //res.send(skills);

    // Build social (media links) object and add to profileFields
    profileFields.social = {};

    // if req.body.youtube, put it in profileFields.social.youtube
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // req.user.id comes from token
      let profile = await Profile.findOneAndUpdate({ user: req.user.id });

      //console.log('profile !== null: ', profile !== null);

      // If profile found
      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    // populate - add 'name' and 'avatar' from 'users' collection
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted (with its profile and posts)' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/profile/experience
// // @desc     Add profile experience
// // @access   Private
// router.put(
//   '/experience',
//   [
//     auth,
//     [
//       check('title', 'Title is required').not().isEmpty(),
//       check('youtube', 'Company is required').not().isEmpty(),
//       check('from', 'From date is required and needs to be from the past')
//         .not()
//         .isEmpty()
//         .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       title,
//       youtube,
//       location,
//       from,
//       to,
//       current,
//       description
//     } = req.body;

//     const newExp = {
//       title,
//       youtube,
//       location,
//       from,
//       to,
//       current,
//       description
//     };

//     try {
//       const profile = await Profile.findOne({ user: req.user.id });

//       profile.experience.unshift(newExp);

//       await profile.save();

//       res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// // @route    DELETE api/profile/experience/:exp_id
// // @desc     Delete experience from profile
// // @access   Private

// router.delete('/experience/:exp_id', auth, async (req, res) => {
//   try {
//     const foundProfile = await Profile.findOne({ user: req.user.id });

//     foundProfile.experience = foundProfile.experience.filter(
//       (exp) => exp._id.toString() !== req.params.exp_id
//     );

//     await foundProfile.save();
//     return res.status(200).json(foundProfile);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Server error' });
//   }
// });

// // @route    PUT api/profile/education
// // @desc     Add profile education
// // @access   Private
// router.put(
//   '/education',
//   [
//     auth,
//     [
//       check('school', 'School is required').not().isEmpty(),
//       check('degree', 'Degree is required').not().isEmpty(),
//       check('fieldofstudy', 'Field of study is required').not().isEmpty(),
//       check('from', 'From date is required and needs to be from the past')
//         .not()
//         .isEmpty()
//         .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description
//     } = req.body;

//     const newEdu = {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description
//     };

//     try {
//       const profile = await Profile.findOne({ user: req.user.id });

//       profile.education.unshift(newEdu);

//       await profile.save();

//       res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// // @route    DELETE api/profile/education/:edu_id
// // @desc     Delete education from profile
// // @access   Private

// router.delete('/education/:edu_id', auth, async (req, res) => {
//   try {
//     const foundProfile = await Profile.findOne({ user: req.user.id });
//     foundProfile.education = foundProfile.education.filter(
//       (edu) => edu._id.toString() !== req.params.edu_id
//     );
//     await foundProfile.save();
//     return res.status(200).json(foundProfile);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Server error' });
//   }
// });

// // @route    GET api/profile/github/:username
// // @desc     Get user repos from Github
// // @access   Public
// router.get('/github/:username', async (req, res) => {
//   try {
//     const uri = encodeURI(
//       `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
//     );
//     const headers = {
//       'user-agent': 'node.js',
//       Authorization: `token ${config.get('githubToken')}`
//     };

//     const gitHubResponse = await axios.get(uri, { headers });
//     return res.json(gitHubResponse.data);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(404).json({ msg: 'No Github profile found' });
//   }
// });

module.exports = router;
