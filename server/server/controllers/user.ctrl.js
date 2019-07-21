const User = require('../models/User');

/**
 * POST /signup
 */
exports.postSignup = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(403).send({ message: 'Password is required' });
    }
    const user = new User(req.body);

    user.setPassword(password);
    user.generateSiteToken();

    await user.save();

    const token = user.generateJWT();

    res.status(200).send({
      token
    });
  } catch (err) {
    console.error(`[UserCtrl#postLogin] ${err}`);
    return res.status(403).send({ message: err });
  }
};

/**
 * POST /login
 */
exports.postLogin = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).send({ message: 'User does not exist' });
    } else if (user.validPassword(password)) {
      const token = user.generateJWT();
      return res.status(200).send({
        token
      });
    } else {
      return res.status(403).send({ message: 'Wrong credentials' });
    }
  } catch (err) {
    console.error(`[UserCtrl#postLogin] ${err}`);
    return res.status(403).send({ message: 'Something went wrong.' });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(404).send({ message: 'User not found' });
    }
    const user = await User.findById(userId);
    const { name, email, id, siteUrl, siteToken } = user;

    res.status(200).send({ name, email, id, siteUrl, siteToken });
  } catch (err) {
    return res.status(403).send({ message: 'Something went wrong.' });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name } = req.body;
    let updateQuery = {};

    if (name) {
      updateQuery = { ...updateQuery, name };
    }

    await User.findByIdAndUpdate(req.userId, updateQuery);
    res.status(200).send({
      success: true
    });
  } catch (err) {
    return res.status(403).send({ message: 'Something went wrong.' });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      users
    });
  } catch (err) {
    return res.status(403).send({ message: 'Something went wrong.' });
  }
};
