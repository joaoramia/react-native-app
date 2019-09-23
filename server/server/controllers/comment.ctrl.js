const User = require('../models/User');
const fakeGoogleResult = require('../helpers/fakeGoogleResult.json');
const Comment = require('../models/Comment');
const {googleMapsClient, getDistanceFromLatLonInKm} = require('../helpers/googleMapsApi')

exports.postComment = async (req, res, next) => {
  try {
    const {content, color} = req.body;
    const {userId} = req;
    console.log('----------- COORDS', req.body.coords);
    // googleMapsClient.reverseGeocode({latlng: {lat: 37.785834, lng: -122.406417}}, (err, res) => {
    //   console.log('-----------------------ERR: ', err);
    //   console.log('-----------------------RES: ', JSON.stringify(res));
    // })

    // put inside of googleMapsClient callback:
    // const geoResults = fakeGoogleResult.json.results || [];
    // const city = geoResults.reduce((prev, curr) => {
    //   const foundCity = (curr.address_components || []).reduce((prev2, curr2) => {
    //     if (curr2.types.indexOf('locality') >= 0) {
    //       return curr2;
    //     } else {
    //       return prev2;
    //     }
    //   }, null);
    //   return foundCity || prev;
    // }, null);

    // console.log('xxxxxxxxx', city);

    let comment;
    let coords;
    if (req.body.coords) {
      const { latitude, longitude } = req.body.coords;
      coords = {
        lat: latitude,
        lng: longitude
      }
      comment = new Comment({ content, color, userId, coords});
    } else {
      comment = new Comment({ content, color, userId});
    }
    
    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getComments = async (req, res, next) => {
  const coords = req.body.coords;
  console.log('=================', coords);
  try {
    let comments = await Comment.find({parentId: null}).sort({createdAt: 'descending'}).limit( 120 );

    comments = comments.map(comment => {
      let doc = {...comment._doc};
      if (comment.likedUsers && comment.likedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, liked: true};
      }
      if (comment.likedUsers && comment.dislikedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, disliked: true};
      }
      if (coords && coords.latitude && comment.coords && comment.coords.lat) {
        const distance = getDistanceFromLatLonInKm(coords.latitude, coords.longitude, comment.coords.lat, comment.coords.lng);
        doc = {...doc, distance};
      }
      return doc;
    })

    console.log(comments[0]);
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getComment = async (req, res, next) => {
  const coords = req.body.coords;
  const id = req.params.id;
  try {
    const comment = await Comment.findById(id);
    let postComments = await Comment.find({parentId: id}).sort({createdAt: 'ascending'}).limit( 100 );

    let doc = {...comment._doc};

    if (comment.likedUsers && comment.likedUsers.indexOf(req.userId) >= 0) {
      doc = {...doc, liked: true};
    }

    if (comment.likedUsers && comment.dislikedUsers.indexOf(req.userId) >= 0) {
      doc = {...doc, disliked: true};
    }

    if (coords && coords.latitude && comment.coords && comment.coords.lat) {
      const distance = getDistanceFromLatLonInKm(coords.latitude, coords.longitude, comment.coords.lat, comment.coords.lng);
      doc = {...doc, distance};
    }

    postComments = postComments.map(comment => {
      let doc = {...comment._doc};
      if (comment.likedUsers && comment.likedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, liked: true};
      }
      if (comment.likedUsers && comment.dislikedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, disliked: true};
      }
      return doc;
    })
    
    res.status(200).send({ comment: doc, postComments });
  } catch (err) {
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.likeComment = async (req, res, next) => {
  const {id, value} = req.body;

  try {
    let comment;
    if (value > 0) {
      comment = await Comment.findByIdAndUpdate(id, {$inc: {likes: 1}, $push: {likedUsers: req.userId}});
    } else {
      comment = await Comment.findByIdAndUpdate(id, {$inc: {likes: -1}, $push: {dislikedUsers: req.userId}});
    }

    res.status(200).send({ comment });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.reportAbuse = async (req, res, next) => {
  const {id} = req.body;
  
  try {
    const comment = await Comment.findByIdAndUpdate(id, {$inc: {reportAbuse: 1}});

    res.status(200).send({ comment });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.commentPost = async (req, res, next) => {
  console.log('---------------------------', req.body.content, req.body.postId, req.userId);
  try {
    const {content, postId, color} = req.body;
    const {userId} = req;
    console.log('----------- COORDS', req.body.coords);
    // googleMapsClient.reverseGeocode({latlng: {lat: 37.785834, lng: -122.406417}}, (err, res) => {
    //   console.log('-----------------------ERR: ', err);
    //   console.log('-----------------------RES: ', JSON.stringify(res));
    // })

    // put inside of googleMapsClient callback:
    // const geoResults = fakeGoogleResult.json.results || [];
    // const city = geoResults.reduce((prev, curr) => {
    //   const foundCity = (curr.address_components || []).reduce((prev2, curr2) => {
    //     if (curr2.types.indexOf('locality') >= 0) {
    //       return curr2;
    //     } else {
    //       return prev2;
    //     }
    //   }, null);
    //   return foundCity || prev;
    // }, null);

    // console.log('xxxxxxxxx', city);

    let comment;
    let coords;
    if (req.body.coords) {
      const { latitude, longitude } = req.body.coords;
      coords = {
        lat: latitude,
        lng: longitude
      }
      comment = new Comment({ parentId: postId, content, userId, color, coords, likes: 0, likedUsers: [], dislikedUsers: []});
    } else {
      comment = new Comment({ parentId: postId, content, userId, color, likes: 0, likedUsers: [], dislikedUsers: []});
    }

    await comment.save();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const {userId} = req;
    const coords = req.body.coords;
    let comments = await Comment.find({userId, parentId: null}).sort({createdAt: 'descending'}).limit( 200 );

    comments = comments.map(comment => {
      let doc = {...comment._doc};
      if (comment.likedUsers && comment.likedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, liked: true};
      }
      if (comment.likedUsers && comment.dislikedUsers.indexOf(req.userId) >= 0) {
        doc = {...doc, disliked: true};
      }

      if (coords && coords.latitude && comment.coords && comment.coords.lat) {
        const distance = getDistanceFromLatLonInKm(coords.latitude, coords.longitude, comment.coords.lat, comment.coords.lng);
        doc = {...doc, distance};
      }
      return doc;
    })

    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};
