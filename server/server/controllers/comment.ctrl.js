const User = require('../models/User');
const fakeGoogleResult = require('../helpers/fakeGoogleResult.json');
const Comment = require('../models/Comment');
const {googleMapsClient, getDistanceFromLatLonInKm} = require('../helpers/googleMapsApi')

exports.postComment = async (req, res, next) => {
  try {
    const {content} = req.body;
    const {userId} = req;
    console.log('----------- COORDS', req.body.coords);
    // googleMapsClient.reverseGeocode({latlng: {lat: 37.785834, lng: -122.406417}}, (err, res) => {
    //   console.log('-----------------------ERR: ', err);
    //   console.log('-----------------------RES: ', JSON.stringify(res));
    // })

    // put inside of googleMapsClient callback:
    const geoResults = fakeGoogleResult.json.results || [];
    const city = geoResults.reduce((prev, curr) => {
      const foundCity = (curr.address_components || []).reduce((prev2, curr2) => {
        if (curr2.types.indexOf('locality') >= 0) {
          return curr2;
        } else {
          return prev2;
        }
      }, null);
      return foundCity || prev;
    }, null);

    console.log('xxxxxxxxx', city);

    let comment;
    let coords;
    if (req.body.coords) {
      const { latitude, longitude } = req.body.coords;
      coords = {
        lat: latitude,
        lng: longitude
      }
      comment = new Comment({ content, userId, city: city.long_name, coords});
    } else {
      comment = new Comment({ content, userId, city: city.long_name});
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
    let comments = await Comment.find({}).sort({createdAt: 'descending'});
    if (coords) {
      comments = comments.map(comment => {
        if (comment.coords && comment.coords.lat) {
          console.log(typeof coords.latitude, typeof coords.longitude, typeof comment.coords.lat, typeof comment.coords.lng);
          // console.log(getDistanceFromLatLonInKm(coords.lat, coords.lng, comment.coords.lat, comment.coords.lng));
          const distance = getDistanceFromLatLonInKm(coords.latitude, coords.longitude, comment.coords.lat, comment.coords.lng);
          console.log(distance);
          return {...comment._doc, distance};
        }
        return comment;
      })
    }
    console.log(comments[0]);
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const {userId} = req;
    const comments = await Comment.find({userId}).sort({createdAt: 'descending'});
    res.status(200).send({ comments });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};
