const User = require('../models/User');
const Comment = require('../models/Comment');

exports.postComment = async (req, res, next) => {
  try {
    const data = req.body;
    console.log('===========', data);

    const comment = new Comment({ content: data.content });
    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({});
    console.log('COMMENTS', comments);
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};
