/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const cors = require('cors');
require('dotenv').config();

/**
 * Controllers (route handlers).
 */
const userController = require('./controllers/user.ctrl');
const commentController = require('./controllers/comment.ctrl');

/**
 * Create Express server.
 */
const app = express();

// Jwt middleware
const isAuthenticated = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['authorization'];

  token = token ? token.replace('Bearer ', '') : token;

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        console.log('fail', decoded, err);
        return res.status(403).send({ message: 'Failed to authenticate token.' });
      } else {
        console.log('success', decoded);
        const { id } = decoded;
        // if everything is good, save to request for use in other routes
        req.userId = id;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

console.log(process.env)
/**
 * Connect to MongoDB.
 */
mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${
    process.env.MONGO_PASSWORD
  }@ds259596.mlab.com:59596/feedback-app`,
  { useNewUrlParser: true }
);
mongoose.connection.on('error', err => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connected');
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);

app.set('superSecret', config.secret); // secret variable

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

/**
 * Primary app routes.
 */
app.post('/api/signup', userController.postSignup);
app.post('/api/login', userController.postLogin);
app.get('/api/me', isAuthenticated, userController.getUser);
app.put('/api/me', isAuthenticated, userController.updateUser);
app.get(`/api/users/${config.adminToken}`, userController.getAllUsers);
app.post('/api/comments', isAuthenticated, commentController.getComments);
app.get('/api/comments/:id', isAuthenticated, commentController.getComment);
app.post('/api/comment', isAuthenticated, commentController.postComment);
app.post('/api/commentPost', isAuthenticated, commentController.commentPost);
app.post('/api/comment/like', isAuthenticated, commentController.likeComment);
app.post('/api/comment/reportAbuse', isAuthenticated, commentController.reportAbuse);
app.get('/api/me/comments', isAuthenticated, commentController.getUserComments);

app.use(express.static(path.join(__dirname, '../client/portal/build')));
app.use('/cdn/', express.static(path.join(__dirname, '../client/lib')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/portal/build/index.html'));
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
