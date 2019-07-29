const User = require('../models/User');
const Comment = require('../models/Comment');

exports.postComment = async (req, res, next) => {
  try {
    const {content} = req.body;
    const {userId} = req;

    const comment = new Comment({ content, userId});
    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({}).sort({createdAt: 'descending'});
    console.log('COMMENTS', comments);
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const {userId} = req;
    const comments = await Comment.find({userId});
    console.log('COMMENTS', comments);
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};
